import { query } from '../db';
import bcrypt from 'bcrypt';

export async function createUser(email: string, password: string, role = 'admin') {
  const hash = await bcrypt.hash(password, 10);
  const res = await query('INSERT INTO users(email, password_hash, role) VALUES($1,$2,$3) RETURNING *', [email, hash, role]);
  return res.rows[0];
}

export async function findUserByEmail(email: string) {
  const res = await query('SELECT * FROM users WHERE email=$1', [email]);
  return res.rows[0];
}

export async function verifyPassword(user: any, password: string) {
  return bcrypt.compare(password, user.password_hash);
}
