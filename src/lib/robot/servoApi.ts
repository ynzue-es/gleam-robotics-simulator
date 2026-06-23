/**
 * servoApi.ts — Miroir logiciel d'un PCA9685 + servos.
 *
 * L'objectif : écrire ici exactement la même logique que dans le sketch Arduino,
 * pour qu'une séquence validée en simulation se transpose directement vers le
 * vrai matériel. Chaque méthode publique porte son équivalent C++ en commentaire.
 *
 * Le contrôleur garde deux états par axe :
 *   - `target`  : consigne d'angle (ce que l'on commande)
 *   - `current` : angle réel interpolé (ce que le servo « atteint » avec inertie)
 *
 * L'interpolation est avancée par `tick(dt)`, appelé depuis useFrame côté 3D.
 */

import {
  AXIS_COUNT,
  ANGLE_MIN,
  ANGLE_MAX,
  SERVO_PULSE_MIN,
  SERVO_PULSE_MAX,
  DEFAULT_SPEED_DEG_PER_S,
  HOME_POSITION,
  clampAngle,
} from "./config";

/**
 * angleToPulse — convertit un angle (0–180°) en « pulse count » PCA9685
 * (~150–600). Mapping linéaire, identique à la version embarquée.
 *
 * Équivalent C++ :
 *     int angleToPulse(int angle) {
 *       return map(angle, 0, 180, SERVOMIN, SERVOMAX);
 *     }
 */
export function angleToPulse(angle: number): number {
  const a = clampAngle(angle);
  const pulse =
    SERVO_PULSE_MIN +
    ((a - ANGLE_MIN) / (ANGLE_MAX - ANGLE_MIN)) *
      (SERVO_PULSE_MAX - SERVO_PULSE_MIN);
  return Math.round(pulse);
}

/** Annulation coopérative d'une séquence en cours (bouton Stop). */
export class StopSignal {
  stopped = false;
  stop() {
    this.stopped = true;
  }
  reset() {
    this.stopped = false;
  }
}

type Listener = () => void;

/**
 * RobotController — état du bras + API « façon Arduino ».
 *
 * Volontairement découplé de React et de Three.js : c'est un objet simple que
 * l'on pilote depuis l'UI (sliders, séquences) et que la scène 3D vient lire.
 */
export class RobotController {
  /** Angles courants interpolés (degrés). */
  readonly current: number[];
  /** Consignes d'angle (degrés). */
  readonly target: number[];
  /** Vitesse de déplacement des servos, en °/s. */
  speed = DEFAULT_SPEED_DEG_PER_S;

  private listeners = new Set<Listener>();
  /** Promesses en attente que la position cible soit atteinte. */
  private arrivalResolvers: Array<() => void> = [];
  /** Signal d'arrêt partagé avec le runner de séquence. */
  readonly stopSignal = new StopSignal();

  constructor() {
    this.current = [...HOME_POSITION];
    this.target = [...HOME_POSITION];
  }

  // ──────────────────────────────────────────────────────────────────────
  //  API miroir Arduino
  // ──────────────────────────────────────────────────────────────────────

  /**
   * setServo — commande un canal vers un angle.
   *
   * Équivalent C++ :
   *     void setServo(uint8_t channel, int angle) {
   *       pwm.setPWM(channel, 0, angleToPulse(angle));
   *     }
   */
  setServo(channel: number, angle: number): void {
    if (channel < 0 || channel >= AXIS_COUNT) return;
    this.target[channel] = clampAngle(angle);
    this.emit();
  }

  /**
   * getServo — lit l'angle commandé d'un canal.
   *
   * Équivalent C++ : on conserverait un tableau `int servoAngle[6];`
   *     int getServo(uint8_t channel) { return servoAngle[channel]; }
   */
  getServo(channel: number): number {
    return this.target[channel] ?? 0;
  }

  /** Lit l'impulsion PCA9685 correspondant à la consigne d'un canal. */
  getPulse(channel: number): number {
    return angleToPulse(this.getServo(channel));
  }

  /**
   * moveTo — déplace tous les axes vers `angles` avec interpolation douce.
   * Résout la promesse lorsque la position est atteinte (utile en séquence).
   *
   * Équivalent C++ (boucle bloquante de slew) :
   *     void moveTo(int angles[6]) {
   *       bool done = false;
   *       while (!done) {
   *         done = true;
   *         for (uint8_t c = 0; c < 6; c++) {
   *           if (current[c] != angles[c]) {
   *             current[c] += (angles[c] > current[c]) ? 1 : -1;
   *             setServo(c, current[c]);
   *             done = false;
   *           }
   *         }
   *         delay(STEP_MS);
   *       }
   *     }
   */
  moveTo(angles: number[]): Promise<void> {
    for (let c = 0; c < AXIS_COUNT; c++) {
      if (typeof angles[c] === "number") {
        this.target[c] = clampAngle(angles[c]);
      }
    }
    this.emit();
    return this.waitUntilArrived();
  }

  /**
   * delay — pause non bloquante (Promise).
   *
   * Équivalent C++ : delay(ms);  (bloquant côté microcontrôleur)
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const start = performance.now();
      const check = () => {
        if (this.stopSignal.stopped) return resolve();
        if (performance.now() - start >= ms) return resolve();
        requestAnimationFrame(check);
      };
      check();
    });
  }

  /** home — retour à la position neutre [90,90,90,90,90,90]. */
  home(): Promise<void> {
    return this.moveTo([...HOME_POSITION]);
  }

  // ──────────────────────────────────────────────────────────────────────
  //  Moteur d'interpolation (appelé par useFrame)
  // ──────────────────────────────────────────────────────────────────────

  /**
   * tick — avance l'interpolation de `dt` secondes.
   * Chaque axe se rapproche de sa consigne à `speed` °/s (slew réaliste).
   */
  tick(dt: number): void {
    const maxStep = this.speed * dt;
    let moved = false;
    let allArrived = true;

    for (let c = 0; c < AXIS_COUNT; c++) {
      const diff = this.target[c] - this.current[c];
      if (Math.abs(diff) <= maxStep) {
        if (this.current[c] !== this.target[c]) moved = true;
        this.current[c] = this.target[c];
      } else {
        this.current[c] += Math.sign(diff) * maxStep;
        moved = true;
        allArrived = false;
      }
    }

    if (moved) this.emit();
    if (allArrived) this.resolveArrivals();
  }

  /** True si tous les axes ont rejoint leur consigne (à epsilon près). */
  isSettled(eps = 0.05): boolean {
    return this.current.every(
      (v, c) => Math.abs(this.target[c] - v) <= eps
    );
  }

  private waitUntilArrived(): Promise<void> {
    if (this.isSettled()) return Promise.resolve();
    return new Promise((resolve) => {
      this.arrivalResolvers.push(resolve);
    });
  }

  private resolveArrivals(): void {
    if (this.arrivalResolvers.length === 0) return;
    const pending = this.arrivalResolvers;
    this.arrivalResolvers = [];
    pending.forEach((r) => r());
  }

  /** Stoppe immédiatement : la consigne devient la position courante. */
  stop(): void {
    this.stopSignal.stop();
    for (let c = 0; c < AXIS_COUNT; c++) {
      this.target[c] = this.current[c];
    }
    this.resolveArrivals();
    this.emit();
  }

  // ──────────────────────────────────────────────────────────────────────
  //  Abonnement (pour l'affichage React)
  // ──────────────────────────────────────────────────────────────────────

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.listeners.forEach((l) => l());
  }
}
