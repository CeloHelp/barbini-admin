export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  status: "ativo" | "inativo";
}

export type QuotationStatus = "pendente" | "aprovado" | "recusado" | "concluido";

export interface QuotationItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface Quotation {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  status: QuotationStatus;
  discount: number;
  notes: string;
  items: QuotationItem[];
  subtotal: number;
  total: number;
  client?: Client;
}

export interface DashboardSummary {
  totals: {
    clients: number;
    products: number;
    quotations: number;
    totalOrcado: number;
    activeProducts: number;
  };
  status: Record<QuotationStatus, number>;
  monthly: Array<{ mes: string; valor: number }>;
  recentQuotations: Quotation[];
}

export interface QuotationPayload {
  clientId: string;
  date: string;
  status: QuotationStatus;
  discount: number;
  notes: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}
