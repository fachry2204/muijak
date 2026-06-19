const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS komisi_anggota (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      komisi_id INT NOT NULL,
      nama VARCHAR(255) NOT NULL,
      jabatan VARCHAR(255) NOT NULL,
      no_hp VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (komisi_id) REFERENCES komisi(id) ON DELETE CASCADE
    )
  `);
  console.log('komisi_anggota table created');
  process.exit(0);
}
run();
