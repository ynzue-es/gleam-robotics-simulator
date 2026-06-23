import { SimulatorClient } from "@/components/simulator/SimulatorClient";

/**
 * /simulator — Page du simulateur de bras 6 axes.
 *
 * La page (Server Component) ne fait qu'héberger le client : toute la 3D et la
 * logique vivent dans SimulatorClient (et au-delà, dans RobotCanvas → ssr:false).
 */
export default function SimulatorPage() {
  return <SimulatorClient />;
}
