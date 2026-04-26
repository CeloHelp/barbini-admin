import type { Request, Response } from "express";
import { validate } from "../lib/http.js";
import { quotationQuerySchema, quotationSchema } from "../schemas/quotationSchemas.js";
import { quotationService } from "../services/quotationService.js";
import type { QuotationStatus } from "../types/domain.js";

export const quotationController = {
  async list(req: Request, res: Response) {
    const query = validate(quotationQuerySchema, req.query);
    res.json(await quotationService.list({ ...query, status: query.status as QuotationStatus | undefined }));
  },
  async find(req: Request, res: Response) {
    res.json(await quotationService.find(req.params.id));
  },
  async create(req: Request, res: Response) {
    const data = validate(quotationSchema, req.body);
    res.status(201).json(await quotationService.create({
      ...data,
      status: data.status as QuotationStatus,
      discount: data.discount ?? 0,
      notes: data.notes ?? "",
    }));
  },
  async update(req: Request, res: Response) {
    const data = validate(quotationSchema, req.body);
    res.json(await quotationService.update(req.params.id, {
      ...data,
      status: data.status as QuotationStatus,
      discount: data.discount ?? 0,
      notes: data.notes ?? "",
    }));
  },
};
