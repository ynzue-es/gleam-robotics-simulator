# Gleam · Robotics — Téléopération de bras robotiques

Application Next.js (App Router, TypeScript) en deux parties :

- **`/`** — landing marketing (dark, éditoriale, Framer Motion).
- **`/simulator`** — simulateur 3D d'un bras 6 axes dont l'API calque un
  **PCA9685 + servos**, pour que la logique se transpose directement vers le
  vrai code Arduino.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (config CSS-first dans `globals.css`) + composants façon shadcn/ui
- Framer Motion (animations landing)
- Three.js + `@react-three/fiber` + `@react-three/drei` (simulateur)

Tout est **côté client**, sans backend ni base de données, sans `localStorage`.

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # polices, thème, metadata
│   ├── page.tsx            # landing (compose les sections)
│   ├── simulator/page.tsx  # héberge SimulatorClient
│   └── globals.css         # @theme Tailwind v4 (tokens dark)
├── components/
│   ├── ui/                 # Button, Card, Slider, Textarea (shadcn-like)
│   ├── landing/            # Hero, ProblemSolution, HowItWorks, Demo, Footer…
│   └── simulator/
│       ├── RobotCanvas.tsx     # frontière SSR → dynamic(import, { ssr:false })
│       ├── RobotScene.tsx      # "use client" — Canvas + chaîne cinématique
│       ├── AxisControls.tsx    # panneau gauche : 6 sliders
│       ├── SequenceEditor.tsx  # panneau bas : éditeur + transport
│       └── SimulatorClient.tsx # assemble le tout
└── lib/robot/              # ⭐ cœur "robot", isolé et portable
    ├── config.ts           # axes, canaux PCA9685, géométrie, vitesses
    ├── servoApi.ts         # angleToPulse + RobotController (miroir Arduino)
    ├── sequenceRunner.ts   # parseur + exécuteur de séquences
    ├── kinematics.ts       # angle servo → rotation 3D
    └── useRobotController.ts # hook React (lecture throttlée des angles)
```

### Contrainte Three.js + Next.js

Le canvas WebGL est **client-only** : `RobotScene` (avec `"use client"`) est
importé via `dynamic(() => import('./RobotScene'), { ssr: false })` dans
`RobotCanvas`. `OrbitControls` est importé depuis `@react-three/drei` (jamais
en global). La chaîne cinématique est faite de `<group>` imbriqués — chaque
articulation pivote autour de la précédente (parentage correct).

## API miroir Arduino (`lib/robot/servoApi.ts`)

Chaque méthode porte son équivalent C++ en commentaire :

| TypeScript                  | Arduino / C++                                  |
| --------------------------- | ---------------------------------------------- |
| `setServo(channel, angle)`  | `pwm.setPWM(channel, 0, angleToPulse(angle));` |
| `getServo(channel)`         | `return servoAngle[channel];`                  |
| `moveTo(angles[])`          | boucle de slew bornée en vitesse               |
| `delay(ms)`                 | `delay(ms);`                                   |
| `home()`                    | `moveTo({90,90,90,90,90,90});`                 |
| `angleToPulse(angle)`       | `map(angle, 0, 180, 150, 600);`                |

Les mouvements sont interpolés via `useFrame` (`controller.tick(dt)`), à une
vitesse en °/s, pour imiter l'inertie d'un servo.

### Axes

| Ch | Axe            | Mouvement          |
| -- | -------------- | ------------------ |
| 0  | Base           | yaw (rotation Y)   |
| 1  | Épaule         | pitch              |
| 2  | Coude          | pitch              |
| 3  | Poignet pitch  | pitch              |
| 4  | Poignet roll   | rotation outil     |
| 5  | Pince          | 0 fermée → 180 ouverte |

### Séquences

Syntaxe proche de l'Arduino, **analysée (pas `eval`)** puis jouée sur le bras :

```js
home();
moveTo([60, 70, 120, 90, 90, 180]);  // au-dessus de l'objet
delay(300);
setServo(5, 20);                       // fermer la pince
```

Un exemple **pick & place** commenté est pré-chargé dans l'éditeur.

## Extensibilité

Le code est structuré pour accueillir, sans refonte :

1. **Vision / tri** — une zone avec cubes de couleur + cartons de destination.
   Point d'insertion balisé dans `RobotScene.tsx` (`SceneEnvironment`,
   commentaire « module vision/tri »). La logique « détecte couleur → va
   chercher → trie » s'appuiera sur `RobotController` (et, au besoin, une
   cinématique inverse à ajouter dans `kinematics.ts`).
2. **Mode téléopération** — pilotage par entrées externes (gant connecté).
   Il suffit d'appeler `controller.setServo()` / `moveTo()` depuis une nouvelle
   source d'entrée ; le contrôleur est déjà découplé de l'UI.

La logique de séquence (`sequenceRunner.ts`) est volontairement isolée et
recopiable vers un sketch Arduino.
```
