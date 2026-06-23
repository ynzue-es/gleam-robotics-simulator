"use client";

/**
 * RobotCanvas.tsx — Frontière SSR ↔ client pour la scène 3D.
 *
 * Three.js/WebGL ne peut pas être rendu côté serveur : on importe RobotScene
 * dynamiquement avec `ssr: false`. Un fallback s'affiche pendant le chargement.
 */

import dynamic from "next/dynamic";
import { RobotController } from "@/lib/robot/servoApi";
import { useTheme } from "@/components/theme/ThemeProvider";

// Import dynamique CLIENT-ONLY — aucune exécution côté serveur.
const RobotScene = dynamic(() => import("./RobotScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink">
      <div className="flex flex-col items-center gap-3 text-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
        <span className="text-xs uppercase tracking-[0.2em]">
          Initialisation 3D…
        </span>
      </div>
    </div>
  ),
});

export function RobotCanvas({ controller }: { controller: RobotController }) {
  // Le thème est lu ICI (hors du <Canvas>) puis passé en prop : le contexte
  // React ne traverse pas la frontière du renderer R3F.
  const { theme } = useTheme();
  return <RobotScene controller={controller} theme={theme} />;
}
