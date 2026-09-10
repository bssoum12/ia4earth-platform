// Tailwind v4 : la configuration du thème est dans globals.css via @theme
// Ce fichier est conservé pour la compatibilité des outils, mais n'est plus
// la source de vérité pour les design tokens.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
