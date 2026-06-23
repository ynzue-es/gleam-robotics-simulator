import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/* Polices : Inter (texte) + JetBrains Mono (code/valeurs techniques). */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* URL de production (sert à rendre les URLs OG/canoniques absolues). */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gleam Robotics — Téléopération de bras robotiques",
    template: "%s — Gleam Robotics",
  },
  description:
    "Un opérateur pilote plusieurs postes robotisés à distance depuis une salle de contrôle. Bras 6 axes, simulateur 3D inclus. By Gleam, studio d'automatisation industrielle.",
  applicationName: "Gleam Robotics",
  authors: [{ name: "Gleam" }],
  creator: "Gleam",
  publisher: "Gleam",
  keywords: [
    "téléopération",
    "bras robotique",
    "robot 6 axes",
    "automatisation industrielle",
    "injection plastique",
    "salle de contrôle",
    "PCA9685",
    "simulateur robot",
    "Gleam",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Gleam Robotics",
    title: "Gleam Robotics — Téléopération de bras robotiques",
    description:
      "Un opérateur, plusieurs postes, zéro déplacement. Téléopération de bras 6 axes pour l'industrie, avec simulateur 3D.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gleam Robotics — Téléopération de bras robotiques",
    description:
      "Un opérateur, plusieurs postes, zéro déplacement. Bras 6 axes + simulateur 3D. By Gleam.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrains.variable} dark`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}
