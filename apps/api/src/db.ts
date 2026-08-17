// Thin Postgres pool wrapper. One shared pool for the process.
import pg from 'pg';
import { config } from './config.js';

export const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

// Ensure timestamps are handled in IST at the app layer where needed.
export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

// Small helper for single-row queries.
export async function queryOne<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const res = await pool.query<T>(text, params);
  return res.rows[0] ?? null;
}

/**
 * Run `fn` inside a single Postgres transaction. Use whenever a change spans
 * more than one table and must either fully apply or not at all — e.g. the
 * pay-first checkout auto-provisioning (business + user + subscription rows
 * created together). A dedicated client is checked out for the duration so
 * BEGIN/COMMIT/ROLLBACK all land on the same connection.
 */
export async function withTransaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
