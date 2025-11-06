import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!pool && process.env.DATABASE_URL && typeof window === 'undefined') {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
