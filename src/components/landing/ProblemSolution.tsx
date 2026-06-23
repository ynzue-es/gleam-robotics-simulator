"use client";

/** Problème + Solution — blocs éditoriaux avec visuels. */

import Image from "next/image";
import { Reveal } from "./Reveal";
import { unsplash, PHOTOS } from "@/lib/images";

export function ProblemSolution() {
  return (
    <>
      {/* ── LE PROBLÈME ───────────────────────────────────────────────── */}
      <section id="probleme" className="border-t border-line/60 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Image
                  src={unsplash(PHOTOS.factoryInterior, { w: 1200 })}
                  alt="Atelier d'injection plastique avec plusieurs presses"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink/70 to-transparent" />
              </div>
            </Reveal>

            <div>
              <Reveal>
                <span className="text-xs uppercase tracking-[0.25em] text-accent">
                  Le problème
                </span>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-[2.75rem]">
                  Un opérateur surveille 3 à 4 presses.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-fog/80">
                  En injection plastique, son temps n'est pas mangé par le geste
                  lui-même, mais par les déplacements entre machines : marcher
                  d'une presse à l'autre, attendre le cycle, revenir. Une part
                  importante de la journée passe en trajets, pas en production.
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
                {[
                  { k: "3–4", v: "presses / opérateur" },
                  { k: "↻", v: "trajets par cycle" },
                  { k: "−", v: "temps réellement piloté" },
                ].map((stat, i) => (
                  <Reveal key={i} delay={i * 0.08} className="bg-panel">
                    <div className="p-5">
                      <div className="font-mono text-2xl font-semibold text-chalk sm:text-3xl">
                        {stat.k}
                      </div>
                      <div className="mt-1 text-xs text-muted">{stat.v}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA SOLUTION ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-line/60 py-24 sm:py-28">
        <div className="absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="lg:order-2">
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                  <Image
                    src={unsplash(PHOTOS.controlScreens, { w: 1200 })}
                    alt="Salle de contrôle avec plusieurs écrans de supervision"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-ink/70 to-transparent" />
                </div>
              </Reveal>
            </div>

            <div className="lg:order-1">
              <Reveal>
                <span className="text-xs uppercase tracking-[0.25em] text-accent">
                  La solution
                </span>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-[2.75rem]">
                  Les robots restent. L'opérateur change de scène.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-fog/80">
                  Les robots restent en poste, fixés sur chaque machine.
                  L'opérateur ne se déplace plus : il bascule d'une scène à
                  l'autre depuis une salle de contrôle et pilote le geste à
                  distance. Le déplacement physique devient un simple changement
                  de vue.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
