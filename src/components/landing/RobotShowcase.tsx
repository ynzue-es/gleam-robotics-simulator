"use client";

/**
 * RobotShowcase.tsx — Section « 3D au scroll » (GSAP ScrollTrigger).
 *
 * Effet type template Webflow : un bras 3D reste épinglé (sticky) pendant que
 * l'on scrolle ; sa pose et la caméra suivent la progression de scroll, et des
 * légendes s'enchaînent en fondu (vision → pilotage → exécution).
 *
 * - GSAP ScrollTrigger met à jour `progressRef.current` (0→1).
 * - ShowcaseScene (dans le Canvas) lit ce ref à chaque frame pour poser le bras
 *   et déplacer la caméra. Aucun re-render React par frame.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Gamepad2, Cog } from "lucide-react";

import { RobotController } from "@/lib/robot/servoApi";
import { ShowcaseCanvas } from "./ShowcaseCanvas";

const STEPS = [
  {
    icon: Eye,
    n: "01",
    title: "Vision sur le poste",
    text: "Une caméra capte la scène en temps réel. L'opérateur voit la machine comme s'il était devant.",
  },
  {
    icon: Gamepad2,
    n: "02",
    title: "Pilotage à distance",
    text: "Depuis la salle de contrôle, il compose la trajectoire — par geste ou contrôleur — et déclenche l'action.",
  },
  {
    icon: Cog,
    n: "03",
    title: "Exécution fidèle",
    text: "Le bras 6 axes reproduit le mouvement sur le poste : saisir, déposer, trier. Précis et répétable.",
  },
];

export function RobotShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);

  // Instance stable du contrôleur (piloté par le scroll, pas par l'UI).
  const controllerRef = useRef<RobotController | null>(null);
  if (controllerRef.current === null) {
    controllerRef.current = new RobotController();
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1) Progression globale → pilote le bras + la caméra (via progressRef).
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      // 2) Enchaînement des légendes en fondu, calé sur le même scroll.
      const captions = captionRefs.current.filter(Boolean) as HTMLDivElement[];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      captions.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          i
        );
        // On garde la dernière légende affichée jusqu'au bout.
        if (i < captions.length - 1) {
          tl.to(
            el,
            { opacity: 0, y: -28, duration: 0.5, ease: "power2.in" },
            i + 0.7
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[360vh] border-t border-line/60"
    >
      {/* Conteneur épinglé */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fond : dégradé + halo accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft to-ink" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[130px]" />

        {/* Canvas 3D (plein cadre, derrière le texte) */}
        <div className="absolute inset-0">
          <ShowcaseCanvas
            controller={controllerRef.current}
            progressRef={progressRef}
          />
        </div>

        {/* Contenu overlay */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6">
          {/* En-tête persistant */}
          <div className="pt-24 sm:pt-28">
            <span className="text-xs uppercase tracking-[0.25em] text-accent">
              Le système
            </span>
            <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold leading-tight text-chalk sm:text-4xl md:text-5xl">
              Du capteur au geste.
            </h2>
          </div>

          {/* Légendes superposées (crossfade piloté par GSAP) */}
          <div className="pointer-events-none relative mt-auto mb-24 h-44 max-w-md">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-base)] border border-line bg-panel/70 text-accent backdrop-blur">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-sm text-muted/60">
                    {step.n} / 03
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-chalk">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-fog/80">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Indice de scroll */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-muted/50">
          Défiler pour piloter le bras
        </div>
      </div>
    </section>
  );
}
