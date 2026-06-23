"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Slider — basé sur l'input range natif, stylé pour le thème sombre.
 * Léger (aucune dépendance Radix), suffisant pour piloter un axe.
 */
export function Slider({
  value,
  min = 0,
  max = 180,
  step = 1,
  onValueChange,
  disabled,
  className,
}: SliderProps) {
  // Pourcentage de remplissage pour la portion "active" de la piste.
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={cn(
        "gleam-slider h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-line) ${pct}%, var(--color-line) 100%)`,
      }}
    />
  );
}
