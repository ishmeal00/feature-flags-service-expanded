import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool({ connectionString: config.databaseUrl });

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export default pool;
