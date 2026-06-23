"use client";

/** Problème + Solution — deux blocs éditoriaux face à face. */

import { Reveal } from "./Reveal";

export function ProblemSolution() {
  return (
    <>
      {/* ── LE PROBLÈME ───────────────────────────────────────────────── */}
      <section id="probleme" className="border-t border-line/60 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">
              Le problème
            </span>
          </Reveal>

          <div className="mt-8 grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <Reveal>
              <h2 className="text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-5xl">
                En injection plastique, un opérateur surveille 3 à 4 presses.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-fog/80">
                Son temps n'est pas mangé par le geste lui-même, mais par les
                déplacements entre machines : marcher d'une presse à l'autre,
                attendre le cycle, revenir. Une part importante de la journée
                passe en trajets, pas en production.
              </p>
            </Reveal>
          </div>

          {/* Trois chiffres / repères */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-base)] border border-line bg-line sm:grid-cols-3">
            {[
              { k: "3–4", v: "presses par opérateur" },
              { k: "↻", v: "trajets répétés à chaque cycle" },
              { k: "−", v: "temps machine réellement piloté" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.08} className="bg-panel">
                <div className="p-8">
                  <div className="font-mono text-4xl font-semibold text-chalk">
                    {stat.k}
                  </div>
                  <div className="mt-2 text-sm text-muted">{stat.v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA SOLUTION ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line/60 py-28">
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">
              La solution
            </span>
          </Reveal>

          <div className="mt-8 grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <Reveal delay={0.1} className="md:order-2">
              <p className="text-lg leading-relaxed text-fog/80">
                Les robots restent en poste, fixés sur chaque machine.
                L'opérateur ne se déplace plus : il bascule d'une scène à l'autre
                depuis une salle de contrôle et pilote le geste à distance. Le
                déplacement physique est supprimé — il devient un changement de
                vue.
              </p>
            </Reveal>
            <Reveal className="md:order-1">
              <h2 className="text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-5xl">
                Les robots restent. L'opérateur change de scène.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
