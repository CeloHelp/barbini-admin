import { pool } from "../lib/db.js";
import type { UserRecord } from "../types/domain.js";

function mapUser(row: any): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
  };
}

export const userRepository = {
  async findByEmail(email: string) {
    const result = await pool.query("SELECT id, name, email, password_hash FROM users WHERE email = $1", [email]);
    return result.rows[0] ? mapUser(result.rows[0]) : null;
  },
};
