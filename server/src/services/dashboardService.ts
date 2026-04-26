import { pool } from "../lib/db.js";
import { quotationTotals } from "../utils/money.js";
import { quotationRepository } from "../repositories/quotationRepository.js";
import { serializeQuotation } from "./serializers.js";

export const dashboardService = {
  async summary() {
    const [clientsResult, productsResult, activeProductsResult, quotations] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM clients"),
      pool.query("SELECT COUNT(*)::int AS count FROM products"),
      pool.query("SELECT COUNT(*)::int AS count FROM products WHERE status = 'ativo'"),
      quotationRepository.list({}),
    ]);

    const totalOrcado = quotations.reduce((sum, quotation) => {
      const totals = quotationTotals(quotation.items, quotation.discount);
      return sum + totals.total;
    }, 0);

    const status = quotations.reduce<Record<string, number>>((acc, quotation) => {
      acc[quotation.status] = (acc[quotation.status] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totals: {
        clients: clientsResult.rows[0].count,
        products: productsResult.rows[0].count,
        quotations: quotations.length,
        totalOrcado,
        activeProducts: activeProductsResult.rows[0].count,
      },
      status,
      monthly: buildMonthly(quotations),
      recentQuotations: quotations.slice(0, 5).map(serializeQuotation),
    };
  },
};

function buildMonthly(quotations: Array<{ date: Date; discount: unknown; items: Array<{ quantity: unknown; unitPrice: unknown }> }>) {
  const labels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const totals = new Map<string, number>();
  for (const quotation of quotations) {
    const key = labels[quotation.date.getUTCMonth()];
    totals.set(key, (totals.get(key) ?? 0) + quotationTotals(quotation.items, quotation.discount).total);
  }
  return labels.map((mes) => ({ mes, valor: totals.get(mes) ?? 0 }));
}
