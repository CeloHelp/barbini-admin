import type { Request, Response } from "express";
import { validate } from "../lib/http.js";
import { productQuerySchema, productSchema } from "../schemas/productSchemas.js";
import { productService } from "../services/productService.js";
import type { ProductStatus } from "../types/domain.js";

export const productController = {
  async list(req: Request, res: Response) {
    const query = validate(productQuerySchema, req.query);
    res.json(await productService.list({ search: query.search, status: query.status as ProductStatus | undefined }));
  },
  async find(req: Request, res: Response) {
    res.json(await productService.find(req.params.id));
  },
  async create(req: Request, res: Response) {
    const data = validate(productSchema, req.body);
    res.status(201).json(await productService.create({
      ...data,
      description: data.description ?? "",
      unit: data.unit ?? "",
      status: data.status as ProductStatus,
    }));
  },
  async update(req: Request, res: Response) {
    const data = validate(productSchema, req.body);
    res.json(await productService.update(req.params.id, {
      ...data,
      description: data.description ?? "",
      unit: data.unit ?? "",
      status: data.status as ProductStatus,
    }));
  },
  async remove(req: Request, res: Response) {
    await productService.remove(req.params.id);
    res.status(204).send();
  },
};
