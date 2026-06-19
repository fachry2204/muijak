import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama, jabatan, bidang, no_hp } = body;

    if (!nama) {
      return NextResponse.json({ success: false, error: 'Nama wajib diisi' }, { status: 400 });
    }

    await pool.query(
      'UPDATE mui_kota_anggota SET nama = ?, jabatan = ?, bidang = ?, no_hp = ? WHERE id = ?',
      [nama, jabatan || '', bidang || '', no_hp || '', id]
    );

    return NextResponse.json({ success: true, message: 'Anggota berhasil diupdate' });
  } catch (error) {
    console.error('Error updating anggota:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengupdate anggota' }, { status: 500 });
  }
}
