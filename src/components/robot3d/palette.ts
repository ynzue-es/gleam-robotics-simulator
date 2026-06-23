/**
 * palette.ts — Couleurs & matériaux de la scène 3D, par thème.
 *
 * Partagé entre le simulateur (/simulator) et la vitrine de la landing.
 * Les couleurs des segments dépendent du thème pour rester contrastées :
 * acier clair sur fond sombre, acier foncé sur fond clair.
 */

export type Theme = "dark" | "light";

export const SCENE_PALETTE = {
  dark: {
    background: "#0a0a0b",
    fog: "#0a0a0b",
    floor: "#0c0c0e",
    gridCell: "#1f1f26",
    gridSection: "#2dd4bf",
    ambient: 0.45,
    hemi: ["#3a4a55", "#0a0a0b", 0.5] as [string, string, number],
    arm: "#9aa0aa",
    joint: "#5d626b",
    finger: "#c2c7cf",
    socle: "#4a4e56",
  },
  light: {
    background: "#e9ebee",
    fog: "#e9ebee",
    floor: "#dde0e5",
    gridCell: "#c6ccd3",
    gridSection: "#0d9488",
    ambient: 0.55,
    hemi: ["#ffffff", "#aeb4bd", 0.5] as [string, string, number],
    arm: "#5a606a",
    joint: "#3f444c",
    finger: "#787e88",
    socle: "#868c95",
  },
} as const;

export type Palette = (typeof SCENE_PALETTE)[Theme];

/**
 * Base de matériau « acier ». metalness modéré : sans environment map (HDR),
 * un matériau trop métallique n'a rien à réfléchir et rend quasi noir.
 * La couleur est fournie par la palette (dépend du thème).
 */
export const steelBase = { metalness: 0.45, roughness: 0.5 } as const;

/** Accent menthe — émissif pour rester lisible quel que soit l'éclairage. */
export const accentProps = {
  color: "#6ee7d4",
  metalness: 0.3,
  roughness: 0.35,
  emissive: "#0c3b34",
  emissiveIntensity: 0.5,
} as const;
