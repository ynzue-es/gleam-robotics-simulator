/** Footer — signature « By Gleam ». */

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/60 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(110,231,212,0.5)]" />
            <span className="text-sm font-semibold tracking-tight text-chalk">
              Gleam<span className="text-muted"> · Robotics</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">
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
          <a href="#fonctionnement" className="transition-colors hover:text-chalk">
            Fonctionnement
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
