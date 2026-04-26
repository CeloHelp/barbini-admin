import { randomUUID } from "node:crypto";
import { pool } from "../lib/db.js";
import type { ProductRecord, ProductStatus } from "../types/domain.js";

export function mapProduct(row: any): ProductRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    unit: row.unit,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const productRepository = {
  async list(filters: { search?: string; status?: ProductStatus }) {
    const values: unknown[] = [];
    const clauses: string[] = [];
    if (filters.search) {
      values.push(`%${filters.search}%`);
      clauses.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }
    if (filters.status) {
      values.push(filters.status);
      clauses.push(`status = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await pool.query(`SELECT * FROM products ${where} ORDER BY created_at DESC`, values);
    return result.rows.map(mapProduct);
  },
  async find(id: string) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0] ? mapProduct(result.rows[0]) : null;
  },
  async create(data: { name: string; description: string; price: number; unit: string; status: ProductStatus }) {
    const result = await pool.query(
      `INSERT INTO products (id, name, description, price, unit, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [randomUUID(), data.name, data.description, data.price, data.unit, data.status],
    );
    return mapProduct(result.rows[0]);
  },
  async update(id: string, data: { name: string; description: string; price: number; unit: string; status: ProductStatus }) {
    const result = await pool.query(
      `UPDATE products
       SET name = $2, description = $3, price = $4, unit = $5, status = $6, updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, data.name, data.description, data.price, data.unit, data.status],
    );
    return mapProduct(result.rows[0]);
  },
  async remove(id: string) {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
  },
};
