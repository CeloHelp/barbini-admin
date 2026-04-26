import type { Client, DashboardSummary, Product, Quotation, QuotationPayload, User } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "barbini-admin-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro inesperado" }));
    throw new Error(error.message ?? "Erro inesperado");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  async login(email: string, password: string) {
    return request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  me() {
    return request<{ user: User }>("/auth/me");
  },
  dashboard() {
    return request<DashboardSummary>("/dashboard");
  },
  clients() {
    return request<Client[]>("/clients");
  },
  createClient(data: Omit<Client, "id" | "createdAt" | "updatedAt">) {
    return request<Client>("/clients", { method: "POST", body: JSON.stringify(data) });
  },
  updateClient(id: string, data: Omit<Client, "id" | "createdAt" | "updatedAt">) {
    return request<Client>(`/clients/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteClient(id: string) {
    return request<void>(`/clients/${id}`, { method: "DELETE" });
  },
  products() {
    return request<Product[]>("/products");
  },
  createProduct(data: Omit<Product, "id">) {
    return request<Product>("/products", { method: "POST", body: JSON.stringify(data) });
  },
  updateProduct(id: string, data: Omit<Product, "id">) {
    return request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteProduct(id: string) {
    return request<void>(`/products/${id}`, { method: "DELETE" });
  },
  quotations() {
    return request<Quotation[]>("/quotations");
  },
  quotation(id: string) {
    return request<Quotation>(`/quotations/${id}`);
  },
  createQuotation(data: QuotationPayload) {
    return request<Quotation>("/quotations", { method: "POST", body: JSON.stringify(data) });
  },
  updateQuotation(id: string, data: QuotationPayload) {
    return request<Quotation>(`/quotations/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
};
