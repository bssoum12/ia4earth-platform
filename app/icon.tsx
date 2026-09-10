import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#163718",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Feuille stylisée */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 17 C10 17 3 13 3 7 C3 4 6 2 10 2 C14 2 17 4 17 7 C17 13 10 17 10 17Z"
            fill="#8CC63F"
          />
          <path
            d="M10 17 L10 8"
            stroke="#163718"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
