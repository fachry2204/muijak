const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  try {
    await pool.query('ALTER TABLE komisi_anggota ADD COLUMN sub_komisi_name VARCHAR(255) DEFAULT NULL');
    console.log('column added');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('column already exists');
    } else {
      console.error(e);
    }
  }
  process.exit(0);
}
run();
