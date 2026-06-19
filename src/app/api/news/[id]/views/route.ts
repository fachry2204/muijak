import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('UPDATE news SET views = COALESCE(views, 0) + 1 WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating views:', error);
    return NextResponse.json({ success: false, error: 'Failed to update views' }, { status: 500 });
  }
}
