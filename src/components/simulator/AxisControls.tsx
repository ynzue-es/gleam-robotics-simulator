"use client";

/**
 * AxisControls.tsx — Panneau gauche : 6 sliders (un par axe).
 *
 * Pilote le bras en direct via le contrôleur. Affiche pour chaque axe :
 * l'angle commandé, l'angle réel (interpolé) et l'impulsion PCA9685 équivalente.
 */

import { AXES } from "@/lib/robot/config";
import { angleToPulse } from "@/lib/robot/servoApi";
import { Slider } from "@/components/ui/slider";

interface AxisControlsProps {
  commanded: number[];
  live: number[];
  onChange: (channel: number, angle: number) => void;
  disabled?: boolean;
}

export function AxisControls({
  commanded,
  live,
  onChange,
  disabled,
}: AxisControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      {AXES.map((axis, i) => (
        <div key={axis.channel} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] text-accent">
                CH{axis.channel}
              </span>
              <span className="text-sm font-medium text-chalk">
                {axis.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2 font-mono text-xs">
              <span className="text-chalk tabular-nums">
                {Math.round(commanded[i])}°
              </span>
              <span className="text-muted/60 tabular-nums">
                / pulse {angleToPulse(commanded[i])}
              </span>
            </div>
          </div>

          <Slider
            value={commanded[i]}
            min={0}
            max={180}
            step={1}
            disabled={disabled}
            onValueChange={(v) => onChange(i, v)}
          />

          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>{axis.description}</span>
            {/* angle réel (inertie servo) */}
            <span className="font-mono tabular-nums">
              réel {Math.round(live[i])}°
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
