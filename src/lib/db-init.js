const mysql = require('mysql2/promise');

async function init() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mui'
    });

    console.log('Connected to MySQL...');

    // 1. Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        post_count INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create news table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT,
        category VARCHAR(100),
        author VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Draft',
        views INT DEFAULT 0,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Create komisi table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS komisi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        head VARCHAR(255) NOT NULL,
        members_count INT DEFAULT 0,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed Categories
    const [catRows] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (catRows[0].count === 0) {
      await connection.query(`
        INSERT INTO categories (name, slug, description, post_count, status) VALUES 
        ('Fatwa & Hukum', 'fatwa-hukum', 'Berita seputar putusan fatwa dan hukum Islam.', 45, 'Aktif'),
        ('Kegiatan MUI', 'kegiatan-mui', 'Liputan acara dan agenda kegiatan MUI DKI.', 128, 'Aktif'),
        ('Opini Ulama', 'opini-ulama', 'Tulisan dan opini dari para tokoh dan ulama.', 32, 'Aktif')
      `);
      console.log('Seeded categories.');
    }

    // Seed News
    const [newsRows] = await connection.query('SELECT COUNT(*) as count FROM news');
    if (newsRows[0].count === 0) {
      await connection.query(`
        INSERT INTO news (title, slug, category, author, status, views) VALUES 
        ('MUI DKI Jakarta Gelar Rapat Koordinasi Wilayah 2024', 'mui-dki-rakorwil-2024', 'Kegiatan MUI', 'Admin Pusat', 'Published', 1250),
        ('Panduan Pembayaran Zakat Fitrah Tahun Ini', 'panduan-zakat-fitrah', 'Fatwa & Hukum', 'Komisi Fatwa', 'Published', 8420),
        ('Menyikapi Isu Sosial Terkini: Pesan Ketua Umum MUI DKI', 'menyikapi-isu-sosial-ketum-mui', 'Opini Ulama', 'KH. Munahar Muchtar', 'Draft', 0)
      `);
      console.log('Seeded news.');
    }

    // Seed Komisi
    const [komisiRows] = await connection.query('SELECT COUNT(*) as count FROM komisi');
    if (komisiRows[0].count === 0) {
      await connection.query(`
        INSERT INTO komisi (name, head, members_count, description, status) VALUES 
        ('Komisi Fatwa', 'KH. Zae Nandang', 15, 'Bertugas membahas, mengkaji, dan menetapkan fatwa-fatwa keagamaan.', 'Aktif'),
        ('Komisi Dakwah & Pengembangan Masyarakat', 'Ust. Ahmad Zacky', 22, 'Mengatur pedoman dakwah dan menyebarkan syiar Islam di wilayah DKI.', 'Aktif'),
        ('Komisi Pendidikan & Kaderisasi', 'Dr. Hj. Siti Faizah', 18, 'Mengembangkan kurikulum pendidikan agama dan kaderisasi ulama.', 'Aktif')
      `);
      console.log('Seeded komisi.');
    }

    console.log('All tables created and seeded.');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

init();
