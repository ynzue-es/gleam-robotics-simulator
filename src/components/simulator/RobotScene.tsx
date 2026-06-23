"use client";

/**
 * RobotScene.tsx — Canvas Three.js + bras 6 axes.
 *
 * ⚠️ Composant CLIENT-ONLY : il touche au DOM/WebGL. Il est importé via
 * `dynamic(() => import('./RobotScene'), { ssr: false })` dans RobotCanvas.tsx.
 *
 * Architecture :
 *   - <Canvas> de @react-three/fiber
 *   - OrbitControls importé depuis @react-three/drei (jamais d'import implicite)
 *   - Le bras est une chaîne cinématique de <group> imbriqués : chaque
 *     articulation pivote autour de la précédente (parentage correct).
 *   - useFrame avance l'interpolation du contrôleur puis applique les rotations.
 */

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

import { RobotController } from "@/lib/robot/servoApi";
import { AXES, SEGMENTS } from "@/lib/robot/config";
import { jointRotationRad, gripperOpening01 } from "@/lib/robot/kinematics";

type Theme = "dark" | "light";

interface RobotSceneProps {
  controller: RobotController;
  theme?: Theme;
}

/** Palette de la scène 3D par thème (fond, brouillard, sol, grille, lumière). */
const SCENE_PALETTE = {
  dark: {
    background: "#0a0a0b",
    fog: "#0a0a0b",
    floor: "#0c0c0e",
    gridCell: "#1f1f26",
    gridSection: "#2dd4bf",
    ambient: 0.4,
    hemi: ["#3a4a55", "#0a0a0b", 0.5] as [string, string, number],
  },
  light: {
    background: "#e9ebee",
    fog: "#e9ebee",
    floor: "#dde0e5",
    gridCell: "#c6ccd3",
    gridSection: "#0d9488",
    ambient: 0.9,
    hemi: ["#ffffff", "#c9ced6", 0.8] as [string, string, number],
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────
//  Le bras articulé
// ───────────────────────────────────────────────────────────────────────────

/**
 * Matériau « acier » des segments.
 * IMPORTANT : metalness volontairement modéré (≈0.45). Sans environment map
 * (HDR), un matériau très métallique n'a rien à réfléchir et rend quasi noir
 * → le bras devient invisible. Une part diélectrique suffisante le rend
 * visible sous l'éclairage direct, tout en gardant un aspect métal brossé.
 */
const metalProps = {
  color: "#8b919c",
  metalness: 0.45,
  roughness: 0.5,
} as const;

/** Acier plus sombre pour les rotules / jonctions. */
const jointProps = {
  color: "#5d626b",
  metalness: 0.45,
  roughness: 0.5,
} as const;

/** Accent menthe — émissif pour rester lisible quel que soit l'éclairage. */
const accentProps = {
  color: "#6ee7d4",
  metalness: 0.3,
  roughness: 0.35,
  emissive: "#0c3b34",
  emissiveIntensity: 0.5,
} as const;

function RobotArm({ controller }: RobotSceneProps) {
  // Réfs vers les pivots des 5 articulations de chaîne (axes 0..4).
  const jointRefs = useRef<(THREE.Group | null)[]>([]);
  // Réfs vers les deux doigts de la pince (axe 5).
  const fingerLeft = useRef<THREE.Mesh | null>(null);
  const fingerRight = useRef<THREE.Mesh | null>(null);

  const S = SEGMENTS;

  // Boucle de simulation : avance l'inertie des servos puis applique la pose.
  useFrame((_, delta) => {
    // Clamp du delta pour éviter les sauts (onglet en arrière-plan, etc.).
    controller.tick(Math.min(delta, 0.05));

    for (let i = 0; i < 5; i++) {
      const group = jointRefs.current[i];
      if (!group) continue;
      const axis = AXES[i];
      const rot = jointRotationRad(axis, controller.current[i]);
      group.rotation[axis.axis] = rot;
    }

    // Pince (axe 5) : écartement symétrique des deux doigts.
    const opening = gripperOpening01(controller.current[5]);
    const spread = 0.06 + opening * S.gripperMaxSpread;
    if (fingerLeft.current) fingerLeft.current.position.x = -spread;
    if (fingerRight.current) fingerRight.current.position.x = spread;
  });

  const setJointRef = (i: number) => (el: THREE.Group | null) => {
    jointRefs.current[i] = el;
  };

  return (
    <group>
      {/* Socle fixe posé au sol */}
      <mesh position={[0, S.baseHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[S.baseRadius, S.baseRadius * 1.15, S.baseHeight, 48]}
        />
        <meshStandardMaterial {...metalProps} color="#4a4e56" />
      </mesh>

      {/* ── Axe 0 : BASE (yaw, rotation Y) ───────────────────────────── */}
      <group ref={setJointRef(0)} position={[0, S.baseHeight, 0]}>
        {/* Bague d'accent à la base de la rotation */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[S.linkRadius * 1.4, S.linkRadius * 1.6, 0.24, 32]} />
          <meshStandardMaterial {...accentProps} />
        </mesh>

        {/* ── Axe 1 : ÉPAULE (pitch, rotation Z) ─────────────────────── */}
        <group ref={setJointRef(1)} position={[0, 0.24, 0]}>
          {/* Segment bras (le long de Y, part du pivot) */}
          <mesh position={[0, S.shoulderLength / 2, 0]} castShadow>
            <cylinderGeometry args={[S.linkRadius, S.linkRadius, S.shoulderLength, 32]} />
            <meshStandardMaterial {...metalProps} />
          </mesh>

          {/* ── Axe 2 : COUDE (pitch, rotation Z) ────────────────────── */}
          <group ref={setJointRef(2)} position={[0, S.shoulderLength, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[S.linkRadius * 1.15, 24, 24]} />
              <meshStandardMaterial {...jointProps} />
            </mesh>
            <mesh position={[0, S.forearmLength / 2, 0]} castShadow>
              <cylinderGeometry args={[S.linkRadius * 0.85, S.linkRadius * 0.85, S.forearmLength, 32]} />
              <meshStandardMaterial {...metalProps} />
            </mesh>

            {/* ── Axe 3 : POIGNET PITCH (rotation Z) ─────────────────── */}
            <group ref={setJointRef(3)} position={[0, S.forearmLength, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[S.linkRadius * 0.95, 24, 24]} />
                <meshStandardMaterial {...jointProps} />
              </mesh>
              <mesh position={[0, S.wristLength / 2, 0]} castShadow>
                <cylinderGeometry args={[S.linkRadius * 0.7, S.linkRadius * 0.7, S.wristLength, 32]} />
                <meshStandardMaterial {...metalProps} />
              </mesh>

              {/* ── Axe 4 : POIGNET ROLL (rotation Y) ────────────────── */}
              <group ref={setJointRef(4)} position={[0, S.wristLength, 0]}>
                {/* Platine outil */}
                <mesh position={[0, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[S.linkRadius * 0.9, S.linkRadius * 0.9, 0.16, 24]} />
                  <meshStandardMaterial {...accentProps} />
                </mesh>

                {/* ── Axe 5 : PINCE (écartement des doigts) ──────────── */}
                <group position={[0, 0.16, 0]}>
                  {/* base de pince */}
                  <mesh position={[0, S.toolLength * 0.2, 0]} castShadow>
                    <boxGeometry args={[S.linkRadius * 1.8, S.toolLength * 0.4, S.linkRadius * 1.2]} />
                    <meshStandardMaterial {...jointProps} />
                  </mesh>
                  {/* doigt gauche */}
                  <mesh
                    ref={fingerLeft}
                    position={[-0.06, S.toolLength * 0.5 + S.fingerLength / 2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[S.fingerThickness, S.fingerLength, S.fingerThickness * 2]} />
                    <meshStandardMaterial {...metalProps} color="#aab0b9" />
                  </mesh>
                  {/* doigt droit */}
                  <mesh
                    ref={fingerRight}
                    position={[0.06, S.toolLength * 0.5 + S.fingerLength / 2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[S.fingerThickness, S.fingerLength, S.fingerThickness * 2]} />
                    <meshStandardMaterial {...metalProps} color="#aab0b9" />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Sol + objets de scène (extensible : future zone de vision/tri)
// ───────────────────────────────────────────────────────────────────────────

type Palette = (typeof SCENE_PALETTE)[Theme];

function SceneEnvironment({ palette }: { palette: Palette }) {
  return (
    <>
      {/* Sol */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={palette.floor} metalness={0.2} roughness={0.9} />
      </mesh>

      {/* Grille de référence */}
      <Grid
        position={[0, 0, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.6}
        cellColor={palette.gridCell}
        sectionSize={5}
        sectionThickness={1}
        sectionColor={palette.gridSection}
        fadeDistance={40}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/*
        Emplacement réservé pour le futur module vision/tri :
        ici viendront les cubes de couleur + les cartons de destination.
        <PickZone /> et <SortingBins /> s'inséreront à ce niveau.
      */}
    </>
  );
}

// ───────────────────────────────────────────────────────────────────────────
//  Canvas
// ───────────────────────────────────────────────────────────────────────────

export default function RobotScene({
  controller,
  theme = "dark",
}: RobotSceneProps) {
  const palette = SCENE_PALETTE[theme];

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [6, 5, 7], fov: 45 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, 18, 45]} />

      {/* Éclairage */}
      <ambientLight intensity={palette.ambient} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {/* Lumière de remplissage côté caméra : garantit que le bras est lisible. */}
      <directionalLight position={[-4, 6, 9]} intensity={0.7} />
      <pointLight position={[-6, 4, -4]} intensity={30} color="#2dd4bf" />
      <hemisphereLight args={palette.hemi} />

      <SceneEnvironment palette={palette} />

      <OrbitControls
        makeDefault
        enablePan
        minDistance={3}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 2.5, 0]}
      />
    </Canvas>
  );
}
