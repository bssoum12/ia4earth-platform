"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/#calendrier", label: "Calendrier" },
  { href: "/#eligibilite", label: "Éligibilité" },
  { href: "/#prix", label: "Prix" },
  { href: "/reglement", label: "Règlement" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-forest-900 border-b border-forest-800/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-none" aria-label="Accueil IA4EARTH">
          <div className="w-8 h-8 rounded-full bg-leaf-400/20 border border-leaf-400/30 flex items-center justify-center">
            {/* Icône feuille + circuit */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 2C5 2 3 4 3 7c0 2 1 3.5 3 4.5" stroke="#8CC63F" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 2c3 0 5 2 5 5 0 2-1 3.5-3 4.5" stroke="#009B70" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="11.5" x2="8" y2="14" stroke="#8CC63F" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-sm sm:text-base leading-tight">
            IA4EARTH<span className="text-leaf-400 ml-0.5">.</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded text-sm text-leaf-100/70 hover:text-white hover:bg-white/8 transition-colors duration-150"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/candidater" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
            Candidater
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Burger mobile */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded focus-visible:ring-2 focus-visible:ring-leaf-400"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden border-t border-forest-800/60 bg-forest-900 pb-4 px-4">
          <nav className="flex flex-col gap-1 pt-3" aria-label="Menu mobile">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded text-sm text-leaf-100/70 hover:text-white hover:bg-white/8 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/candidater"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 justify-center"
            >
              Candidater →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
