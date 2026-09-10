export type StatutJuridique = "constituee" | "en_cours_constitution";

export type Thematique = "economie_verte" | "finance_responsable" | "developpement_durable";

export type StatutCandidature =
  | "brouillon"
  | "soumise"
  | "preselectionee"
  | "finaliste"
  | "non_retenue";

export interface MembreEquipe {
  nom: string;
  role: string;
  linkedin?: string;
}

export interface Traction {
  clients_actifs: number | string;
  ca_12_mois: number | string;
  preuve_marche: string;
}

export interface CandidatureFormData {
  // Identité startup
  nom_startup: string;
  statut_juridique: StatutJuridique;
  date_constitution: string;
  thematiques: Thematique[];
  composante_ia: boolean;
  description_ia?: string;

  // Équipe
  equipe: MembreEquipe[];

  // Traction
  traction: Traction;

  // Contacts & consentements
  email_contact: string;
  acceptation_reglement: boolean;
  autorisation_communication: boolean;
}

export interface CandidatureDB extends CandidatureFormData {
  id: string;
  numero_dossier: string;
  statut: StatutCandidature;
  pitch_deck_url?: string;
  documents_complementaires_urls?: string[];
  date_soumission?: string;
  created_at: string;
  updated_at: string;
}
