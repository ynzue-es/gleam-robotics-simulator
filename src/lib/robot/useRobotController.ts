"use client";

import { useEffect, useRef, useState } from "react";
import { RobotController } from "./servoApi";
import { AXIS_COUNT } from "./config";

/**
 * useRobotController — fournit une instance unique de RobotController et
 * synchronise les angles courants vers l'état React pour l'affichage.
 *
 * Pour éviter de re-render à chaque frame, la synchro de lecture est throttlée
 * (~30 fps) : la physique (tick) reste pilotée par useFrame dans la scène 3D ;
 * ici on ne fait que LIRE `current` pour les jauges/sliders.
 */
export function useRobotController() {
  // Instance stable, créée une seule fois.
  const controllerRef = useRef<RobotController | null>(null);
  if (controllerRef.current === null) {
    controllerRef.current = new RobotController();
  }
  const controller = controllerRef.current;

  // Angles affichés (copie throttlée de controller.current).
  const [liveAngles, setLiveAngles] = useState<number[]>(() => [
    ...controller.current,
  ]);
  // Consignes affichées (pilotent les sliders).
  const [commanded, setCommanded] = useState<number[]>(() => [
    ...controller.target,
  ]);

  // Boucle de lecture seule pour rafraîchir l'affichage.
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const FPS = 30;
    const interval = 1000 / FPS;

    const loop = (t: number) => {
      if (t - last >= interval) {
        last = t;
        setLiveAngles((prev) => {
          for (let i = 0; i < AXIS_COUNT; i++) {
            if (Math.abs(prev[i] - controller.current[i]) > 0.01) {
              return [...controller.current];
            }
          }
          return prev; // pas de changement => pas de re-render
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [controller]);

  /** Commande un axe (slider) : met à jour consigne + état UI. */
  const setAxis = (channel: number, angle: number) => {
    controller.setServo(channel, angle);
    setCommanded((prev) => {
      const next = [...prev];
      next[channel] = angle;
      return next;
    });
  };

  /** Synchronise l'UI des consignes après un mouvement programmatique. */
  const syncCommandedFromController = () => {
    setCommanded([...controller.target]);
  };

  return {
    controller,
    liveAngles,
    commanded,
    setAxis,
    syncCommandedFromController,
  };
}
