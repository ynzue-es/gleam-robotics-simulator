"use client";

/**
 * ShowcaseScene.tsx — Vitrine 3D de la landing (client-only).
 *
 * Le bras « flotte » sur fond transparent (le dégradé CSS de la section
 * transparaît). La pose du bras ET la caméra sont pilotées par la progression
 * de scroll (`progressRef`), mise à jour par GSAP ScrollTrigger dans
 * RobotShowcase. Aucune interpolation servo ici : on écrit directement la pose
 * pour un scrub précis (le scroll = la timeline).
 */

import { useThree, useFrame, Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { MutableRefObject } from "react";

import { RobotController } from "@/lib/robot/servoApi";
import { RobotArm } from "@/components/robot3d/RobotArm";
import { SCENE_PALETTE, type Theme } from "@/components/robot3d/palette";

/**
 * Poses clés du bras le long du scroll (0 → 1). Récit pick & place :
 * repos → approche → saisie → rotation → dépose → relâche.
 * [base, épaule, coude, poignet_pitch, poignet_roll, pince]
 */
const SHOWCASE_POSES: number[][] = [
  [90, 75, 95, 95, 90, 120],
  [62, 120, 68, 70, 90, 170],
  [62, 95, 100, 88, 90, 28],
  [120, 88, 102, 92, 140, 28],
  [120, 122, 72, 68, 140, 28],
  [120, 90, 100, 90, 90, 170],
];

/** Interpole la pose pour une progression p ∈ [0,1]. */
function poseAt(p: number): number[] {
  const n = SHOWCASE_POSES.length - 1;
  const x = Math.min(0.99999, Math.max(0, p)) * n;
  const i = Math.floor(x);
  const t = x - i;
  const a = SHOWCASE_POSES[i];
  const b = SHOWCASE_POSES[Math.min(i + 1, n)];
  return a.map((v, k) => v + (b[k] - v) * t);
}

function ShowcaseDriver({
  controller,
  progressRef,
}: {
  controller: RobotController;
  progressRef: MutableRefObject<number>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progressRef.current;

    // Pose du bras (écriture directe : current == target).
    const pose = poseAt(p);
    for (let i = 0; i < 6; i++) {
      controller.current[i] = pose[i];
      controller.target[i] = pose[i];
    }

    // Caméra : léger travelling orbital + montée, synchronisé au scroll.
    // Reculée pour que le bras entier tienne dans le cadre.
    const az = -0.5 + p * 1.2; // azimut (rad)
    const radius = 14.5;
    const height = 5.4 + p * 1.4;
    camera.position.set(
      Math.sin(az) * radius,
      height,
      Math.cos(az) * radius
    );
    camera.lookAt(0, 2.9, 0);
  });

  return null;
}

export default function ShowcaseScene({
  controller,
  theme = "dark",
  progressRef,
}: {
  controller: RobotController;
  theme?: Theme;
  progressRef: MutableRefObject<number>;
}) {
  const palette = SCENE_PALETTE[theme];

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: [-7, 5.4, 12.7], fov: 42 }}
      gl={{ antialias: true, alpha: true }} // alpha => fond transparent
      style={{ background: "transparent" }}
    >
      {/* Éclairage */}
      <ambientLight intensity={palette.ambient + 0.1} />
      <directionalLight
        position={[6, 11, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={12}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-5, 6, 9]} intensity={0.8} />
      <pointLight position={[-6, 5, -4]} intensity={36} color="#2dd4bf" />
      <hemisphereLight args={palette.hemi} />

      {/* Ombre de contact douce sous le bras (rendu « flottant » premium) */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={theme === "dark" ? 0.55 : 0.35}
        scale={18}
        blur={2.6}
        far={9}
        color={theme === "dark" ? "#000000" : "#1a1a22"}
      />

      <ShowcaseDriver controller={controller} progressRef={progressRef} />
      <RobotArm controller={controller} palette={palette} />
    </Canvas>
  );
}
