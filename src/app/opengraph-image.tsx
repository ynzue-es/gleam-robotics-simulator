import { ImageResponse } from "next/og";

/**
 * opengraph-image.tsx — Image de partage (OG/Twitter) générée à la volée.
 * Next détecte ce fichier et l'expose automatiquement en <meta og:image>.
 */
export const alt =
  "Gleam Robotics — Téléopération de bras robotiques pour l'industrie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 75% 15%, rgba(110,231,212,0.18), transparent 45%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marque */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              backgroundColor: "#6ee7d4",
              boxShadow: "0 0 24px 6px rgba(110,231,212,0.6)",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "30px",
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            <span>Gleam</span>
            <span style={{ color: "#8a8a93", fontWeight: 400 }}>Robotics</span>
          </div>
        </div>

        {/* Titre */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "82px",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-2px",
              maxWidth: "960px",
            }}
          >
            <span>Un opérateur. Plusieurs postes.&nbsp;</span>
            <span style={{ color: "#6ee7d4" }}>Zéro déplacement.</span>
          </div>
          <div style={{ fontSize: "30px", color: "#c7c7cf", maxWidth: "820px" }}>
            Téléopération de bras robotiques 6 axes pour l'industrie.
          </div>
        </div>

        {/* Pied */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            color: "#8a8a93",
            textTransform: "uppercase",
            letterSpacing: "4px",
          }}
        >
          <span>Studio d'automatisation industrielle</span>
          <span>By Gleam</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
