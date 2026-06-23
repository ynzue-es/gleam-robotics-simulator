/**
 * sequenceRunner.ts — Interprète de séquences de mouvement.
 *
 * On écrit une séquence dans une syntaxe volontairement proche de l'Arduino :
 *
 *     home();
 *     moveTo([90, 60, 120, 90, 90, 0]);   // au-dessus de l'objet
 *     delay(400);
 *     setServo(5, 0);                       // fermer la pince
 *
 * Le texte n'est PAS exécuté via eval() : il est analysé puis traduit en appels
 * sur le RobotController. Cela reste sûr et reflète 1:1 ce que ferait le sketch.
 *
 * Pour porter vers Arduino : recopier les mêmes appels dans loop()/setup().
 */

import { RobotController } from "./servoApi";

export type Instruction =
  | { op: "moveTo"; args: number[] }
  | { op: "setServo"; channel: number; angle: number }
  | { op: "delay"; ms: number }
  | { op: "home" }
  | { op: "setSpeed"; degPerSec: number };

export interface ParseResult {
  instructions: Instruction[];
  errors: string[];
}

/** Retire commentaires (`//`, `/* *​/`) et lignes vides. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "") // blocs
    .replace(/\/\/[^\n]*/g, ""); // lignes
}

/**
 * parseSequence — transforme le texte en liste d'instructions.
 * Tolère les `;` et retours à la ligne comme séparateurs.
 */
export function parseSequence(source: string): ParseResult {
  const instructions: Instruction[] = [];
  const errors: string[] = [];

  const cleaned = stripComments(source);
  // Séparateurs : `;` ou fin de ligne. On garde le numéro de ligne pour les erreurs.
  const statements = cleaned
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    const move = stmt.match(/^moveTo\s*\(\s*\[([^\]]*)\]\s*\)$/);
    const servo = stmt.match(/^setServo\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/);
    const wait = stmt.match(/^delay\s*\(\s*(\d+)\s*\)$/);
    const speed = stmt.match(/^setSpeed\s*\(\s*(\d+)\s*\)$/);
    const home = stmt.match(/^home\s*\(\s*\)$/);

    if (move) {
      const args = move[1]
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !Number.isNaN(n));
      if (args.length === 0) {
        errors.push(`moveTo vide ou invalide : "${stmt}"`);
      } else {
        instructions.push({ op: "moveTo", args });
      }
    } else if (servo) {
      instructions.push({
        op: "setServo",
        channel: Number(servo[1]),
        angle: Number(servo[2]),
      });
    } else if (wait) {
      instructions.push({ op: "delay", ms: Number(wait[1]) });
    } else if (speed) {
      instructions.push({ op: "setSpeed", degPerSec: Number(speed[1]) });
    } else if (home) {
      instructions.push({ op: "home" });
    } else {
      errors.push(`Instruction non reconnue : "${stmt}"`);
    }
  }

  return { instructions, errors };
}

export interface RunCallbacks {
  onStep?: (index: number, total: number, instr: Instruction) => void;
  onDone?: (completed: boolean) => void;
  onError?: (message: string) => void;
}

/**
 * runSequence — exécute les instructions séquentiellement sur le contrôleur.
 * Respecte le signal d'arrêt (bouton Stop) entre chaque instruction.
 */
export async function runSequence(
  controller: RobotController,
  source: string,
  callbacks: RunCallbacks = {}
): Promise<void> {
  const { instructions, errors } = parseSequence(source);

  if (errors.length > 0) {
    callbacks.onError?.(errors.join("\n"));
    return;
  }

  controller.stopSignal.reset();
  const total = instructions.length;

  for (let i = 0; i < total; i++) {
    if (controller.stopSignal.stopped) {
      callbacks.onDone?.(false);
      return;
    }

    const instr = instructions[i];
    callbacks.onStep?.(i, total, instr);

    switch (instr.op) {
      case "moveTo":
        await controller.moveTo(instr.args);
        break;
      case "setServo":
        controller.setServo(instr.channel, instr.angle);
        // petite latence pour visualiser le slew du servo commandé
        await controller.delay(250);
        break;
      case "delay":
        await controller.delay(instr.ms);
        break;
      case "setSpeed":
        controller.speed = instr.degPerSec;
        break;
      case "home":
        await controller.home();
        break;
    }
  }

  callbacks.onDone?.(!controller.stopSignal.stopped);
}

/**
 * Exemple pick-and-place pré-chargé dans l'éditeur.
 * Démonstration : prendre un objet, le déplacer, le déposer, revenir au neutre.
 */
export const EXAMPLE_PICK_AND_PLACE = `// ─── Démo pick & place ───────────────────────────────
// Axes : [base, épaule, coude, poignet_pitch, poignet_roll, pince]
// Pince : 0 = fermée, 180 = ouverte

home();                              // position neutre

// 1. Se placer au-dessus de l'objet, pince ouverte
moveTo([60, 70, 120, 90, 90, 180]);
delay(300);

// 2. Descendre sur l'objet
moveTo([60, 110, 95, 70, 90, 180]);
delay(300);

// 3. Fermer la pince (saisie)
setServo(5, 20);
delay(400);

// 4. Remonter avec l'objet
moveTo([60, 70, 120, 90, 90, 20]);
delay(300);

// 5. Pivoter la base vers la zone de dépose
moveTo([130, 70, 120, 90, 90, 20]);
delay(300);

// 6. Descendre pour déposer
moveTo([130, 110, 95, 70, 90, 20]);
delay(300);

// 7. Ouvrir la pince (relâcher)
setServo(5, 180);
delay(400);

// 8. Remonter puis retour au neutre
moveTo([130, 70, 120, 90, 90, 180]);
delay(300);
home();
`;
