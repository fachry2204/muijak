const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pertanyaan_umat (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      nama_lengkap VARCHAR(255),
      no_hp VARCHAR(50),
      email VARCHAR(255),
      provinsi VARCHAR(100),
      kota VARCHAR(100),
      pertanyaan TEXT,
      status ENUM('Menunggu', 'Dijawab', 'Ditolak') DEFAULT 'Menunggu',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('pertanyaan_umat table created');
  process.exit(0);
}

run();
