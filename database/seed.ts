import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { pool } from "../server/src/lib/db.js";

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await pool.query(
    `INSERT INTO users (id, name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, updated_at = now()`,
    [randomUUID(), "Administrador", "admin@barbini.com", passwordHash],
  );

  const clients = [
    ["c1", "Roberto Almeida", "(11) 98765-4321", "roberto@email.com", "Cliente preferencial desde 2022"],
    ["c2", "Fernanda Costa", "(21) 99123-4567", "fernanda.costa@gmail.com", ""],
    ["c3", "Marcos Vieira", "(31) 97654-3210", "marcos.vieira@empresa.com", "Pagamento sempre em boleto"],
    ["c4", "Juliana Mendes", "(41) 98877-6655", "juliana@negocio.com.br", "Prefere contato por WhatsApp"],
    ["c5", "Carlos Eduardo Santos", "(51) 99234-5678", "carlos.santos@construtora.com", "Grande volume de pedidos mensais"],
  ];

  for (const client of clients) {
    await pool.query(
      `INSERT INTO clients (id, name, phone, email, notes)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email, notes = EXCLUDED.notes, updated_at = now()`,
      client,
    );
  }

  const products = [
    ["p1", "Servico de Pintura Residencial", "Pintura completa de ambientes internos com tinta premium", 850, "m2", "ativo"],
    ["p2", "Instalacao Eletrica", "Instalacao e manutencao de circuitos eletricos residenciais", 1200, "ponto", "ativo"],
    ["p3", "Reforma de Banheiro", "Reforma completa incluindo azulejos, box e metais", 4500, "un", "ativo"],
    ["p4", "Impermeabilizacao", "Impermeabilizacao de lajes e terracos", 320, "m2", "inativo"],
    ["p5", "Gesso e Drywall", "Instalacao de forros e divisorias em gesso e drywall", 180, "m2", "ativo"],
  ];

  for (const product of products) {
    await pool.query(
      `INSERT INTO products (id, name, description, price, unit, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, unit = EXCLUDED.unit, status = EXCLUDED.status, updated_at = now()`,
      product,
    );
  }

  const quotationCount = Number((await pool.query("SELECT COUNT(*) FROM quotations")).rows[0].count);
  if (quotationCount > 0) return;

  const quotations = [
    {
      id: "q1",
      number: "ORC-001",
      clientId: "c1",
      date: "2024-06-01",
      status: "aprovado",
      discount: 500,
      notes: "Urgente, prazo de 30 dias",
      items: [
        ["p1", "Servico de Pintura Residencial", 80, 850],
        ["p5", "Gesso e Drywall", 30, 180],
      ],
    },
    {
      id: "q2",
      number: "ORC-002",
      clientId: "c2",
      date: "2024-06-10",
      status: "pendente",
      discount: 0,
      notes: "",
      items: [["p3", "Reforma de Banheiro", 2, 4500]],
    },
    {
      id: "q3",
      number: "ORC-003",
      clientId: "c3",
      date: "2024-06-15",
      status: "concluido",
      discount: 1000,
      notes: "Desconto especial negociado",
      items: [
        ["p2", "Instalacao Eletrica", 15, 1200],
        ["p1", "Servico de Pintura Residencial", 50, 850],
      ],
    },
  ];

  for (const quotation of quotations) {
    await pool.query(
      `INSERT INTO quotations (id, number, client_id, date, status, discount, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [quotation.id, quotation.number, quotation.clientId, quotation.date, quotation.status, quotation.discount, quotation.notes],
    );

    for (const [productId, productName, quantity, unitPrice] of quotation.items) {
      await pool.query(
        `INSERT INTO quotation_items (id, quotation_id, product_id, product_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [randomUUID(), quotation.id, productId, productName, quantity, unitPrice],
      );
    }
  }
}

main()
  .then(async () => pool.end())
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
