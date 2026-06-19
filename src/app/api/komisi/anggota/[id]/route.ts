import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama, jabatan, no_hp } = body;

    if (!nama) {
      return NextResponse.json({ success: false, error: 'Nama wajib diisi' }, { status: 400 });
    }

    await pool.query(
      'UPDATE komisi_anggota SET nama = ?, jabatan = ?, no_hp = ? WHERE id = ?',
      [nama, jabatan || '', no_hp || '', id]
    );

    return NextResponse.json({ success: true, message: 'Anggota komisi berhasil diupdate' });
  } catch (error) {
    console.error('Error updating anggota komisi:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengupdate anggota komisi' }, { status: 500 });
  }
}
