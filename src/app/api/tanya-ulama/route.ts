import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { nama_lengkap, no_hp, email, provinsi, kota, pertanyaan } = await request.json();

    if (!nama_lengkap || !pertanyaan) {
      return NextResponse.json({ success: false, error: 'Nama dan pertanyaan wajib diisi' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO pertanyaan_umat (nama_lengkap, no_hp, email, provinsi, kota, pertanyaan) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_lengkap, no_hp || '', email || '', provinsi || '', kota || '', pertanyaan]
    );

    return NextResponse.json({ success: true, message: 'Pertanyaan berhasil dikirim' });
  } catch (error) {
    console.error('Error submitting pertanyaan:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengirim pertanyaan' }, { status: 500 });
  }
}
