import { cn } from "@/lib/utils";

/**
 * Logo Gleam — marque + nom.
 *
 * Concept : un bras articulé (base → segment → segment) dont la pointe émet
 * une étincelle (« gleam » = éclat / lueur). Le robotique + la lueur.
 *
 * - `variant="mark"` : la marque seule (carré). Idéal favicon / pastille.
 * - `variant="full"` : marque + mot « Gleam ».
 * - couleurs via currentColor (segments) + accent (étincelle/nœuds).
 */
interface LogoProps {
  variant?: "mark" | "full";
  className?: string;
  markClassName?: string;
  showSuffix?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="Gleam"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gleam-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#16161a" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
        <radialGradient id="gleam-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#6ee7d4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#6ee7d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Plaque */}
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="9"
        fill="url(#gleam-bg)"
        stroke="#2a2a30"
        strokeWidth="1.5"
      />

      {/* Halo de l'étincelle */}
      <circle cx="28" cy="12" r="11" fill="url(#gleam-glow)" />

      {/* Bras articulé */}
      <g
        stroke="#cfd3da"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 30 L11 22 L18 17" />
        <path d="M18 17 L25 13" />
      </g>

      {/* Base + articulation */}
      <circle cx="11" cy="30" r="3" fill="#5d626b" />
      <circle cx="18" cy="17" r="2.4" fill="#8b919c" />

      {/* Étincelle « gleam » à la pointe (4 branches concaves) */}
      <path
        d="M28 6
           C 28.7 10.4, 31.6 13.3, 36 14
           C 31.6 14.7, 28.7 17.6, 28 22
           C 27.3 17.6, 24.4 14.7, 20 14
           C 24.4 13.3, 27.3 10.4, 28 6 Z"
        fill="#6ee7d4"
      />
    </svg>
  );
}

export function Logo({
  variant = "full",
  className,
  markClassName,
  showSuffix = true,
}: LogoProps) {
  if (variant === "mark") {
    return <LogoMark className={cn("h-8 w-8", markClassName)} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8 shrink-0", markClassName)} />
      <span className="text-base font-semibold tracking-tight text-chalk">
        Gleam
        {showSuffix && (
          <span className="font-normal text-muted"> Robotics</span>
        )}
      </span>
    </span>
  );
}
