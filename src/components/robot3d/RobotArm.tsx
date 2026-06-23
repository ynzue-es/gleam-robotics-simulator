"use client";

/**
 * RobotArm.tsx — Le bras 6 axes, chaîne cinématique parentée.
 *
 * Composant 3D pur, réutilisé par le simulateur ET la vitrine de la landing.
 * Doit être rendu à l'intérieur d'un <Canvas>. À chaque frame :
 *   1. on avance l'interpolation du contrôleur (inertie servo) ;
 *   2. on applique les angles courants aux pivots imbriqués.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { RobotController } from "@/lib/robot/servoApi";
import { AXES, SEGMENTS } from "@/lib/robot/config";
import { jointRotationRad, gripperOpening01 } from "@/lib/robot/kinematics";
import { steelBase, accentProps, type Palette } from "./palette";

export function RobotArm({
  controller,
  palette,
}: {
  controller: RobotController;
  palette: Palette;
}) {
  // Réfs vers les pivots des 5 articulations de chaîne (axes 0..4).
  const jointRefs = useRef<(THREE.Group | null)[]>([]);
  // Réfs vers les deux doigts de la pince (axe 5).
  const fingerLeft = useRef<THREE.Mesh | null>(null);
  const fingerRight = useRef<THREE.Mesh | null>(null);

  const S = SEGMENTS;

  useFrame((_, delta) => {
    // Clamp du delta pour éviter les sauts (onglet en arrière-plan, etc.).
    controller.tick(Math.min(delta, 0.05));

    for (let i = 0; i < 5; i++) {
      const group = jointRefs.current[i];
      if (!group) continue;
      const axis = AXES[i];
      group.rotation[axis.axis] = jointRotationRad(axis, controller.current[i]);
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
        <meshStandardMaterial {...steelBase} color={palette.socle} />
      </mesh>

      {/* ── Axe 0 : BASE (yaw, rotation Y) ───────────────────────────── */}
      <group ref={setJointRef(0)} position={[0, S.baseHeight, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[S.linkRadius * 1.4, S.linkRadius * 1.6, 0.24, 32]} />
          <meshStandardMaterial {...accentProps} />
        </mesh>

        {/* ── Axe 1 : ÉPAULE (pitch, rotation Z) ─────────────────────── */}
        <group ref={setJointRef(1)} position={[0, 0.24, 0]}>
          <mesh position={[0, S.shoulderLength / 2, 0]} castShadow>
            <cylinderGeometry args={[S.linkRadius, S.linkRadius, S.shoulderLength, 32]} />
            <meshStandardMaterial {...steelBase} color={palette.arm} />
          </mesh>

          {/* ── Axe 2 : COUDE (pitch, rotation Z) ────────────────────── */}
          <group ref={setJointRef(2)} position={[0, S.shoulderLength, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[S.linkRadius * 1.15, 24, 24]} />
              <meshStandardMaterial {...steelBase} color={palette.joint} />
            </mesh>
            <mesh position={[0, S.forearmLength / 2, 0]} castShadow>
              <cylinderGeometry args={[S.linkRadius * 0.85, S.linkRadius * 0.85, S.forearmLength, 32]} />
              <meshStandardMaterial {...steelBase} color={palette.arm} />
            </mesh>

            {/* ── Axe 3 : POIGNET PITCH (rotation Z) ─────────────────── */}
            <group ref={setJointRef(3)} position={[0, S.forearmLength, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[S.linkRadius * 0.95, 24, 24]} />
                <meshStandardMaterial {...steelBase} color={palette.joint} />
              </mesh>
              <mesh position={[0, S.wristLength / 2, 0]} castShadow>
                <cylinderGeometry args={[S.linkRadius * 0.7, S.linkRadius * 0.7, S.wristLength, 32]} />
                <meshStandardMaterial {...steelBase} color={palette.arm} />
              </mesh>

              {/* ── Axe 4 : POIGNET ROLL (rotation Y) ────────────────── */}
              <group ref={setJointRef(4)} position={[0, S.wristLength, 0]}>
                <mesh position={[0, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[S.linkRadius * 0.9, S.linkRadius * 0.9, 0.16, 24]} />
                  <meshStandardMaterial {...accentProps} />
                </mesh>

                {/* ── Axe 5 : PINCE (écartement des doigts) ──────────── */}
                <group position={[0, 0.16, 0]}>
                  <mesh position={[0, S.toolLength * 0.2, 0]} castShadow>
                    <boxGeometry args={[S.linkRadius * 1.8, S.toolLength * 0.4, S.linkRadius * 1.2]} />
                    <meshStandardMaterial {...steelBase} color={palette.joint} />
                  </mesh>
                  <mesh
                    ref={fingerLeft}
                    position={[-0.06, S.toolLength * 0.5 + S.fingerLength / 2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[S.fingerThickness, S.fingerLength, S.fingerThickness * 2]} />
                    <meshStandardMaterial {...steelBase} color={palette.finger} />
                  </mesh>
                  <mesh
                    ref={fingerRight}
                    position={[0.06, S.toolLength * 0.5 + S.fingerLength / 2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[S.fingerThickness, S.fingerLength, S.fingerThickness * 2]} />
                    <meshStandardMaterial {...steelBase} color={palette.finger} />
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
