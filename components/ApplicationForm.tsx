"use client";

import { useState, useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidatureSchema, CandidatureInput } from "@/lib/validation";
import { useRouter } from "next/navigation";

const THEMATIQUES = [
  { value: "economie_verte",          label: "Économie verte" },
  { value: "finance_responsable",     label: "Finance responsable" },
  { value: "developpement_durable",   label: "Développement durable" },
] as const;

const STEPS = ["Startup", "Équipe", "Traction", "Documents", "Consentements"];

export default function ApplicationForm() {
  const router = useRouter();
  const [step, setStep]           = useState(0);
  const [pitchFile, setPitchFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CandidatureInput>({
    resolver: zodResolver(candidatureSchema) as never,
    defaultValues: {
      thematiques:  [],
      composante_ia: false,
      equipe: [{ nom: "", role: "", linkedin: "" }],
      acceptation_reglement:    false,
      autorisation_communication: false,
    } as Partial<CandidatureInput>,
    mode: "onBlur",
  });

  const { fields: equipeFields, append, remove } = useFieldArray({
    control,
    name: "equipe",
  });

  const composanteIa = watch("composante_ia");

  // Champs à valider par step
  const STEP_FIELDS: Array<Array<keyof CandidatureInput | string>> = [
    ["nom_startup", "statut_juridique", "date_constitution", "thematiques"],
    ["equipe"],
    ["traction.clients_actifs", "traction.ca_12_mois", "traction.preuve_marche", "email_contact"],
    [], // documents — validation manuelle du fichier
    ["acceptation_reglement"],
  ];

  async function goNext() {
    const fields = STEP_FIELDS[step] ?? [];
    const valid = fields.length > 0 ? await trigger(fields as Parameters<typeof trigger>[0]) : true;
    if (step === 3 && !pitchFile) {
      setApiError("Le pitch deck PDF est obligatoire pour passer à l'étape suivante.");
      return;
    }
    setApiError(null);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goPrev() {
    setApiError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: CandidatureInput) {
    if (!pitchFile) {
      setApiError("Le pitch deck PDF est obligatoire.");
      return;
    }

    setSubmitting(true);
    setApiError(null);

    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    fd.append("pitch_deck", pitchFile);

    try {
      const res = await fetch("/api/candidatures", { method: "POST", body: fd });
      let json: Record<string, unknown> = {};
      try { json = await res.json(); } catch { /* réponse non-JSON (erreur serveur 500) */ }

      if (!res.ok) {
        // Vérifier si les candidatures sont closes (410)
        if (res.status === 410) {
          setApiError(json.message);
        } else {
          setApiError(json.message ?? "Une erreur est survenue. Veuillez réessayer.");
        }
        return;
      }

      router.push(`/candidater/confirmation?dossier=${json.numero_dossier}`);
    } catch {
      setApiError("Erreur réseau — vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleFile(f: File | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setApiError("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setApiError("Le fichier dépasse 10 Mo.");
      return;
    }
    setApiError(null);
    setPitchFile(f);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Stepper */}
      <div className="flex gap-1.5 mb-8" role="list" aria-label="Étapes du formulaire">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1" role="listitem">
            <div
              className={`h-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-forest-700" : "bg-leaf-200"
              }`}
            />
            <div className={`text-[11px] mt-1.5 ${i === step ? "text-forest-800 font-semibold" : "text-forest-600/50"}`}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ===== STEP 0 : Identité startup ===== */}
      {step === 0 && (
        <fieldset className="border-none p-0 m-0">
          <legend className="font-display text-xl font-bold text-forest-900 mb-5">Identité de la startup</legend>

          <div className="mb-5">
            <label className="form-label" htmlFor="nom_startup">Nom de la startup *</label>
            <input id="nom_startup" className={`form-input ${errors.nom_startup ? "error" : ""}`}
              placeholder="Ex. GreenLoop Tunisie" {...register("nom_startup")} />
            {errors.nom_startup && <p className="form-error">{errors.nom_startup.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="form-label" htmlFor="statut_juridique">Statut juridique * (Art. 4)</label>
              <select id="statut_juridique" className={`form-input ${errors.statut_juridique ? "error" : ""}`}
                {...register("statut_juridique")}>
                <option value="">— Sélectionner —</option>
                <option value="constituee">Constituée juridiquement</option>
                <option value="en_cours_constitution">En cours de constitution avancée</option>
              </select>
              {errors.statut_juridique && <p className="form-error">{errors.statut_juridique.message}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="date_constitution">Date de constitution (ou prévue) *</label>
              <input id="date_constitution" className={`form-input ${errors.date_constitution ? "error" : ""}`}
                placeholder="MM/AAAA" {...register("date_constitution")} />
              {errors.date_constitution && <p className="form-error">{errors.date_constitution.message}</p>}
            </div>
          </div>

          {/* Thématiques */}
          <div className="mb-5">
            <label className="form-label">Thématique(s) éligible(s) * — Art. 3.2</label>
            <Controller
              name="thematiques"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2 mt-1">
                  {THEMATIQUES.map((t) => {
                    const active = field.value.includes(t.value as never);
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          const current = field.value as string[];
                          field.onChange(
                            active ? current.filter((v) => v !== t.value) : [...current, t.value]
                          );
                        }}
                        aria-pressed={active}
                        className={`thematic-chip ${active ? "active" : ""}`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.thematiques && <p className="form-error">{errors.thematiques.message}</p>}
          </div>

          {/* Composante IA */}
          <div className="mb-2">
            <label className="form-label" htmlFor="composante_ia">Composante intelligence artificielle</label>
            <select id="composante_ia" className="form-input"
              {...register("composante_ia", { setValueAs: (v) => v === "true" })}>
              <option value="false">Aucune composante IA</option>
              <option value="true">IA utilisée — à préciser ci-dessous</option>
            </select>
            <p className="form-hint">L'IA n'est pas un critère de sélection (Art. 3.2). Information purement indicative.</p>
          </div>

          {composanteIa && (
            <div className="mb-2 mt-3">
              <label className="form-label" htmlFor="description_ia">Description de la composante IA</label>
              <textarea id="description_ia" className="form-input" rows={3}
                placeholder="Décrivez brièvement comment l'IA est intégrée dans votre solution…"
                {...register("description_ia")} />
            </div>
          )}
        </fieldset>
      )}

      {/* ===== STEP 1 : Équipe ===== */}
      {step === 1 && (
        <fieldset className="border-none p-0 m-0">
          <legend className="font-display text-xl font-bold text-forest-900 mb-5">
            Équipe <span className="text-sm font-normal text-forest-600/60">(1 à 5 personnes)</span>
          </legend>

          <div className="space-y-5">
            {equipeFields.map((field, index) => (
              <div key={field.id} className="surface-card rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-forest-700 uppercase tracking-wide">
                    Membre {index + 1}
                  </div>
                  {equipeFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-xs text-earth-700 hover:underline focus-visible:ring-1 focus-visible:ring-earth-600"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label" htmlFor={`equipe.${index}.nom`}>Nom complet *</label>
                    <input className={`form-input ${errors.equipe?.[index]?.nom ? "error" : ""}`}
                      placeholder="Prénom Nom" {...register(`equipe.${index}.nom`)} />
                    {errors.equipe?.[index]?.nom && <p className="form-error">{errors.equipe[index]?.nom?.message}</p>}
                  </div>
                  <div>
                    <label className="form-label" htmlFor={`equipe.${index}.role`}>Rôle / Fonction *</label>
                    <input className={`form-input ${errors.equipe?.[index]?.role ? "error" : ""}`}
                      placeholder="Ex. CEO, CTO, Designer…" {...register(`equipe.${index}.role`)} />
                    {errors.equipe?.[index]?.role && <p className="form-error">{errors.equipe[index]?.role?.message}</p>}
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label">LinkedIn (optionnel)</label>
                  <input className="form-input" type="url"
                    placeholder="https://linkedin.com/in/…" {...register(`equipe.${index}.linkedin`)} />
                  {errors.equipe?.[index]?.linkedin && <p className="form-error">{errors.equipe[index]?.linkedin?.message}</p>}
                </div>
              </div>
            ))}
          </div>

          {equipeFields.length < 5 && (
            <button
              type="button"
              onClick={() => append({ nom: "", role: "", linkedin: "" })}
              className="mt-4 btn-ghost text-sm py-2"
            >
              + Ajouter un membre
            </button>
          )}
          {errors.equipe && !Array.isArray(errors.equipe) && (
            <p className="form-error mt-2">{(errors.equipe as { message?: string }).message}</p>
          )}
        </fieldset>
      )}

      {/* ===== STEP 2 : Traction & Contact ===== */}
      {step === 2 && (
        <fieldset className="border-none p-0 m-0">
          <legend className="font-display text-xl font-bold text-forest-900 mb-1">Traction</legend>
          <p className="text-sm text-forest-700/60 mb-5">Art. 4 du règlement — critère de recevabilité</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="form-label" htmlFor="clients_actifs">Nombre de clients actifs *</label>
              <input id="clients_actifs" className={`form-input ${errors.traction?.clients_actifs ? "error" : ""}`}
                placeholder="Ex. 24" {...register("traction.clients_actifs")} />
              {errors.traction?.clients_actifs && <p className="form-error">{errors.traction.clients_actifs.message}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="ca_12_mois">Chiffre d'affaires (12 derniers mois, TND) *</label>
              <input id="ca_12_mois" className={`form-input ${errors.traction?.ca_12_mois ? "error" : ""}`}
                placeholder="Ex. 45 000" {...register("traction.ca_12_mois")} />
              {errors.traction?.ca_12_mois && <p className="form-error">{errors.traction.ca_12_mois.message}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="form-label" htmlFor="preuve_marche">Preuve de marché *</label>
            <textarea id="preuve_marche"
              className={`form-input ${errors.traction?.preuve_marche ? "error" : ""}`}
              rows={4}
              placeholder="Décrivez vos indicateurs de traction : clients, revenus, partenariats, lettres d'intention, témoignages…"
              {...register("traction.preuve_marche")}
            />
            {errors.traction?.preuve_marche && <p className="form-error">{errors.traction.preuve_marche.message}</p>}
          </div>

          <div>
            <label className="form-label" htmlFor="email_contact">E-mail de contact * (pour l'accusé de réception et les communications)</label>
            <input id="email_contact" type="email"
              className={`form-input ${errors.email_contact ? "error" : ""}`}
              placeholder="contact@marstartup.tn"
              {...register("email_contact")}
            />
            {errors.email_contact && <p className="form-error">{errors.email_contact.message}</p>}
          </div>
        </fieldset>
      )}

      {/* ===== STEP 3 : Documents ===== */}
      {step === 3 && (
        <fieldset className="border-none p-0 m-0">
          <legend className="font-display text-xl font-bold text-forest-900 mb-5">Documents</legend>

          <div>
            <label className="form-label">Pitch deck PDF * (max. 10 Mo, 10 pages recommandé)</label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-150 cursor-pointer
                ${pitchFile ? "border-forest-600 bg-leaf-50" : "border-leaf-300 bg-white hover:border-leaf-400"}`}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              role="button"
              tabIndex={0}
              aria-label="Sélectionner un fichier PDF"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {pitchFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-forest-700/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#2D6030" strokeWidth="1.8"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#2D6030" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="font-semibold text-forest-900 text-sm">{pitchFile.name}</div>
                  <div className="text-xs text-forest-600/60">{(pitchFile.size / 1024 / 1024).toFixed(2)} Mo</div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPitchFile(null); }}
                    className="text-xs text-earth-700 underline mt-1"
                  >
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-forest-700/60">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <span className="font-semibold text-forest-800 text-sm">Glissez votre pitch deck ici</span>
                    <span className="text-sm"> ou </span>
                    <span className="text-sm text-circuit-600 underline">parcourez</span>
                  </div>
                  <div className="text-xs">PDF uniquement · 10 Mo max.</div>
                </div>
              )}
            </div>

            <p className="form-hint mt-2">
              Votre pitch deck ne doit pas contenir d'informations de valorisation ou de terms sheet — ces données restent confidentielles et ne sont partagées qu'avec le jury signataire d'un NDA.
            </p>
          </div>
        </fieldset>
      )}

      {/* ===== STEP 4 : Consentements ===== */}
      {step === 4 && (
        <fieldset className="border-none p-0 m-0">
          <legend className="font-display text-xl font-bold text-forest-900 mb-5">Consentements</legend>

          <div className="space-y-5">
            {/* Règlement — obligatoire */}
            <div className={`surface-card rounded-lg p-4 ${errors.acceptation_reglement ? "border-earth-400" : ""}`}>
              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-leaf-300 accent-forest-700 cursor-pointer flex-none"
                  {...register("acceptation_reglement")}
                />
                <div>
                  <span className="text-sm font-semibold text-forest-900">
                    J'accepte le règlement du IA4EARTH Startup Challenge *
                  </span>
                  <p className="text-xs text-forest-700/60 mt-1">
                    En soumettant cette candidature, j'atteste avoir lu et accepté le règlement intégral du concours
                    dans toutes ses dispositions (Art. 14). Les décisions du jury sont définitives et sans appel (Art. 13).
                    La participation ne transfère aucun droit de propriété intellectuelle à l'organisation (Art. 11).
                  </p>
                </div>
              </label>
              {errors.acceptation_reglement && (
                <p className="form-error mt-2 pl-7">{errors.acceptation_reglement.message}</p>
              )}
            </div>

            {/* Communication — optionnel */}
            <div className="surface-card rounded-lg p-4">
              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-leaf-300 accent-forest-700 cursor-pointer flex-none"
                  {...register("autorisation_communication")}
                />
                <div>
                  <span className="text-sm font-semibold text-forest-900">
                    J'autorise l'utilisation de mon nom/logo/résumé à des fins de communication
                  </span>
                  <p className="text-xs text-forest-700/60 mt-1">
                    (Facultatif — Art. 12) L'organisation pourra mentionner la startup dans ses supports de communication
                    si elle figure parmi les finalistes ou lauréats. Vous pouvez refuser par écrit à tout moment.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </fieldset>
      )}

      {/* Erreur API */}
      {apiError && (
        <div className="mt-5 bg-earth-100 border border-earth-400/30 rounded-lg p-4 text-sm text-earth-800" role="alert">
          <strong className="block text-earth-700 mb-1">Erreur</strong>
          {apiError}
        </div>
      )}

      {/* Boutons de navigation */}
      <div className="mt-8 flex justify-between gap-3">
        <div>
          {step > 0 && (
            <button type="button" onClick={goPrev} className="btn-ghost text-sm py-2" disabled={submitting}>
              ← Précédent
            </button>
          )}
        </div>

        <div>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={goNext} className="btn-primary text-sm">
              Étape suivante →
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary text-sm min-w-[180px] justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Envoi en cours…
                </span>
              ) : (
                "Soumettre ma candidature"
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
