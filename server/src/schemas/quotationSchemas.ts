import { z } from "zod";

export const quotationStatusSchema = z.enum(["pendente", "aprovado", "recusado", "concluido"]);

export const quotationItemSchema = z.object({
  productId: z.string().min(1, "Produto obrigatorio"),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero"),
  unitPrice: z.coerce.number().nonnegative("Preco unitario invalido"),
});

export const quotationSchema = z.object({
  clientId: z.string().min(1, "Cliente obrigatorio"),
  date: z.string().min(1, "Data obrigatoria"),
  status: quotationStatusSchema.default("pendente"),
  discount: z.coerce.number().nonnegative("Desconto invalido").default(0),
  notes: z.string().default(""),
  items: z.array(quotationItemSchema).min(1, "Inclua ao menos um item"),
});

export const quotationQuerySchema = z.object({
  search: z.string().optional(),
  date: z.string().optional(),
  status: quotationStatusSchema.optional(),
});
