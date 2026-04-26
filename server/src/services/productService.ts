import { AppError } from "../lib/http.js";
import { productRepository } from "../repositories/productRepository.js";
import type { ProductStatus } from "../types/domain.js";
import { serializeProduct } from "./serializers.js";

export const productService = {
  async list(filters: { search?: string; status?: ProductStatus }) {
    return (await productRepository.list(filters)).map(serializeProduct);
  },
  async find(id: string) {
    const product = await productRepository.find(id);
    if (!product) throw new AppError(404, "Produto nao encontrado");
    return serializeProduct(product);
  },
  async create(data: { name: string; description: string; price: number; unit: string; status: ProductStatus }) {
    return serializeProduct(await productRepository.create(data));
  },
  async update(id: string, data: { name: string; description: string; price: number; unit: string; status: ProductStatus }) {
    await this.find(id);
    return serializeProduct(await productRepository.update(id, data));
  },
  async remove(id: string) {
    await this.find(id);
    await productRepository.remove(id);
  },
};
