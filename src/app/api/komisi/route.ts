import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM komisi ORDER BY id ASC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, head, members_count, description, status } = await request.json();
    const [result] = await pool.query<any>(
      'INSERT INTO komisi (name, head, members_count, description, status) VALUES (?, ?, ?, ?, ?)',
      [name, head, members_count || 0, description, status || 'Aktif']
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}
