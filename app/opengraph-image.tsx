import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "IA4EARTH Startup Challenge — Candidatures ouvertes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#163718",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Badge édition */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#8CC63F",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#8CC63F",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            3ÈME ÉDITION · SALON DE L&apos;ÉCONOMIE VERTE · TUNIS
          </span>
        </div>

        {/* Corps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#F4FBEA",
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            IA4EARTH
          </div>
          <div
            style={{
              color: "#8CC63F",
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Startup Challenge
          </div>
          <div
            style={{
              color: "rgba(244,251,234,0.65)",
              fontSize: 26,
              fontWeight: 400,
              marginTop: 8,
            }}
          >
            Candidatures ouvertes jusqu&apos;au 15 octobre 2026
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(140,198,63,0.25)",
            paddingTop: 28,
          }}
        >
          <span style={{ color: "rgba(244,251,234,0.45)", fontSize: 18 }}>
            5–6 novembre 2026 · UTICA, Tunis
          </span>
          <div
            style={{
              background: "#8CC63F",
              color: "#163718",
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 999,
              padding: "10px 26px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Candidater maintenant →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
