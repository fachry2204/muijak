const mysql = require('mysql2/promise');

async function init() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mui'
    });

    console.log('Connected to MySQL...');

    await connection.query('DROP TABLE IF EXISTS permissions');
    await connection.query(`
      CREATE TABLE permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module VARCHAR(255) NOT NULL UNIQUE,
        admin_access BOOLEAN DEFAULT TRUE,
        editor_access BOOLEAN DEFAULT FALSE,
        user_access BOOLEAN DEFAULT FALSE
      )
    `);

    // Insert default modules
    const modules = [
      { module: "Dashboard Analytics", admin: true, editor: true, user: true },
      { module: "Manajemen Berita", admin: true, editor: true, user: false },
      { module: "Kategori Berita", admin: true, editor: true, user: false },
      { module: "Profil & Organisasi", admin: true, editor: false, user: false },
      { module: "Manajemen Komisi", admin: true, editor: false, user: false },
      { module: "Manajemen Fatwa", admin: true, editor: true, user: false },
      { module: "Menu Builder", admin: true, editor: false, user: false },
      { module: "Data User Admin", admin: true, editor: false, user: false },
      { module: "Pengaturan Sistem", admin: true, editor: false, user: false },
    ];

    for (const m of modules) {
      await connection.query(
        'INSERT INTO permissions (module, admin_access, editor_access, user_access) VALUES (?, ?, ?, ?)',
        [m.module, m.admin, m.editor, m.user]
      );
    }

    console.log('Permissions table ready and seeded.');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

init();
