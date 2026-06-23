"use client";

/** Hero — accroche principale sur la téléopération. */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden">
      {/* Fond : grille + halo d'accent */}
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl px-6"
      >
        <motion.span
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Téléopération industrielle
        </motion.span>

        <motion.h1
          variants={item}
          className="max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-chalk sm:text-6xl md:text-7xl"
        >
          Un opérateur.
          <br />
          <span className="text-muted">Plusieurs postes.</span>
          <br />
          Zéro déplacement.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-fog/90"
        >
          Des bras robotiques restent en poste sur chaque machine. Depuis une
          salle de contrôle, l'opérateur bascule d'un poste à l'autre et exécute
          les gestes à distance, via une interface de pilotage. Le temps perdu en
          allées et venues disparaît.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
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
          className="mt-16 text-xs uppercase tracking-[0.25em] text-muted/60"
        >
          By Gleam — studio d'automatisation industrielle
        </motion.div>
      </motion.div>
    </section>
  );
}
