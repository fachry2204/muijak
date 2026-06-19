import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await pool.query('DELETE FROM mui_kota WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'MUI Kota berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting MUI Kota:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus MUI Kota' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const [kotaRows]: any = await pool.query('SELECT * FROM mui_kota WHERE id = ?', [id]);
    if (kotaRows.length === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    
    const [anggotaRows]: any = await pool.query('SELECT * FROM mui_kota_anggota WHERE mui_kota_id = ?', [id]);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        ...kotaRows[0],
        anggota: anggotaRows
      } 
    });
  } catch (error) {
    console.error('Error fetching MUI Kota details:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}
