import { Simulation, CreditRequest, Notification } from "@/types";

const API_BASE_URL = "http://localhost:3001";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Simulations
  simulations: {
    create: (data: Simulation) => fetchAPI<Simulation>("/simulations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    getAll: () => fetchAPI<Simulation[]>("/simulations"),
    getById: (id: string) => fetchAPI<Simulation>(`/simulations/${id}`),
  },

  // Requests
  requests: {
    create: (data: CreditRequest) => fetchAPI<CreditRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    getAll: () => fetchAPI<CreditRequest[]>("/requests"),
    getById: (id: string) => fetchAPI<CreditRequest>(`/requests/${id}`),
    update: (id: string, data: Partial<CreditRequest>) => fetchAPI<CreditRequest>(`/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI<void>(`/requests/${id}`, {
      method: "DELETE",
    }),
  },

  // Notifications
  notifications: {
    create: (data: Omit<Notification, "id">) => fetchAPI<Notification>("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    getAll: () => fetchAPI<Notification[]>("/notifications"),
    update: (id: string, data: Partial<Notification>) => fetchAPI<Notification>(`/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  },
};
