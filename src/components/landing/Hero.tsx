"use client";

/** Hero — accroche + visuel encadré (style template premium). */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { unsplash, PHOTOS } from "@/lib/images";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      {/* Fond */}
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Colonne texte */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Téléopération industrielle
          </motion.span>

          <motion.h1
            variants={item}
            className="text-balance text-5xl font-semibold leading-[1.04] tracking-tight text-chalk sm:text-6xl md:text-7xl"
          >
            Un opérateur.
            <br />
            <span className="text-muted">Plusieurs postes.</span>
            <br />
            Zéro déplacement.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-fog/90"
          >
            Des bras robotiques restent en poste sur chaque machine. Depuis une
            salle de contrôle, l'opérateur bascule d'un poste à l'autre et
            exécute les gestes à distance. Le temps perdu en allées et venues
            disparaît.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/simulator"
              className="group inline-flex items-center gap-2 rounded-[var(--radius-base)] bg-accent px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-accent-deep hover:shadow-[0_0_28px_-4px_rgba(110,231,212,0.6)]"
            >
              Voir le simulateur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#probleme"
              className="text-sm text-muted transition-colors hover:text-chalk"
            >
              Comprendre l'approche ↓
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 text-xs uppercase tracking-[0.25em] text-muted/60"
          >
            By Gleam — studio d'automatisation industrielle
          </motion.div>
        </motion.div>

        {/* Colonne visuelle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
            <Image
              src={unsplash(PHOTOS.robotIndustrial, { w: 1200 })}
              alt="Bras robotique industriel articulé"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          </div>

          {/* Carte « spec » flottante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-xl border border-line bg-panel/90 px-5 py-4 backdrop-blur-md sm:-left-8"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-lg font-semibold text-chalk">
                6 axes
              </div>
              <div className="text-xs text-muted">pilotés en temps réel</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
