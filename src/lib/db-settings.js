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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default settings
    const defaultSettings = [
      { key: 'site_name', value: 'MUI DKI Jakarta' },
      { key: 'maintenance_mode', value: '0' },
      { key: 'address', value: 'Gedung MUI DKI Jakarta, Jl. Jami Al-Makmur No.1, RT.1/RW.4, Cikini, Kec. Menteng, Kota Jakarta Pusat' },
      { key: 'maps_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.529806497262!2d106.83610991535496!3d-6.193600995516086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4305bc9e273%3A0xc367d3b24bb8d4cc!2sKantor%20MUI%20DKI%20Jakarta!5e0!3m2!1sen!2sid!4v1689254011234!5m2!1sen!2sid' },
      { key: 'social_facebook', value: 'https://facebook.com/muidkijakarta' },
      { key: 'social_twitter', value: 'https://twitter.com/muidkijakarta' },
      { key: 'social_instagram', value: 'https://instagram.com/muidkijakarta' },
      { key: 'social_youtube', value: 'https://youtube.com/muidkijakarta' },
      { key: 'security_login_attempts', value: '5' },
      { key: 'security_session_timeout', value: '120' },
      { key: 'security_2fa', value: '0' }
    ];

    for (const setting of defaultSettings) {
      await connection.query(
        'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)',
        [setting.key, setting.value]
      );
    }

    console.log('Settings table ready and seeded.');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

init();
