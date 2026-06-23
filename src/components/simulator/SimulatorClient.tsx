"use client";

/**
 * SimulatorClient.tsx — Assemble le simulateur.
 *
 * Disposition :
 *   ┌──────────────┬───────────────────────────┐
 *   │  Axes (6     │   Vue 3D (RobotCanvas)     │
 *   │  sliders)    │                            │
 *   ├──────────────┴───────────────────────────┤
 *   │  Éditeur de séquence + transport          │
 *   └───────────────────────────────────────────┘
 *
 * Toute la logique « robot » est déléguée au contrôleur et au runner :
 * ce composant ne fait que connecter l'UI à ces modules.
 */

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";

import { useRobotController } from "@/lib/robot/useRobotController";
import {
  runSequence,
  EXAMPLE_PICK_AND_PLACE,
} from "@/lib/robot/sequenceRunner";
import { DEFAULT_SPEED_DEG_PER_S } from "@/lib/robot/config";

import { RobotCanvas } from "./RobotCanvas";
import { AxisControls } from "./AxisControls";
import { SequenceEditor } from "./SequenceEditor";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function SimulatorClient() {
  const { controller, liveAngles, commanded, setAxis, syncCommandedFromController } =
    useRobotController();

  const [sequence, setSequence] = useState<string>(EXAMPLE_PICK_AND_PLACE);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Prêt.");
  const [error, setError] = useState<string | null>(null);

  // ── Transport ──────────────────────────────────────────────────────────

  const handleRun = useCallback(async () => {
    setError(null);
    setIsRunning(true);
    await runSequence(controller, sequence, {
      onStep: (i, total, instr) => {
        setStatus(`Étape ${i + 1}/${total} — ${instr.op}`);
        syncCommandedFromController();
      },
      onError: (msg) => {
        setError(msg);
        setIsRunning(false);
      },
      onDone: (completed) => {
        setIsRunning(false);
        setStatus(completed ? "Séquence terminée." : "Séquence interrompue.");
        syncCommandedFromController();
      },
    });
  }, [controller, sequence, syncCommandedFromController]);

  const handleStop = useCallback(() => {
    controller.stop();
    setIsRunning(false);
    setStatus("Arrêt.");
    syncCommandedFromController();
  }, [controller, syncCommandedFromController]);

  const handleHome = useCallback(async () => {
    setError(null);
    setStatus("Retour position neutre…");
    await controller.home();
    syncCommandedFromController();
    setStatus("Position neutre.");
  }, [controller, syncCommandedFromController]);

  return (
    <div className="flex h-dvh flex-col bg-ink text-fog">
      {/* Barre supérieure */}
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-chalk"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </Link>
          <div className="h-4 w-px bg-line" />
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-chalk">
              Simulateur · Bras 6 axes
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
          <span className="hidden sm:inline">PCA9685 · 6 servos</span>
          <span className="hidden text-line sm:inline">|</span>
          <span>{DEFAULT_SPEED_DEG_PER_S}°/s</span>
          <span className="hidden text-line sm:inline">|</span>
          <span className="hidden text-muted/60 sm:inline">By Gleam</span>
          <ThemeToggle />
        </div>
      </header>

      {/* Corps : axes | vue 3D */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* Panneau gauche : axes */}
        <aside className="min-h-0 overflow-y-auto border-b border-line p-5 lg:border-b-0 lg:border-r">
          <Card className="bg-transparent border-0">
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Axes
              </h2>
              <p className="mt-1 text-xs text-muted/70">
                Pilotage direct — chaque slider commande un servo (0–180°).
              </p>
            </div>
            <AxisControls
              commanded={commanded}
              live={liveAngles}
              onChange={setAxis}
              disabled={isRunning}
            />
          </Card>
        </aside>

        {/* Vue 3D */}
        <main className="relative min-h-[320px]">
          <RobotCanvas controller={controller} />
          <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-muted/50">
            clic-gauche : orbite · molette : zoom · clic-droit : pan
          </div>
        </main>
      </div>

      {/* Panneau bas : séquence */}
      <section className="border-t border-line bg-ink-soft p-5">
        <div className="mx-auto max-w-none">
          <SequenceEditor
            value={sequence}
            onChange={setSequence}
            onRun={handleRun}
            onStop={handleStop}
            onHome={handleHome}
            isRunning={isRunning}
            status={status}
            error={error}
          />
        </div>
      </section>
    </div>
  );
}
