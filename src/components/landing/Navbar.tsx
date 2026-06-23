"use client";

/** Navbar — barre fine, sticky, transparente puis opaque au scroll. */

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(110,231,212,0.5)]" />
          <span className="text-sm font-semibold tracking-tight text-chalk">
            Gleam<span className="text-muted"> · Robotics</span>
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="#probleme"
            className="hidden text-muted transition-colors hover:text-chalk sm:block"
          >
            Problème
          </a>
          <a
            href="#fonctionnement"
            className="hidden text-muted transition-colors hover:text-chalk sm:block"
          >
            Fonctionnement
          </a>
          <ThemeToggle />
          <Link
            href="/simulator"
            className="rounded-[var(--radius-base)] bg-accent px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-accent-deep"
          >
            Simulateur
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
