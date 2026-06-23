/** Footer — signature « By Gleam ». */

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line/60 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            Studio d'automatisation industrielle. Téléopération de bras
            robotiques pour l'atelier.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted">
          <Link href="/simulator" className="transition-colors hover:text-chalk">
            Simulateur
          </Link>
          <a href="#probleme" className="transition-colors hover:text-chalk">
            Problème
          </a>
          <a href="#systeme" className="transition-colors hover:text-chalk">
            Le système
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line/60 pt-6 text-xs text-muted/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Gleam. Tous droits réservés.</span>
          <span className="uppercase tracking-[0.2em]">By Gleam</span>
        </div>
      </div>
    </footer>
  );
}
