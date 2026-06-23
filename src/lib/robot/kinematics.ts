/**
 * kinematics.ts — Conversions angle servo → rotation 3D.
 *
 * Isolé du rendu pour rester testable et réutilisable (ex. future cinématique
 * inverse pour le module de vision/tri).
 */

import { type AxisConfig } from "./config";

const DEG2RAD = Math.PI / 180;

/**
 * jointRotationRad — angle de rotation (radians) d'une articulation à partir
 * de la consigne servo (degrés), en tenant compte du sens et de l'offset neutre.
 */
export function jointRotationRad(axis: AxisConfig, angleDeg: number): number {
  return axis.dir * (angleDeg - axis.offsetDeg) * DEG2RAD;
}

/** Écartement (0..1) d'un doigt de pince à partir de l'angle du servo pince. */
export function gripperOpening01(angleDeg: number): number {
  // 0° => fermée (0), 180° => ouverte (1)
  return Math.min(1, Math.max(0, angleDeg / 180));
}
