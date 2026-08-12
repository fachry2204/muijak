import pool from '@/lib/db';

/**
 * Keep gallery storage compatible with installations created from older schemas.
 * A foreign key is intentionally not created at request time: MySQL rejects it
 * when the parent UUID column has a different collation/type on legacy servers.
 */
let tableReady: Promise<void> | null = null;

export async function ensureNewsGalleryTable() {
  if (tableReady) return tableReady;

  tableReady = pool.query(`
    CREATE TABLE IF NOT EXISTS news_gallery (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      news_id CHAR(36) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_news_gallery_news_id (news_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `).then(() => undefined).catch((error) => {
    tableReady = null;
    throw error;
  });

  return tableReady;
}
