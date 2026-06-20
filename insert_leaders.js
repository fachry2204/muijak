const mysql = require('mysql2/promise');

async function insert() {
  const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });
  await pool.query(`INSERT INTO leaders (name, position_id, image_url, order_index) VALUES 
    ('KH. Anwar Iskandar', 'Ketua Umum', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop', 1), 
    ('Buya Amirsyah Tambunan', 'Sekretaris Umum', 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop', 2), 
    ('KH. Marsudi Syuhud', 'Wakil Ketua Umum', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop', 3)`
  );
  console.log("Done");
  process.exit(0);
}
insert();
