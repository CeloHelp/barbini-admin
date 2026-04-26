import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  description: z.string().default(""),
  price: z.coerce.number().positive("Preco deve ser maior que zero"),
  unit: z.string().default(""),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["ativo", "inativo"]).optional(),
});
