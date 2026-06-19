import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      'SELECT id, nama_lengkap, kota, pertanyaan, ulama_penjawab, jawaban, video_url, ulama_photo, created_at FROM pertanyaan_umat WHERE status = ? ORDER BY created_at DESC',
      ['Dijawab']
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching jawaban ulama:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}
