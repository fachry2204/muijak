import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'mui' });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (key) {
      const [rows] = await pool.query('SELECT * FROM page_contents WHERE section_key = ?', [key]);
      return NextResponse.json({ success: true, data: (rows as any)[0] });
    }
    
    const [rows] = await pool.query('SELECT * FROM page_contents');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { section_key, content } = await request.json();
    
    if (!section_key || content === undefined) {
      return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
    }

    // Upsert logic (Insert or Update if exists)
    await pool.query(`
      INSERT INTO page_contents (section_key, content) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE content = ?
    `, [section_key, content, content]);

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
