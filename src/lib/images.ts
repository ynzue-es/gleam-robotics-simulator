/**
 * images.ts — Catalogue centralisé des photos d'illustration (Unsplash).
 *
 * URLs directes du CDN Unsplash (vérifiées). Le helper `unsplash()` ajoute les
 * paramètres d'optimisation. Le domaine est autorisé dans next.config.mjs.
 */

const BASE = "https://images.unsplash.com/photo-";

/** Construit une URL Unsplash optimisée à partir d'un identifiant photo. */
export function unsplash(
  id: string,
  { w = 1600, q = 80 }: { w?: number; q?: number } = {}
): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/** Photos retenues, regroupées par usage. */
export const PHOTOS = {
  // Bras robotiques / automatisation
  robotFactory: "1647427060118-4911c9821b82", // chaîne robotisée orange
  robotIndustrial: "1658219377461-956189f62c71", // robot articulé jaune/noir
  robotGripper: "1774229637247-3cd45219826c", // bras avec pince en atelier
  robotLab: "1635186646209-962eddb4d094", // unité robotisée sur table

  // Usine / production
  factoryInterior: "1716643863806-989dd76ae093", // intérieur d'usine, machines
  factoryMachines: "1610891015188-5369212db097", // machinerie industrielle
  factoryHall: "1717386255773-1e3037c81788", // grande halle de production

  // Salle de contrôle / supervision
  controlDesk: "1708807472445-d33589e6b090", // poste multi-écrans
  controlScreens: "1652145595413-0a79398e5888", // mur d'écrans
  controlCenter: "1714596282575-82d224db8c70", // centre de supervision
  operator: "1581092795360-fd1ca04f0952", // opérateur au poste
} as const;
