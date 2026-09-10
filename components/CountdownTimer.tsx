"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/dates";

interface UnitProps {
  value: number;
  label: string;
}

function Unit({ value, label }: UnitProps) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="font-mono text-3xl sm:text-4xl font-bold text-forest-700 tabular-nums leading-none bg-white border border-leaf-200 rounded-md px-3 py-2 min-w-[3.5rem] text-center shadow-card">
        {display}
      </div>
      <span className="text-2xs font-semibold text-forest-600/60 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeRemaining());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.termine) {
    return (
      <div className="inline-flex items-center gap-2 bg-earth-100 border border-earth-400/30 rounded-md px-4 py-2 text-earth-700 text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-earth-600 animate-pulse-slow" />
        Candidatures closes — 15 octobre 2026
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-forest-700/50 uppercase tracking-wider mb-3">
        Clôture dans
      </p>
      <div className="flex items-start gap-2 sm:gap-3">
        <Unit value={time.jours}    label="Jours" />
        <div className="text-2xl font-bold text-forest-700/30 mt-2">:</div>
        <Unit value={time.heures}   label="Heures" />
        <div className="text-2xl font-bold text-forest-700/30 mt-2">:</div>
        <Unit value={time.minutes}  label="Min" />
        <div className="text-2xl font-bold text-forest-700/30 mt-2">:</div>
        <Unit value={time.secondes} label="Sec" />
      </div>
    </div>
  );
}
