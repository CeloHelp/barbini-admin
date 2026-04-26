import type { QuotationItem } from "../api/types";

export function calcSubtotal(items: Pick<QuotationItem, "quantity" | "unitPrice">[]): number {
  return items.reduce((acc, item) => acc + Number(item.quantity) * Number(item.unitPrice), 0);
}

export function calcTotal(items: Pick<QuotationItem, "quantity" | "unitPrice">[], discount: number): number {
  return Math.max(0, calcSubtotal(items) - Number(discount || 0));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function statusLabel(status: string) {
  return status === "concluido" ? "Concluido" : status.charAt(0).toUpperCase() + status.slice(1);
}
