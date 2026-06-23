"use client";

/** Démo — placeholder vidéo (à remplacer après le test terrain) + CTA simulateur. */

import Link from "next/link";
import { PlayCircle, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function Demo() {
  return (
    <section className="border-t border-line/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            Démo
          </span>
          <h2 className="mt-6 max-w-2xl text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-5xl">
            Le système en conditions réelles.
          </h2>
          <p className="mt-4 max-w-xl text-fog/75">
            Vidéo du test terrain à venir. En attendant, le simulateur 3D
            reproduit la cinématique du bras et l'API de pilotage.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Placeholder vidéo — remplacer par <video> / embed après le test */}
          <div className="group relative mt-12 aspect-video w-full overflow-hidden rounded-[var(--radius-base)] border border-line bg-ink-soft">
            <div className="bg-grid absolute inset-0 opacity-40" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[80px]" />
            <div className="relative flex h-full flex-col items-center justify-center gap-4">
              <PlayCircle
                className="h-16 w-16 text-muted transition-colors group-hover:text-accent"
                strokeWidth={1}
              />
              <span className="text-sm uppercase tracking-[0.2em] text-muted">
                Vidéo à venir — test terrain
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-base)] border border-line bg-panel/60 p-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-xl font-semibold text-chalk">
                Essayez le simulateur dès maintenant
              </h3>
              <p className="mt-1 text-sm text-muted">
                Bras 6 axes, sliders en direct, séquences façon Arduino.
              </p>
            </div>
            <Link
              href="/simulator"
              className="group inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-base)] bg-accent px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-accent-deep"
            >
              Ouvrir le simulateur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
