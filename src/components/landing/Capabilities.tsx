"use client";

/** Capabilities — cas d'usage / feuille de route, en cartes illustrées. */

import Image from "next/image";
import { Reveal } from "./Reveal";
import { unsplash, PHOTOS } from "@/lib/images";

const CARDS = [
  {
    img: PHOTOS.robotGripper,
    tag: "Vision & tri",
    title: "Détecter, saisir, trier",
    text: "Une caméra au-dessus de la zone identifie les pièces par couleur et déclenche la préhension vers le bon bac.",
  },
  {
    img: PHOTOS.operator,
    tag: "Téléopération",
    title: "Le geste, à distance",
    text: "L'opérateur pilote le bras par contrôleur ou gant connecté, avec un retour visuel temps réel du poste.",
  },
  {
    img: PHOTOS.factoryHall,
    tag: "Multi-postes",
    title: "Une salle, plusieurs machines",
    text: "Un seul poste de contrôle bascule entre les scènes : chaque presse reste servie sans présence physique.",
  },
];

export function Capabilities() {
  return (
    <section className="border-t border-line/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.25em] text-accent">
            Capacités
          </span>
          <h2 className="mt-6 max-w-2xl text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-5xl">
            Pensé pour l'atelier, conçu pour évoluer.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.tag} delay={i * 0.1}>
              <article className="group h-full overflow-hidden rounded-2xl border border-line bg-panel/60 transition-colors hover:border-muted/40">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={unsplash(card.img, { w: 800 })}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-accent backdrop-blur">
                    {card.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-chalk">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog/75">
                    {card.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
