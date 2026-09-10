"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/dates";

interface UnitProps {
  value: number;
  label: string;
  urgent?: boolean;
}

function Unit({ value, label, urgent }: UnitProps) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`
          font-mono font-black tabular-nums leading-none
          text-5xl sm:text-6xl lg:text-7xl
          px-3 py-2 rounded-xl min-w-[3.8rem] sm:min-w-[4.5rem] text-center
          shadow-lg border-b-4 transition-colors duration-300
          ${urgent
            ? "bg-earth-700 border-earth-800 text-white"
            : "bg-forest-900 border-forest-950 text-leaf-300"}
        `}
      >
        {display}
      </div>
      <span className="text-2xs font-bold text-forest-700/50 uppercase tracking-widest">
        {label}
      </span>
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

  const urgent = time.jours < 7;

  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${urgent ? "text-earth-700" : "text-forest-700/50"}`}>
        {urgent ? "⚡ Clôture imminente — plus que" : "Clôture dans"}
      </p>
      <div className="flex items-start gap-2 sm:gap-3">
        <Unit value={time.jours}    label="Jours"   urgent={urgent} />
        <div className="text-3xl font-black text-forest-700/20 mt-3 select-none">:</div>
        <Unit value={time.heures}   label="Heures"  urgent={urgent} />
        <div className="text-3xl font-black text-forest-700/20 mt-3 select-none">:</div>
        <Unit value={time.minutes}  label="Min"     urgent={urgent} />
        <div className="text-3xl font-black text-forest-700/20 mt-3 select-none">:</div>
        <Unit value={time.secondes} label="Sec"     urgent={urgent} />
      </div>
    </div>
  );
}
