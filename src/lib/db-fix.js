const mysql = require('mysql2/promise');

async function fix() {
  const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  await connection.query('DROP TABLE IF EXISTS komisi');
  await connection.query(`
    CREATE TABLE komisi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      head VARCHAR(255) NOT NULL,
      members_count INT DEFAULT 0,
      description TEXT,
      status VARCHAR(50) DEFAULT 'Aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await connection.query(`
    INSERT INTO komisi (name, head, members_count, description, status) VALUES 
    ('Komisi Fatwa', 'KH. Zae Nandang', 15, 'Bertugas membahas, mengkaji, dan menetapkan fatwa-fatwa keagamaan.', 'Aktif'),
    ('Komisi Dakwah & Pengembangan Masyarakat', 'Ust. Ahmad Zacky', 22, 'Mengatur pedoman dakwah dan menyebarkan syiar Islam di wilayah DKI.', 'Aktif'),
    ('Komisi Pendidikan & Kaderisasi', 'Dr. Hj. Siti Faizah', 18, 'Mengembangkan kurikulum pendidikan agama dan kaderisasi ulama.', 'Aktif')
  `);
  console.log('Komisi fixed');
  await connection.end();
}
fix();
