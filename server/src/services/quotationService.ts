import { AppError } from "../lib/http.js";
import { transaction } from "../lib/db.js";
import { productRepository } from "../repositories/productRepository.js";
import { quotationRepository } from "../repositories/quotationRepository.js";
import type { QuotationStatus } from "../types/domain.js";
import { serializeQuotation } from "./serializers.js";

export interface QuotationInput {
  clientId: string;
  date: string;
  status: QuotationStatus;
  discount: number;
  notes: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}

async function buildItems(items: QuotationInput["items"]) {
  return Promise.all(
    items.map(async (item) => {
      const product = await productRepository.find(item.productId);
      if (!product) throw new AppError(404, "Produto do orcamento nao encontrado");
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      };
    }),
  );
}

export const quotationService = {
  async list(filters: { search?: string; date?: string; status?: QuotationStatus }) {
    return (await quotationRepository.list(filters)).map(serializeQuotation);
  },
  async find(id: string) {
    const quotation = await quotationRepository.find(id);
    if (!quotation) throw new AppError(404, "Orcamento nao encontrado");
    return serializeQuotation(quotation);
  },
  async create(data: QuotationInput) {
    const items = await buildItems(data.items);
    const quotation = await transaction(async (client) => {
      const number = await quotationRepository.nextNumber(client);
      return quotationRepository.create(client, { ...data, number, items });
    });
    if (!quotation) throw new AppError(500, "Nao foi possivel criar o orcamento");
    return serializeQuotation(quotation);
  },
  async update(id: string, data: QuotationInput) {
    await this.find(id);
    const items = await buildItems(data.items);
    const quotation = await transaction((client) => quotationRepository.update(client, id, { ...data, items }));
    if (!quotation) throw new AppError(500, "Nao foi possivel atualizar o orcamento");
    return serializeQuotation(quotation);
  },
};
