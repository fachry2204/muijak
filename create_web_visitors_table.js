const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS web_visitors (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      ip_address VARCHAR(45),
      user_agent TEXT,
      path VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('web_visitors table created');
  process.exit(0);
}

run();
