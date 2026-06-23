import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Demo } from "@/components/landing/Demo";
import { Footer } from "@/components/landing/Footer";

/**
 * / — Landing marketing.
 * Composition de sections réutilisables ; les animations vivent dans chaque
 * section cliente (Framer Motion).
 */
export default function HomePage() {
  return (
    <div className="relative min-h-dvh">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Demo />
      </main>
      <Footer />
    </div>
  );
}
