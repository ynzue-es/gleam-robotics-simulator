import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { RobotShowcase } from "@/components/landing/RobotShowcase";
import { Capabilities } from "@/components/landing/Capabilities";
import { Demo } from "@/components/landing/Demo";
import { Footer } from "@/components/landing/Footer";

/**
 * / — Landing marketing.
 *
 * Structure (rôle de designer) :
 *   Hero → Problème/Solution → Vitrine 3D au scroll (le système) →
 *   Capacités → Démo → Footer.
 * Les animations vivent dans chaque section cliente (Framer Motion / GSAP).
 */
export default function HomePage() {
  return (
    <div className="relative min-h-dvh">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        {/* Ancre de navigation « Le système » sur la vitrine 3D scrollée */}
        <div id="systeme">
          <RobotShowcase />
        </div>
        <Capabilities />
        <Demo />
      </main>
      <Footer />
    </div>
  );
}
