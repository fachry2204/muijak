require('dotenv').config();
const mysql = require('mysql2/promise');

const STOP_WORDS = new Set([
  'yang', 'dan', 'dari', 'untuk', 'dengan', 'dalam', 'pada', 'adalah', 'atau',
  'ini', 'itu', 'ke', 'di', 'oleh', 'sebagai', 'akan', 'telah', 'para', 'serta',
  'the', 'and', 'for', 'with', 'from', 'this', 'that'
]);

function plainText(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function descriptionFrom(content, title) {
  const text = plainText(content) || title || 'Berita dan informasi terkini MUI Jakarta';
  return text.length > 160 ? `${text.slice(0, 159).trimEnd()}…` : text;
}

function keywordsFrom(title, content) {
  const source = `${title || ''} ${plainText(content).slice(0, 500)}`.toLowerCase();
  const words = source.match(/[a-z0-9À-ÿ\u00C0-\u024F]{4,}/g) || [];
  const frequencies = new Map();

  for (const word of words) {
    if (!STOP_WORDS.has(word)) frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }

  const selected = [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return [...new Set(['MUI Jakarta', 'Majelis Ulama Indonesia', 'Berita MUI', ...selected])].join(', ');
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mui_jakarta',
    port: Number(process.env.DB_PORT || 3306),
  });

  const seoColumns = [
    ['meta_title', 'VARCHAR(255) NULL'],
    ['meta_desc', 'TEXT NULL'],
    ['meta_keywords', 'TEXT NULL'],
  ];

  for (const [column, definition] of seoColumns) {
    const [rows] = await connection.query(`SHOW COLUMNS FROM news LIKE '${column}'`);
    if (rows.length === 0) {
      await connection.query(`ALTER TABLE news ADD COLUMN ${column} ${definition}`);
    }
  }

  const [newsRows] = await connection.query(
    'SELECT id, title_id, content_id, meta_title, meta_desc, meta_keywords FROM news'
  );

  let updated = 0;
  for (const news of newsRows) {
    const metaTitle = news.meta_title?.trim() || news.title_id?.trim() || 'Berita MUI Jakarta';
    const metaDesc = news.meta_desc?.trim() || descriptionFrom(news.content_id, news.title_id);
    const metaKeywords = news.meta_keywords?.trim() || keywordsFrom(news.title_id, news.content_id);

    if (!news.meta_title?.trim() || !news.meta_desc?.trim() || !news.meta_keywords?.trim()) {
      await connection.query(
        'UPDATE news SET meta_title = ?, meta_desc = ?, meta_keywords = ? WHERE id = ?',
        [metaTitle, metaDesc, metaKeywords, news.id]
      );
      updated++;
    }
  }

  await connection.end();
  console.log(`Migrasi SEO berhasil. ${updated} berita lama diperbarui dari total ${newsRows.length} berita.`);
}

migrate().catch((error) => {
  console.error('Migrasi SEO gagal:', error);
  process.exit(1);
});
