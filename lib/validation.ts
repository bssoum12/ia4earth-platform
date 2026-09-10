import { z } from "zod";

export const membreSchema = z.object({
  nom:      z.string().min(2, "Nom requis (min. 2 caractères)").max(100),
  role:     z.string().min(2, "Rôle requis").max(100),
  linkedin: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
});

export const candidatureSchema = z.object({
  // Identité
  nom_startup: z.string().min(2, "Nom de la startup requis").max(200),
  statut_juridique: z
    .enum(["constituee", "en_cours_constitution"])
    .refine((v) => !!v, { message: "Statut juridique requis (Art. 4 du règlement)" }),
  // [M-5] Validation du format MM/AAAA (pas seulement min(4))
  date_constitution: z
    .string()
    .regex(/^\d{2}\/\d{4}$/, "Format requis : MM/AAAA (ex. 03/2024)"),
  thematiques: z
    .array(z.enum(["economie_verte", "finance_responsable", "developpement_durable"]))
    .min(1, "Sélectionnez au moins une thématique (Art. 3.2)"),
  composante_ia:  z.boolean(),
  // [M-6] Limites sur les champs texte libres
  description_ia: z.string().max(500).optional(),

  // Équipe
  equipe: z
    .array(membreSchema)
    .min(1, "Indiquez au moins un membre de l'équipe")
    .max(5, "Maximum 5 membres (Art. 4)"),

  // Traction
  traction: z.object({
    clients_actifs: z.string().min(1, "Indiquez le nombre de clients actifs").max(200),
    ca_12_mois:     z.string().min(1, "Indiquez le CA des 12 derniers mois").max(200),
    preuve_marche:  z
      .string()
      .min(30, "Décrivez votre traction en quelques phrases (min. 30 caractères)")
      .max(2000),
  }),

  // Contact
  email_contact: z.string().email("Adresse e-mail invalide").max(254),

  // Consentements
  acceptation_reglement: z
    .boolean()
    .refine((v) => v === true, { message: "Vous devez accepter le règlement pour soumettre (Art. 14)" }),
  autorisation_communication: z.boolean(),
});

export type CandidatureInput = z.infer<typeof candidatureSchema>;
