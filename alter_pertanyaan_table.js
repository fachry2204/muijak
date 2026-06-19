const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  
  try {
    await pool.query('ALTER TABLE pertanyaan_umat ADD COLUMN ulama_penjawab VARCHAR(255) NULL AFTER pertanyaan');
    await pool.query('ALTER TABLE pertanyaan_umat ADD COLUMN jawaban TEXT NULL AFTER ulama_penjawab');
    await pool.query('ALTER TABLE pertanyaan_umat ADD COLUMN video_url VARCHAR(255) NULL AFTER jawaban');
    console.log('Columns added successfully');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist');
    } else {
      console.error(error);
    }
  }
  
  process.exit(0);
}

run();
