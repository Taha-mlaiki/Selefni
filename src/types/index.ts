export type CreditType = "personal" | "auto" | "mortgage" | "business";

export type RequestStatus = "pending" | "in_progress" | "accepted" | "rejected";

export type JobSituation = "employed" | "self_employed" | "unemployed" | "retired";

export interface Simulation {
  id: string;
  type: CreditType;
  amount: number;
  duration: number; // in months
  rate: number; // annual rate in %
  fees: number;
  insurance: number; // monthly insurance
  monthlyPayment: number;
  totalCost: number;
  taeg: number; // TAEG in %
  createdAt: string;
}

export interface AmortizationRow {
  month: number;
  remainingCapital: number;
  interest: number;
  principal: number;
  insurance: number;
  monthlyPayment: number;
}

export interface CreditRequest {
  id: string;
  simulationId: string;
  simulation: Simulation;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  income: number;
  jobSituation: JobSituation;
  comment?: string;
  status: RequestStatus;
  isPriority: boolean;
  notes: string[];
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryEntry {
  status: RequestStatus;
  timestamp: string;
  note?: string;
}

export interface Notification {
  id: string;
  requestId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
