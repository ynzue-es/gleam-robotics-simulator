"use client";

/** Navbar — barre fine, sticky, transparente puis floutée au scroll. */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" aria-label="Accueil Gleam Robotics">
          <Logo />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="#probleme"
            className="hidden text-muted transition-colors hover:text-chalk md:block"
          >
            Le problème
          </a>
          <a
            href="#systeme"
            className="hidden text-muted transition-colors hover:text-chalk md:block"
          >
            Le système
          </a>
          <a
            href="#demo"
            className="hidden text-muted transition-colors hover:text-chalk md:block"
          >
            Démo
          </a>
          <ThemeToggle />
          <Link
            href="/simulator"
            className="group inline-flex items-center gap-1.5 rounded-[var(--radius-base)] bg-accent px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-accent-deep"
          >
            Simulateur
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
