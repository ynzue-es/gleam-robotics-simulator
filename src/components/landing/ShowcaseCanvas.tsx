"use client";

/**
 * ShowcaseCanvas.tsx — Frontière SSR ↔ client pour la vitrine 3D de la landing.
 * Import dynamique avec ssr:false (WebGL non rendu côté serveur).
 */

import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";
import { RobotController } from "@/lib/robot/servoApi";
import { useTheme } from "@/components/theme/ThemeProvider";

const ShowcaseScene = dynamic(() => import("./ShowcaseScene"), {
  ssr: false,
});

export function ShowcaseCanvas({
  controller,
  progressRef,
}: {
  controller: RobotController;
  progressRef: MutableRefObject<number>;
}) {
  const { theme } = useTheme();
  return (
    <ShowcaseScene
      controller={controller}
      theme={theme}
      progressRef={progressRef}
    />
  );
}
