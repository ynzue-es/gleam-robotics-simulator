<div align="center">

# Gleam Robotics

**Téléopération de bras robotiques — landing + simulateur 3D d'un bras 6 axes**

Un opérateur, plusieurs postes, zéro déplacement. Ce projet montre l'idée
côté vitrine, et la prouve côté technique avec un simulateur 3D dont l'API
calque un **PCA9685 + servos** — la logique se transpose directement vers du
vrai code Arduino.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-r184-000)](https://threejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Aperçu

L'application est en deux parties :

| Route          | Rôle                                                                       |
| -------------- | -------------------------------------------------------------------------- |
| **`/`**        | Landing marketing — dark, éditoriale, animations Framer Motion + 3D au scroll |
| **`/simulator`** | Simulateur 3D d'un bras 6 axes, pilotable au slider ou par séquences      |

Tout tourne **côté client** : pas de backend, pas de base de données, pas de
`localStorage`. Ça se déploie tel quel sur n'importe quel hébergeur statique
Next.js.

## 🚀 Démarrer

```bash
git clone https://github.com/<votre-compte>/gleam-robotics-simulator.git
cd gleam-robotics-simulator

npm install
npm run dev      # → http://localhost:3000
```

Autres commandes :

```bash
npm run build    # build de production
npm run start    # sert le build
npm run lint     # ESLint
```

## 🧱 Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5**
- **Tailwind CSS v4** (config CSS-first dans `globals.css`) + composants façon shadcn/ui
- **Framer Motion** + **GSAP** (animations de la landing, 3D au scroll)
- **Three.js** + `@react-three/fiber` + `@react-three/drei` (simulateur)

## 📁 Architecture

```
src/
├── app/
│   ├── layout.tsx          # polices, thème, metadata SEO
│   ├── page.tsx            # landing (compose les sections)
│   ├── simulator/page.tsx  # héberge SimulatorClient
│   └── globals.css         # @theme Tailwind v4 (tokens dark)
├── components/
│   ├── ui/                 # Button, Card, Slider, Textarea (shadcn-like)
│   ├── landing/            # Hero, ProblemSolution, Demo, RobotShowcase, Footer…
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

> **Three.js + Next.js** — Le canvas WebGL est *client-only* : `RobotScene`
> (`"use client"`) est chargé via `dynamic(() => import('./RobotScene'),
> { ssr: false })`. La chaîne cinématique est faite de `<group>` imbriqués —
> chaque articulation pivote autour de la précédente.

## 🤖 API miroir Arduino

Le simulateur n'est pas qu'une démo visuelle : chaque méthode de
[`lib/robot/servoApi.ts`](src/lib/robot/servoApi.ts) porte son équivalent C++
en commentaire, pour que le code se recopie vers un sketch réel.

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

### Axes du bras

| Ch | Axe            | Mouvement              |
| -- | -------------- | ---------------------- |
| 0  | Base           | yaw (rotation Y)       |
| 1  | Épaule         | pitch                  |
| 2  | Coude          | pitch                  |
| 3  | Poignet pitch  | pitch                  |
| 4  | Poignet roll   | rotation outil         |
| 5  | Pince          | 0 fermée → 180 ouverte |

### Séquences

Syntaxe proche de l'Arduino, **analysée (jamais `eval`)** puis jouée sur le
bras. Un exemple *pick & place* commenté est pré-chargé dans l'éditeur.

```js
home();
moveTo([60, 70, 120, 90, 90, 180]);  // au-dessus de l'objet
delay(300);
setServo(5, 20);                      // fermer la pince
```

## 🧩 Extensibilité

Le code est structuré pour accueillir, sans refonte :

1. **Vision / tri** — point d'insertion balisé dans `RobotScene.tsx`
   (`SceneEnvironment`, commentaire « module vision/tri »). La logique
   « détecte couleur → va chercher → trie » s'appuie sur `RobotController`
   (et, au besoin, une cinématique inverse à ajouter dans `kinematics.ts`).
2. **Mode téléopération** — pilotage par une source externe (gant connecté) :
   il suffit d'appeler `controller.setServo()` / `moveTo()` ; le contrôleur est
   déjà découplé de l'UI.

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Forkez le dépôt et créez une branche (`git checkout -b feature/ma-feature`)
2. Committez vos changements
3. `npm run lint` doit passer
4. Ouvrez une Pull Request

Pour un bug ou une idée, ouvrez une *issue* — discutons-en avant les gros chantiers.

## 📄 Licence

Distribué sous licence **MIT**. Voir [`LICENSE`](LICENSE) pour le détail.

---

<div align="center">
Réalisé par <strong>Gleam</strong> — studio d'automatisation industrielle.
</div>
