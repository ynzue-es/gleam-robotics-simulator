"use client";

/**
 * RobotScene.tsx — Canvas Three.js du simulateur + bras 6 axes.
 *
 * ⚠️ Composant CLIENT-ONLY : il touche au DOM/WebGL. Il est importé via
 * `dynamic(() => import('./RobotScene'), { ssr: false })` dans RobotCanvas.tsx.
 *
 * Le bras (chaîne cinématique) et la palette sont partagés avec la vitrine de
 * la landing — voir src/components/robot3d/.
 */

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

import { RobotController } from "@/lib/robot/servoApi";
import { RobotArm } from "@/components/robot3d/RobotArm";
import { SCENE_PALETTE, type Palette, type Theme } from "@/components/robot3d/palette";

interface RobotSceneProps {
  controller: RobotController;
  theme?: Theme;
}

function SceneEnvironment({ palette }: { palette: Palette }) {
  return (
    <>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
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

export default function RobotScene({
  controller,
  theme = "dark",
}: RobotSceneProps) {
  const palette = SCENE_PALETTE[theme];

  return (
    <Canvas
      // "percentage" => PCFShadowMap (désormais doux). On évite ainsi le défaut
      // `shadows`=true → PCFSoftShadowMap, déprécié et bugué depuis three r0.182.
      shadows="percentage"
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
      <directionalLight position={[-4, 6, 9]} intensity={0.7} />
      <pointLight position={[-6, 4, -4]} intensity={30} color="#2dd4bf" />
      <hemisphereLight args={palette.hemi} />

      <SceneEnvironment palette={palette} />
      <RobotArm controller={controller} palette={palette} />

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
