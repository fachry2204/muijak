import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    // Generate UUID logic (if mysql version doesn't support UUID(), we can use random UUID)
    // Create Default Admin User
    const name = 'Super Admin';
    const email = 'admin@muijakarta.or.id';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'ADMIN';
    const status = 'APPROVED';

    // Check if admin already exists
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return NextResponse.json({ message: 'Admin user already exists.' });
    }

    await pool.query(
      `INSERT INTO users (id, name, email, password, role, status) VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, status]
    );

    // Seed Categories
    const categories = [
      { id: 'Nasional', en: 'National', ar: 'وطني', slug: 'nasional' },
      { id: 'Daerah', en: 'Regional', ar: 'إقليمي', slug: 'daerah' },
      { id: 'Fatwa', en: 'Fatwa', ar: 'فتوى', slug: 'fatwa' },
      { id: 'Halal', en: 'Halal', ar: 'حلال', slug: 'halal' },
      { id: 'Pendidikan', en: 'Education', ar: 'تعليم', slug: 'pendidikan' },
      { id: 'Kegiatan', en: 'Activities', ar: 'أنشطة', slug: 'kegiatan' }
    ];

    for (const cat of categories) {
      await pool.query(
        `INSERT IGNORE INTO categories (name_id, name_en, name_ar, slug) VALUES (?, ?, ?, ?)`,
        [cat.id, cat.en, cat.ar, cat.slug]
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database seed completed. Admin user and categories created.',
      credentials: {
        email: email,
        password: password
      }
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
