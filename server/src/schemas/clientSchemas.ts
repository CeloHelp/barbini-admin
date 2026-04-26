import { z } from "zod";

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export const clientSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  phone: z
    .string()
    .min(1, "Telefone obrigatorio")
    .refine((value) => {
      const digits = phoneDigits(value);
      return digits.length === 10 || digits.length === 11;
    }, "Informe DDD + telefone com 10 ou 11 digitos"),
  email: z.string().email("E-mail invalido"),
  notes: z.string().default(""),
});

export const clientQuerySchema = z.object({
  search: z.string().optional(),
});
