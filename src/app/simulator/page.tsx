import type { Metadata } from "next";
import { SimulatorClient } from "@/components/simulator/SimulatorClient";

export const metadata: Metadata = {
  title: "Simulateur de bras 6 axes",
  description:
    "Simulateur 3D d'un bras robotique 6 axes : sliders en direct, séquences de mouvement façon Arduino (PCA9685). Testez avant le terrain.",
  alternates: { canonical: "/simulator" },
};

/**
 * /simulator — Page du simulateur de bras 6 axes.
 *
 * La page (Server Component) ne fait qu'héberger le client : toute la 3D et la
 * logique vivent dans SimulatorClient (et au-delà, dans RobotCanvas → ssr:false).
 */
export default function SimulatorPage() {
  return <SimulatorClient />;
}
