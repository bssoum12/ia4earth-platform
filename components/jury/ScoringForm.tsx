"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CRITERES } from "@/lib/jury";

interface Evaluation {
  id: string;
  statut: "en_cours" | "terminee";
  conflit_interet: boolean;
  score_impact: number | null;
  score_viabilite: number | null;
  score_innovation: number | null;
  score_equipe: number | null;
  score_scalabilite: number | null;
  penalite_temps: number;
  commentaires: string | null;
  points_forts: string | null;
  points_vigilance: string | null;
  est_calibration: boolean;
  etape: "preselection" | "finale";
}

interface Props {
  token: string;
  candidatureId: string;
  evaluation: Evaluation;
}

type Scores = Record<string, number | null>;

function ScoreStepper({
  label,
  max,
  value,
  disabled,
  onChange,
}: {
  label: string;
  max: number;
  value: number | null;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  const display = value ?? 0;
  const pct = (display / max) * 100;
  const isFull = pct === 100;
  const isHigh = pct >= 70;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-forest-800 leading-tight flex-1">
          {label}
          <span className="text-forest-700/35 font-normal text-xs ml-1">/ {max} pts</span>
        </label>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={disabled || display <= 0}
            onClick={() => onChange(Math.max(0, display - 1))}
            className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold flex items-center justify-center hover:bg-leaf-50 hover:border-leaf-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-base leading-none"
            aria-label={`Diminuer ${label}`}
          >
            −
          </button>
          <input
            type="number"
            min={0}
            max={max}
            value={value ?? ""}
            disabled={disabled}
            placeholder="—"
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) onChange(Math.min(max, Math.max(0, v)));
            }}
            className="w-12 text-center font-mono font-bold text-base text-forest-900 border border-leaf-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-leaf-400 focus:border-transparent disabled:opacity-40 disabled:bg-leaf-50/50 bg-white"
            aria-label={`Score ${label}`}
          />
          <button
            type="button"
            disabled={disabled || display >= max}
            onClick={() => onChange(Math.min(max, display + 1))}
            className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold flex items-center justify-center hover:bg-leaf-50 hover:border-leaf-300 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-base leading-none"
            aria-label={`Augmenter ${label}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="relative h-3 bg-leaf-50 border border-leaf-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-200 ${
            value == null ? "bg-leaf-100" :
            isFull ? "bg-leaf-500" :
            isHigh ? "bg-leaf-400" :
            "bg-circuit-500/70"
          }`}
          style={{ width: `${pct}%` }}
        />
        {value != null && pct > 0 && (
          <div
            className="absolute inset-y-0 flex items-center px-2 text-2xs font-mono font-bold text-white drop-shadow-sm"
            style={{ left: `${Math.min(pct - 2, 78)}%` }}
          >
            {display}
          </div>
        )}
      </div>

      {/* Curseur range */}
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={display}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-leaf-500 disabled:opacity-30 cursor-pointer h-1"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

export default function ScoringForm({ token, candidatureId, evaluation }: Props) {
  const router = useRouter();
  const isFinalized = evaluation.statut === "terminee";
  const hasConflict = evaluation.conflit_interet;

  const [conflit, setConflit] = useState(hasConflict);
  const [scores, setScores] = useState<Scores>({
    score_impact:      evaluation.score_impact,
    score_viabilite:   evaluation.score_viabilite,
    score_innovation:  evaluation.score_innovation,
    score_equipe:      evaluation.score_equipe,
    score_scalabilite: evaluation.score_scalabilite,
  });
  const [penalite, setPenalite] = useState(evaluation.penalite_temps ?? 0);
  const [commentaires, setCommentaires] = useState(evaluation.commentaires ?? "");
  const [pointsForts, setPointsForts] = useState(evaluation.points_forts ?? "");
  const [pointsVigilance, setPointsVigilance] = useState(evaluation.points_vigilance ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setScore(key: string, v: number) {
    setScores((s) => ({ ...s, [key]: v }));
  }

  const filled = CRITERES.filter((c) => scores[c.key] != null).length;
  const allScoresFilled = filled === CRITERES.length;
  const rawTotal = CRITERES.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0);
  const scoreTotal = allScoresFilled && !conflit
    ? Math.max(0, rawTotal - penalite)
    : null;

  async function submit(finaliser: boolean) {
    setSubmitting(true);
    setError(null);

    if (conflit) {
      const res = await fetch(`/api/jury/${token}/${candidatureId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conflit_interet: true,
          statut: "terminee",
          etape: evaluation.etape,
          est_calibration: evaluation.est_calibration,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      router.push(`/jury/${token}`);
      return;
    }

    if (finaliser && !allScoresFilled) {
      setError("Veuillez noter tous les critères avant de finaliser.");
      setSubmitting(false);
      return;
    }

    const payload = {
      conflit_interet: false,
      statut: finaliser ? "terminee" : "en_cours",
      etape: evaluation.etape,
      est_calibration: evaluation.est_calibration,
      ...Object.fromEntries(
        Object.entries(scores).map(([k, v]) => [k, v ?? null])
      ),
      penalite_temps: penalite,
      commentaires: commentaires || undefined,
      points_forts: pointsForts || undefined,
      points_vigilance: pointsVigilance || undefined,
    };

    const res = await fetch(`/api/jury/${token}/${candidatureId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Une erreur est survenue.");
      setSubmitting(false);
      return;
    }
    if (finaliser) {
      router.push(`/jury/${token}`);
    } else {
      setSubmitting(false);
    }
  }

  if (hasConflict) {
    return (
      <div className="bg-white rounded-2xl border border-earth-200 p-6 text-center">
        <div className="w-12 h-12 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-earth-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="text-earth-700 font-semibold text-base mb-1">Conflit d&apos;intérêt déclaré</div>
        <p className="text-forest-700/60 text-sm max-w-xs mx-auto">
          Vous avez déclaré un conflit d&apos;intérêt pour cette candidature. Votre évaluation a été retirée automatiquement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Conflit d'intérêt */}
      {!isFinalized && (
        <div className={`bg-white rounded-2xl border p-4 transition-colors ${conflit ? "border-amber-300 bg-amber-50/50" : "border-leaf-100"}`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={conflit}
              onChange={(e) => setConflit(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-600 rounded"
            />
            <div>
              <div className={`font-semibold text-sm ${conflit ? "text-amber-700" : "text-forest-900"}`}>
                Déclarer un conflit d&apos;intérêt
              </div>
              <div className="text-xs text-forest-700/60 mt-0.5 leading-relaxed">
                Si vous avez un lien personnel, professionnel ou financier avec cette startup, cochez cette case.
                Votre évaluation sera retirée automatiquement.
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Scoring grid */}
      {!conflit && (
        <>
          <div className="bg-white rounded-2xl border border-leaf-100 p-5 space-y-6">
            {/* En-tête avec compteur */}
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-forest-900">Grille d&apos;évaluation</h3>
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                allScoresFilled
                  ? "bg-leaf-100 text-forest-700 border border-leaf-200"
                  : "bg-leaf-50 text-forest-700/50 border border-leaf-100"
              }`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-2xs ${
                  allScoresFilled ? "bg-leaf-500 text-white" : "bg-leaf-100 text-forest-700/40"
                }`}>
                  {allScoresFilled ? "✓" : filled}
                </span>
                {allScoresFilled ? "Complet" : `${filled} / ${CRITERES.length}`}
              </div>
            </div>

            <div className="space-y-7">
              {CRITERES.map((critere) => (
                <ScoreStepper
                  key={critere.key}
                  label={critere.label}
                  max={critere.max}
                  value={scores[critere.key] ?? null}
                  disabled={isFinalized}
                  onChange={(v) => setScore(critere.key, v)}
                />
              ))}
            </div>
          </div>

          {/* Pénalité */}
          <div className="bg-white rounded-2xl border border-leaf-100 p-5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-forest-900">
                Pénalité délai
                <span className="text-forest-700/40 font-normal text-xs ml-1">(points à retrancher)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isFinalized || penalite <= 0}
                  onClick={() => setPenalite((p) => Math.max(0, p - 1))}
                  className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold flex items-center justify-center hover:bg-leaf-50 disabled:opacity-25 disabled:cursor-not-allowed"
                >−</button>
                <span className="font-mono font-bold text-xl text-forest-900 w-8 text-center">{penalite}</span>
                <button
                  type="button"
                  disabled={isFinalized}
                  onClick={() => setPenalite((p) => p + 1)}
                  className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold flex items-center justify-center hover:bg-leaf-50 disabled:opacity-25 disabled:cursor-not-allowed"
                >+</button>
              </div>
            </div>
            <p className="text-xs text-forest-700/45 mt-2">Applicable uniquement en finale si le temps imparti n&apos;a pas été respecté.</p>
          </div>

          {/* Score total */}
          {scoreTotal != null && (
            <div
              className="rounded-2xl p-5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #062B24 0%, #0F5A45 100%)" }}
            >
              <div>
                <div className="text-white/60 text-xs font-mono uppercase tracking-wider mb-0.5">Score total provisoire</div>
                {penalite > 0 && (
                  <div className="text-white/40 text-sm font-normal font-mono mt-0.5">
                    {rawTotal} − {penalite} pén.
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-leaf-400" style={{ fontSize: "3rem", lineHeight: 1 }}>
                  {scoreTotal}
                </span>
                <span className="text-white/35 font-mono text-xl"> / 100</span>
              </div>
            </div>
          )}

          {/* Commentaires */}
          <div className="bg-white rounded-2xl border border-leaf-100 p-5 space-y-4">
            <div>
              <h3 className="font-display font-semibold text-forest-900">Commentaires qualitatifs</h3>
              <p className="text-xs text-forest-700/45 mt-0.5">Strictement confidentiels — jamais communiqués aux candidats (Art. 7.2).</p>
            </div>
            <div>
              <label className="form-label">Points forts</label>
              <textarea
                rows={3}
                value={pointsForts}
                disabled={isFinalized}
                onChange={(e) => setPointsForts(e.target.value)}
                className="form-input resize-y"
                maxLength={1000}
                placeholder="Ce qui distingue positivement cette startup…"
              />
              <p className="form-hint text-right">{pointsForts.length}/1000</p>
            </div>
            <div>
              <label className="form-label">Points de vigilance</label>
              <textarea
                rows={3}
                value={pointsVigilance}
                disabled={isFinalized}
                onChange={(e) => setPointsVigilance(e.target.value)}
                className="form-input resize-y"
                maxLength={1000}
                placeholder="Risques ou lacunes identifiés…"
              />
              <p className="form-hint text-right">{pointsVigilance.length}/1000</p>
            </div>
            <div>
              <label className="form-label">
                Commentaire général
                <span className="text-forest-700/40 font-normal"> (optionnel)</span>
              </label>
              <textarea
                rows={4}
                value={commentaires}
                disabled={isFinalized}
                onChange={(e) => setCommentaires(e.target.value)}
                className="form-input resize-y"
                maxLength={2000}
                placeholder="Votre appréciation globale…"
              />
              <p className="form-hint text-right">{commentaires.length}/2000</p>
            </div>
          </div>
        </>
      )}

      {/* Erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Actions */}
      {!isFinalized && (
        <div className="flex gap-3 flex-wrap">
          {conflit ? (
            <button
              onClick={() => submit(true)}
              disabled={submitting}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? "Enregistrement…" : "Confirmer le conflit d'intérêt"}
            </button>
          ) : (
            <>
              <button
                onClick={() => submit(false)}
                disabled={submitting}
                className="btn-ghost"
              >
                {submitting ? "Sauvegarde…" : "Sauvegarder (brouillon)"}
              </button>
              <button
                onClick={() => submit(true)}
                disabled={submitting || !allScoresFilled}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                title={!allScoresFilled ? "Notez tous les critères avant de finaliser" : undefined}
              >
                {submitting ? "Finalisation…" : "Finaliser l'évaluation"}
              </button>
            </>
          )}
        </div>
      )}

      {isFinalized && (
        <div className="p-4 bg-leaf-50 border border-leaf-200 rounded-xl text-forest-700 text-sm flex items-center gap-2.5">
          <div className="w-6 h-6 bg-leaf-400 rounded-full flex items-center justify-center flex-none">
            <svg className="w-3.5 h-3.5 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Cette évaluation est finalisée et ne peut plus être modifiée.
        </div>
      )}
    </div>
  );
}
