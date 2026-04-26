import type { Request, Response } from "express";
import { validate } from "../lib/http.js";
import { loginSchema } from "../schemas/authSchemas.js";
import { authService } from "../services/authService.js";

export const authController = {
  async login(req: Request, res: Response) {
    const data = validate(loginSchema, req.body);
    res.json(await authService.login(data.email, data.password));
  },
  async me(req: Request, res: Response) {
    res.json({ user: req.user });
  },
};
