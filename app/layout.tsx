import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    (() => {
      const u = process.env.NEXT_PUBLIC_APP_URL ?? "";
      return u.startsWith("http") ? u : "https://candidatures.ia4earth.tn";
    })()
  ),
  title: "IA4EARTH Startup Challenge — Candidatures",
  description:
    "Candidatez au IA4EARTH Startup Challenge, le concours de startups de la 3ème édition du Salon de l'Économie Verte, Finance Responsable et Développement Durable — 5-6 novembre 2026, UTICA Tunis.",
  openGraph: {
    title: "IA4EARTH Startup Challenge",
    description:
      "Votre startup a de l'impact. Faites-le savoir. Candidatures ouvertes jusqu'au 15 octobre 2026.",
    locale: "fr_TN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jakarta.variable} ${dmMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
