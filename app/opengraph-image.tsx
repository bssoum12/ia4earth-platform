import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IA4EARTH Startup Challenge — 3ème édition";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0D2B0F",
          position: "relative",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Motif circuit SVG en fond */}
        <svg
          style={{ position: "absolute", inset: 0, opacity: 0.06 }}
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          fill="none"
        >
          <line x1="0" y1="100" x2="1200" y2="100" stroke="#8CC63F" strokeWidth="1" />
          <line x1="0" y1="250" x2="1200" y2="250" stroke="#8CC63F" strokeWidth="1" />
          <line x1="0" y1="400" x2="1200" y2="400" stroke="#8CC63F" strokeWidth="1" />
          <line x1="0" y1="550" x2="1200" y2="550" stroke="#8CC63F" strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="630" stroke="#8CC63F" strokeWidth="1" />
          <line x1="450" y1="0" x2="450" y2="630" stroke="#8CC63F" strokeWidth="1" />
          <line x1="750" y1="0" x2="750" y2="630" stroke="#8CC63F" strokeWidth="1" />
          <line x1="1000" y1="0" x2="1000" y2="630" stroke="#8CC63F" strokeWidth="1" />
          <circle cx="200" cy="100" r="5" fill="#8CC63F" />
          <circle cx="450" cy="250" r="5" fill="#8CC63F" />
          <circle cx="750" cy="100" r="5" fill="#8CC63F" />
          <circle cx="1000" cy="400" r="5" fill="#8CC63F" />
          <circle cx="200" cy="400" r="5" fill="#8CC63F" />
          <circle cx="750" cy="550" r="5" fill="#8CC63F" />
        </svg>

        {/* Gradient diagonal */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0D2B0F 0%, #0D2B0F 50%, #1a3d1c 100%)",
          }}
        />

        {/* Accentuation verte en haut à droite */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(140,198,63,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Contenu principal */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            height: "100%",
          }}
        >
          {/* En-tête */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Logo cercle */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1.5px solid rgba(140,198,63,0.4)",
                backgroundColor: "rgba(140,198,63,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ color: "#8CC63F", fontSize: 20, lineHeight: 1 }}>✦</div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.3px" }}>
              IA4EARTH<span style={{ color: "#8CC63F" }}>.</span>
            </span>
            <div
              style={{
                marginLeft: 12,
                padding: "4px 14px",
                borderRadius: 20,
                border: "1px solid rgba(140,198,63,0.25)",
                backgroundColor: "rgba(140,198,63,0.08)",
              }}
            >
              <span style={{ color: "rgba(140,198,63,0.9)", fontSize: 13, fontWeight: 600 }}>
                3ème édition
              </span>
            </div>
          </div>

          {/* Titre principal */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ color: "rgba(220,240,200,0.55)", fontSize: 18, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>
                Startup Challenge
              </span>
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: 68,
                  fontWeight: 900,
                  lineHeight: 1.02,
                  margin: 0,
                  letterSpacing: "-1.5px",
                }}
              >
                Votre startup a de
                <br />
                <span style={{ color: "#8CC63F" }}>l'impact.</span>{" "}
                <span style={{ color: "rgba(255,255,255,0.65)" }}>Faites-le savoir.</span>
              </h1>
            </div>

            <p style={{ color: "rgba(220,240,200,0.65)", fontSize: 22, margin: 0, fontWeight: 400, maxWidth: 700, lineHeight: 1.4 }}>
              Économie verte · Finance responsable · Développement durable
            </p>
          </div>

          {/* Pied de page */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {[
                { label: "Clôture des candidatures", value: "15 oct. 2026" },
                { label: "Finale", value: "5–6 nov. 2026" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ color: "rgba(220,240,200,0.45)", fontSize: 13, fontWeight: 500, letterSpacing: "0.5px" }}>
                    {item.label}
                  </span>
                  <span style={{ color: "#8CC63F", fontSize: 18, fontWeight: 700 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA pill */}
            <div
              style={{
                padding: "14px 30px",
                borderRadius: 50,
                backgroundColor: "#8CC63F",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#0D2B0F", fontSize: 17, fontWeight: 800 }}>
                challenge.salondedeveloppementdurable.com
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
