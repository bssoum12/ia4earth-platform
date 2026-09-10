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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="form-label !mb-0">
          {label}
          <span className="text-forest-700/40 font-normal"> / {max}</span>
        </label>
        <div className="flex items-center gap-2">
          {/* Boutons +/- mobile-safe */}
          <button
            type="button"
            disabled={disabled || display <= 0}
            onClick={() => onChange(Math.max(0, display - 1))}
            className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold text-lg flex items-center justify-center hover:bg-leaf-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
            className="w-14 text-center font-mono font-bold text-lg text-forest-900 border border-leaf-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-leaf-400 disabled:opacity-50 disabled:bg-leaf-50"
            aria-label={`Score ${label}`}
          />
          <button
            type="button"
            disabled={disabled || display >= max}
            onClick={() => onChange(Math.min(max, display + 1))}
            className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold text-lg flex items-center justify-center hover:bg-leaf-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label={`Augmenter ${label}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Barre de progression visuelle */}
      <div className="relative h-2 bg-leaf-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-150 ${value != null ? "bg-leaf-400" : "bg-leaf-200"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Curseur range en dessous — uniquement complémentaire, l'input numérique est la source de vérité */}
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={display}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-leaf-400 disabled:opacity-40 cursor-pointer"
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

  const allScoresFilled = CRITERES.every((c) => scores[c.key] != null);
  const scoreTotal = allScoresFilled && !conflit
    ? Math.max(0, CRITERES.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0) - penalite)
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
      <div className="bg-earth-700/10 border border-earth-700/20 rounded-xl p-6 text-center">
        <div className="text-earth-700 font-semibold text-lg mb-2">Conflit d&apos;intérêt déclaré</div>
        <p className="text-forest-700/70 text-sm">
          Vous avez déclaré un conflit d&apos;intérêt pour cette candidature. Votre évaluation a été retirée automatiquement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Conflit d'intérêt */}
      {!isFinalized && (
        <div className="surface-card border border-earth-700/20">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={conflit}
              onChange={(e) => setConflit(e.target.checked)}
              className="mt-1 w-4 h-4 accent-earth-700"
            />
            <div>
              <div className="font-semibold text-earth-700">Déclarer un conflit d&apos;intérêt</div>
              <div className="text-sm text-forest-700/70 mt-0.5">
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
          <div className="surface-card space-y-7">
            <h3 className="font-display font-semibold text-forest-900 text-lg">Grille d&apos;évaluation</h3>
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

            {/* Indicateur critères complétés */}
            <div className="flex items-center gap-2 pt-2 border-t border-leaf-100 text-sm text-forest-700/60">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${allScoresFilled ? "bg-leaf-400 text-forest-900" : "bg-leaf-100 text-forest-700/40"}`}>
                {allScoresFilled ? "✓" : `${CRITERES.filter((c) => scores[c.key] != null).length}/${CRITERES.length}`}
              </span>
              <span>{allScoresFilled ? "Tous les critères notés" : "Critères à compléter"}</span>
            </div>
          </div>

          {/* Pénalité */}
          <div className="surface-card">
            <label className="form-label">Pénalité délai de présentation <span className="text-forest-700/40 font-normal">(points à retrancher)</span></label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isFinalized || penalite <= 0}
                onClick={() => setPenalite((p) => Math.max(0, p - 1))}
                className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold text-lg flex items-center justify-center hover:bg-leaf-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >−</button>
              <span className="font-mono font-bold text-xl text-forest-900 w-8 text-center">{penalite}</span>
              <button
                type="button"
                disabled={isFinalized}
                onClick={() => setPenalite((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-leaf-200 bg-white text-forest-700 font-bold text-lg flex items-center justify-center hover:bg-leaf-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >+</button>
            </div>
            <p className="form-hint mt-2">Applicable uniquement en finale si le temps imparti n&apos;a pas été respecté.</p>
          </div>

          {/* Score total */}
          {scoreTotal != null && (
            <div className="bg-forest-900 text-white rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-display font-semibold text-base">Score total provisoire</div>
                {penalite > 0 && (
                  <div className="text-white/50 text-xs mt-0.5">
                    {CRITERES.reduce((s, c) => s + (scores[c.key] ?? 0), 0)} pts − {penalite} pts pénalité
                  </div>
                )}
              </div>
              <span className="text-4xl font-mono font-bold text-leaf-400">
                {scoreTotal} <span className="text-xl text-white/50">/ 100</span>
              </span>
            </div>
          )}

          {/* Commentaires */}
          <div className="surface-card space-y-4">
            <h3 className="font-display font-semibold text-forest-900">Commentaires qualitatifs</h3>
            <p className="text-xs text-forest-700/50 -mt-2">Ces commentaires sont strictement confidentiels — ils ne seront jamais communiqués aux candidats (Art. 7.2).</p>
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
              <label className="form-label">Commentaire général <span className="text-forest-700/40 font-normal">(optionnel)</span></label>
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
        <div className="p-3 bg-earth-700/10 border border-earth-700/30 rounded-lg text-earth-700 text-sm" role="alert">
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
              className="btn-primary !bg-earth-700 hover:!bg-earth-700/90"
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
        <div className="p-4 bg-leaf-50 border border-leaf-100 rounded-xl text-forest-700 text-sm flex items-center gap-2">
          <span className="text-leaf-400 text-lg">✓</span>
          Cette évaluation est finalisée et ne peut plus être modifiée.
        </div>
      )}
    </div>
  );
}
