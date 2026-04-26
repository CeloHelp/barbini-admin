export type ProductStatus = "ativo" | "inativo";
export type QuotationStatus = "pendente" | "aprovado" | "recusado" | "concluido";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationItemRecord {
  id: string;
  quotationId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface QuotationRecord {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: Date;
  status: QuotationStatus;
  discount: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  client: ClientRecord;
  items: QuotationItemRecord[];
}
