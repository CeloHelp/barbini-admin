import type { ClientRecord, ProductRecord, QuotationRecord } from "../types/domain.js";
import { quotationTotals, toNumber } from "../utils/money.js";

export function serializeClient(client: ClientRecord) {
  return {
    ...client,
    createdAt: client.createdAt.toISOString().slice(0, 10),
    updatedAt: client.updatedAt.toISOString(),
  };
}

export function serializeProduct(product: ProductRecord) {
  return {
    ...product,
    price: toNumber(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function serializeQuotation(quotation: QuotationRecord) {
  const items = quotation.items.map((item) => ({
    ...item,
    quantity: toNumber(item.quantity),
    unitPrice: toNumber(item.unitPrice),
    subtotal: toNumber(item.quantity) * toNumber(item.unitPrice),
  }));
  const totals = quotationTotals(items, quotation.discount);

  return {
    ...quotation,
    client: serializeClient(quotation.client),
    clientName: quotation.client.name,
    date: quotation.date.toISOString().slice(0, 10),
    discount: toNumber(quotation.discount),
    createdAt: quotation.createdAt.toISOString(),
    updatedAt: quotation.updatedAt.toISOString(),
    items,
    subtotal: totals.subtotal,
    total: totals.total,
  };
}
