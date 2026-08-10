require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mui_jakarta',
    port: Number(process.env.DB_PORT || 3306),
  });

  const [statusColumns] = await connection.query("SHOW COLUMNS FROM news LIKE 'status'");
  if (!String(statusColumns[0]?.Type || '').toUpperCase().includes("'TRASHED'")) {
    await connection.query("ALTER TABLE news MODIFY COLUMN status ENUM('DRAFT','PUBLISHED','TRASHED') NOT NULL DEFAULT 'DRAFT'");
  }

  const [columns] = await connection.query("SHOW COLUMNS FROM news LIKE 'deleted_at'");
  if (columns.length === 0) {
    await connection.query('ALTER TABLE news ADD COLUMN deleted_at DATETIME NULL AFTER published_at');
  }

  await connection.query("UPDATE news SET deleted_at = NOW() WHERE status = 'TRASHED' AND deleted_at IS NULL");

  const [indexes] = await connection.query("SHOW INDEX FROM news WHERE Key_name = 'idx_news_trash_expiry'");
  if (indexes.length === 0) {
    await connection.query('CREATE INDEX idx_news_trash_expiry ON news (status, deleted_at)');
  }

  const [trashRows] = await connection.query(
    "SELECT COUNT(*) AS total, SUM(deleted_at IS NULL) AS without_deleted_at FROM news WHERE status = 'TRASHED'"
  );

  await connection.end();
  console.log('Migrasi retensi tong sampah berita berhasil.', trashRows[0]);
}

migrate().catch((error) => {
  console.error('Migrasi gagal:', error);
  process.exit(1);
});
