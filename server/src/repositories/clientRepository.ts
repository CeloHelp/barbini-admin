import { randomUUID } from "node:crypto";
import { pool } from "../lib/db.js";
import type { ClientRecord } from "../types/domain.js";

export function mapClient(row: any): ClientRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const clientRepository = {
  async list(search?: string) {
    const values: unknown[] = [];
    let where = "";
    if (search) {
      values.push(`%${search}%`);
      where = "WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1";
    }
    const result = await pool.query(`SELECT * FROM clients ${where} ORDER BY created_at DESC`, values);
    return result.rows.map(mapClient);
  },
  async find(id: string) {
    const result = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
    return result.rows[0] ? mapClient(result.rows[0]) : null;
  },
  async create(data: { name: string; phone: string; email: string; notes: string }) {
    const result = await pool.query(
      `INSERT INTO clients (id, name, phone, email, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [randomUUID(), data.name, data.phone, data.email, data.notes],
    );
    return mapClient(result.rows[0]);
  },
  async update(id: string, data: { name: string; phone: string; email: string; notes: string }) {
    const result = await pool.query(
      `UPDATE clients
       SET name = $2, phone = $3, email = $4, notes = $5, updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [id, data.name, data.phone, data.email, data.notes],
    );
    return mapClient(result.rows[0]);
  },
  async remove(id: string) {
    await pool.query("DELETE FROM clients WHERE id = $1", [id]);
  },
};
