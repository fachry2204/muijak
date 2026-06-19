const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_contents (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      section_key VARCHAR(255) UNIQUE NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  console.log('page_contents table created');
  process.exit(0);
}

run();
