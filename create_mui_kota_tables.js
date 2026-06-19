const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mui_kota (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      kota VARCHAR(255), 
      alamat TEXT, 
      no_telp VARCHAR(50), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mui_kota_anggota (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      mui_kota_id INT, 
      nama VARCHAR(255), 
      jabatan VARCHAR(255), 
      bidang VARCHAR(255), 
      status ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif', 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
      FOREIGN KEY (mui_kota_id) REFERENCES mui_kota(id) ON DELETE CASCADE
    )
  `);
  
  console.log('Tables created');
  process.exit(0);
}

run();
