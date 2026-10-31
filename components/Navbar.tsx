"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { isCandidatureOuverte } from "@/lib/dates";

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
  const ouvert = isCandidatureOuverte();

  return (
    <header className="sticky top-0 z-50 bg-forest-900 border-b border-forest-800/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-none" aria-label="Accueil — Salon de l'Économie Verte">
          <div className="bg-white rounded-lg px-2 py-1 flex items-center">
            <Image
              src="/logo-salon.png"
              alt="Salon de l'Économie Verte, Finance Responsable et Développement Durable"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
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
          {ouvert && (
            <Link href="/candidater" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
              Candidater
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}

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
            {ouvert && (
              <Link
                href="/candidater"
                onClick={() => setOpen(false)}
                className="btn-primary mt-3 justify-center"
              >
                Candidater →
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
