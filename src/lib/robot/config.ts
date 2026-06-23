/**
 * config.ts — Définition matérielle du bras 6 axes.
 *
 * Tout ce qui décrit le robot (nombre d'axes, canaux PCA9685, plages d'angles,
 * géométrie des segments, vitesse des servos) est centralisé ici afin que la
 * logique de simulation et le rendu 3D partagent une seule source de vérité.
 *
 * Côté Arduino, chaque axe correspond à un canal d'un PCA9685 :
 *     Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(0x40);
 *     pwm.setPWM(channel, 0, angleToPulse(angle));
 */

/** Nombre d'axes (degrés de liberté) du bras. */
export const AXIS_COUNT = 6;

/** Plage d'angle d'un servo standard, en degrés. */
export const ANGLE_MIN = 0;
export const ANGLE_MAX = 180;

/**
 * Plage d'impulsion (« pulse count ») du PCA9685 pour un servo.
 * Le PCA9685 compte de 0 à 4095 sur sa période ; pour un servo classique,
 * la butée basse (~0°) tombe vers 150 et la butée haute (~180°) vers 600.
 * Ces valeurs sont à calibrer sur le vrai matériel.
 *
 * Équivalent C++ :
 *     #define SERVOMIN 150
 *     #define SERVOMAX 600
 */
export const SERVO_PULSE_MIN = 150;
export const SERVO_PULSE_MAX = 600;

/** Vitesse par défaut des servos, en degrés par seconde (imite l'inertie). */
export const DEFAULT_SPEED_DEG_PER_S = 120;

/** Position neutre du bras (tous les axes au centre). */
export const HOME_POSITION: number[] = [90, 90, 90, 90, 90, 90];

/** Axe de rotation local d'une articulation dans la scène Three.js. */
export type RotationAxis = "x" | "y" | "z";

/**
 * Description d'un axe / servo.
 * - `channel`  : canal PCA9685 (0..15).
 * - `label`    : nom lisible (UI).
 * - `axis`     : axe de rotation local du segment piloté.
 * - `dir`      : sens (+1 / -1) pour coller au montage mécanique réel.
 * - `offsetDeg`: décalage appliqué pour que 90° corresponde au neutre visuel.
 * - `kind`     : type de liaison — rotation de chaîne ou ouverture de pince.
 */
export interface AxisConfig {
  channel: number;
  label: string;
  description: string;
  axis: RotationAxis;
  dir: 1 | -1;
  offsetDeg: number;
  kind: "joint" | "gripper";
}

/**
 * Carte des 6 axes. L'ordre du tableau == l'index du canal logique.
 * Chaîne cinématique : base → épaule → coude → poignet(pitch) → poignet(roll) → pince.
 */
export const AXES: AxisConfig[] = [
  {
    channel: 0,
    label: "Base",
    description: "Rotation horizontale (yaw)",
    axis: "y",
    dir: 1,
    offsetDeg: 90, // 90° => face avant (rotation 0)
    kind: "joint",
  },
  {
    channel: 1,
    label: "Épaule",
    description: "Élévation (pitch)",
    axis: "z",
    dir: 1,
    offsetDeg: 90,
    kind: "joint",
  },
  {
    channel: 2,
    label: "Coude",
    description: "Flexion (pitch)",
    axis: "z",
    dir: 1,
    offsetDeg: 90,
    kind: "joint",
  },
  {
    channel: 3,
    label: "Poignet · pitch",
    description: "Inclinaison du poignet",
    axis: "z",
    dir: 1,
    offsetDeg: 90,
    kind: "joint",
  },
  {
    channel: 4,
    label: "Poignet · roll",
    description: "Rotation de l'outil",
    axis: "y",
    dir: 1,
    offsetDeg: 90,
    kind: "joint",
  },
  {
    channel: 5,
    label: "Pince",
    description: "0 = fermée · 180 = ouverte",
    axis: "x",
    dir: 1,
    offsetDeg: 0,
    kind: "gripper",
  },
];

/**
 * Dimensions des segments (unités scène). Servent au rendu et, plus tard,
 * à une éventuelle cinématique inverse.
 */
export const SEGMENTS = {
  baseHeight: 0.4,
  baseRadius: 0.9,
  shoulderLength: 2.2,
  forearmLength: 1.9,
  wristLength: 0.9,
  toolLength: 0.6,
  linkRadius: 0.28,
  fingerLength: 0.55,
  fingerThickness: 0.12,
  gripperMaxSpread: 0.45, // écartement max d'un doigt (pince ouverte)
};

/** Borne une valeur dans [ANGLE_MIN, ANGLE_MAX]. */
export function clampAngle(angle: number): number {
  return Math.min(ANGLE_MAX, Math.max(ANGLE_MIN, angle));
}
