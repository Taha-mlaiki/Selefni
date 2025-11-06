export type CreditType = "auto" | "consommation" | "immobilier" | "autre";

export interface Simulation {
  id: string;
  type: CreditType;
  metier: string;
  montant: number;
  duree: number; // mois
  tauxAnnuel: number; // %
  fraisFixes?: number;
  assurance?: number; // %
  createdAt: string;
}

export interface Application {
  id: string;
  simulationId: string;
  nom: string;
  email: string;
  telephone: string;
  revenuMensuel: number;
  situationPro: string;
  commentaire?: string;
  statut: "en attente" | "en cours" | "acceptée" | "refusée";
  prioritaire: boolean;
  notes: { text: string; date: string }[];
  createdAt: string;
}

export interface Notification {
  id: string;
  applicationId: string;
  lu: boolean;
  createdAt: string;
}
