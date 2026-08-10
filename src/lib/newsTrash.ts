import { RowDataPacket } from 'mysql2';
import pool from '@/lib/db';

let schemaPromise: Promise<void> | null = null;

async function migrateNewsTrashSchema() {
  const [statusColumns] = await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM news LIKE 'status'");
  if (!statusColumns.length) throw new Error('Kolom status pada tabel news tidak ditemukan.');

  const statusType = String(statusColumns[0].Type || '').toUpperCase();
  if (!statusType.includes("'TRASHED'")) {
    await pool.query(
      "ALTER TABLE news MODIFY COLUMN status ENUM('DRAFT','PUBLISHED','TRASHED') NOT NULL DEFAULT 'DRAFT'"
    );
  }

  const [deletedAtColumns] = await pool.query<RowDataPacket[]>("SHOW COLUMNS FROM news LIKE 'deleted_at'");
  if (!deletedAtColumns.length) {
    await pool.query('ALTER TABLE news ADD COLUMN deleted_at DATETIME NULL AFTER published_at');
  }

  const [indexes] = await pool.query<RowDataPacket[]>(
    "SHOW INDEX FROM news WHERE Key_name = 'idx_news_trash_expiry'"
  );
  if (!indexes.length) {
    await pool.query('CREATE INDEX idx_news_trash_expiry ON news (status, deleted_at)');
  }
}

export async function ensureNewsTrashSchema() {
  if (!schemaPromise) {
    schemaPromise = migrateNewsTrashSchema().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}
