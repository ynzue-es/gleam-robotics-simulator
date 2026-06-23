"use client";

/** Comment ça marche — 3 étapes : vision → pilotage → exécution. */

import { Eye, Gamepad2, Cog } from "lucide-react";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    icon: Eye,
    n: "01",
    title: "Vision sur le poste",
    text: "Une caméra au-dessus de chaque machine renvoie la scène en temps réel. L'opérateur voit le poste comme s'il y était.",
  },
  {
    icon: Gamepad2,
    n: "02",
    title: "Interface de pilotage",
    text: "Depuis la salle de contrôle, l'opérateur commande le bras — par geste ou par contrôleur — et compose la trajectoire à exécuter.",
  },
  {
    icon: Cog,
    n: "03",
    title: "Exécution par le bras",
    text: "Le bras 6 axes reproduit le geste sur le poste : préhension, dépose, tri. Précis, répétable, sans présence physique.",
  },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="border-t border-line/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            Comment ça marche
          </span>
          <h2 className="mt-6 max-w-2xl text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-5xl">
            De la caméra au geste, en trois temps.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.12}>
              <div className="group relative h-full rounded-[var(--radius-base)] border border-line bg-panel/60 p-8 transition-colors hover:border-muted/40">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-base)] border border-line bg-ink-soft text-accent">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-sm text-muted/50">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-chalk">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fog/75">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
