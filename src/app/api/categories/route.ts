import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories ORDER BY name_id ASC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('API Categories GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name_id, slug, description, status } = await request.json();
    const [result] = await pool.query<any>(
      'INSERT INTO categories (name_id, slug) VALUES (?, ?)',
      [name_id, slug]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('API Categories POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
