const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  const [tables] = await pool.query('SHOW TABLES');
  console.log(tables);
  const [cols] = await pool.query('SHOW COLUMNS FROM komisi');
  console.log(cols);
  process.exit(0);
}

run();
