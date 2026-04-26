import type { PoolClient } from "pg";
import { randomUUID } from "node:crypto";
import { pool } from "../lib/db.js";
import { mapClient } from "./clientRepository.js";
import type { QuotationItemRecord, QuotationRecord, QuotationStatus } from "../types/domain.js";

function mapItem(row: any): QuotationItemRecord {
  return {
    id: row.item_id,
    quotationId: row.quotation_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
  };
}

function mapQuotation(row: any, items: QuotationItemRecord[]): QuotationRecord {
  const client = mapClient({
    id: row.client_id,
    name: row.client_name,
    phone: row.client_phone,
    email: row.client_email,
    notes: row.client_notes,
    created_at: row.client_created_at,
    updated_at: row.client_updated_at,
  });

  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientName: row.client_name,
    date: row.date,
    status: row.status,
    discount: Number(row.discount),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    client,
    items,
  };
}

const detailSelect = `
  SELECT
    q.*,
    c.name AS client_name,
    c.phone AS client_phone,
    c.email AS client_email,
    c.notes AS client_notes,
    c.created_at AS client_created_at,
    c.updated_at AS client_updated_at,
    qi.id AS item_id,
    qi.quotation_id,
    qi.product_id,
    qi.product_name,
    qi.quantity,
    qi.unit_price
  FROM quotations q
  JOIN clients c ON c.id = q.client_id
  LEFT JOIN quotation_items qi ON qi.quotation_id = q.id
`;

function groupQuotations(rows: any[]) {
  const map = new Map<string, QuotationRecord>();
  for (const row of rows) {
    const current = map.get(row.id);
    if (current) {
      if (row.item_id) current.items.push(mapItem(row));
      continue;
    }
    map.set(row.id, mapQuotation(row, row.item_id ? [mapItem(row)] : []));
  }
  return [...map.values()];
}

export const quotationRepository = {
  async list(filters: { search?: string; date?: string; status?: QuotationStatus }) {
    const values: unknown[] = [];
    const clauses: string[] = [];
    if (filters.search) {
      values.push(`%${filters.search}%`);
      clauses.push(`(q.number ILIKE $${values.length} OR c.name ILIKE $${values.length})`);
    }
    if (filters.date) {
      values.push(filters.date);
      clauses.push(`q.date = $${values.length}`);
    }
    if (filters.status) {
      values.push(filters.status);
      clauses.push(`q.status = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await pool.query(`${detailSelect} ${where} ORDER BY q.date DESC, q.created_at DESC`, values);
    return groupQuotations(result.rows);
  },
  async find(id: string) {
    const result = await pool.query(`${detailSelect} WHERE q.id = $1 ORDER BY qi.id ASC`, [id]);
    return groupQuotations(result.rows)[0] ?? null;
  },
  async nextNumber(client: PoolClient) {
    const result = await client.query("SELECT COUNT(*)::int AS count FROM quotations");
    return `ORC-${String(Number(result.rows[0].count) + 1).padStart(3, "0")}`;
  },
  async create(
    client: PoolClient,
    data: {
      number: string;
      clientId: string;
      date: string;
      status: QuotationStatus;
      discount: number;
      notes: string;
      items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
    },
  ) {
    const id = randomUUID();
    await client.query(
      `INSERT INTO quotations (id, number, client_id, date, status, discount, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, data.number, data.clientId, data.date, data.status, data.discount, data.notes],
    );
    for (const item of data.items) {
      await client.query(
        `INSERT INTO quotation_items (id, quotation_id, product_id, product_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [randomUUID(), id, item.productId, item.productName, item.quantity, item.unitPrice],
      );
    }
    return this.find(id);
  },
  async update(
    client: PoolClient,
    id: string,
    data: {
      clientId: string;
      date: string;
      status: QuotationStatus;
      discount: number;
      notes: string;
      items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number }>;
    },
  ) {
    await client.query(
      `UPDATE quotations
       SET client_id = $2, date = $3, status = $4, discount = $5, notes = $6, updated_at = now()
       WHERE id = $1`,
      [id, data.clientId, data.date, data.status, data.discount, data.notes],
    );
    await client.query("DELETE FROM quotation_items WHERE quotation_id = $1", [id]);
    for (const item of data.items) {
      await client.query(
        `INSERT INTO quotation_items (id, quotation_id, product_id, product_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [randomUUID(), id, item.productId, item.productName, item.quantity, item.unitPrice],
      );
    }
    return this.find(id);
  },
};
