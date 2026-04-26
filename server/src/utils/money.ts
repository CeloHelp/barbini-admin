export function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export function quotationTotals(items: Array<{ quantity: unknown; unitPrice: unknown }>, discount: unknown) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );
  const total = Math.max(0, subtotal - Number(discount ?? 0));
  return { subtotal, total };
}
