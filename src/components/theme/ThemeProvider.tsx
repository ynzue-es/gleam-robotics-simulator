"use client";

/**
 * ThemeProvider.tsx — Thème clair / sombre (sans persistance).
 *
 * Conformément à la contrainte « pas de localStorage », le thème n'est pas
 * mémorisé : il vit en mémoire le temps de la session. Défaut : sombre.
 *
 * Le thème est appliqué en ajoutant/retirant la classe `light` sur <html> :
 * les variables de couleur Tailwind v4 (--color-*) sont surchargées sous
 * `html.light` dans globals.css, donc tous les utilitaires (bg-ink, text-chalk…)
 * suivent automatiquement.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Applique la classe sur <html> à chaque changement.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook d'accès au thème. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback sûr si utilisé hors provider (ex. rendu isolé).
    return { theme: "dark", toggleTheme: () => {}, setTheme: () => {} };
  }
  return ctx;
}
