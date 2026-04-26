import type { Request, Response } from "express";
import { validate } from "../lib/http.js";
import { clientQuerySchema, clientSchema } from "../schemas/clientSchemas.js";
import { clientService } from "../services/clientService.js";

export const clientController = {
  async list(req: Request, res: Response) {
    const query = validate(clientQuerySchema, req.query);
    res.json(await clientService.list(query.search));
  },
  async find(req: Request, res: Response) {
    res.json(await clientService.find(req.params.id));
  },
  async create(req: Request, res: Response) {
    const data = validate(clientSchema, req.body);
    res.status(201).json(await clientService.create({ ...data, notes: data.notes ?? "" }));
  },
  async update(req: Request, res: Response) {
    const data = validate(clientSchema, req.body);
    res.json(await clientService.update(req.params.id, { ...data, notes: data.notes ?? "" }));
  },
  async remove(req: Request, res: Response) {
    await clientService.remove(req.params.id);
    res.status(204).send();
  },
};
