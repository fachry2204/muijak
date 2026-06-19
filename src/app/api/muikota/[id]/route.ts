import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const connection = await pool.getConnection();
  try {
    const { id } = params;
    await connection.beginTransaction();
    await connection.query('DELETE FROM mui_kota_anggota WHERE mui_kota_id = ?', [id]);
    await connection.query('DELETE FROM mui_kota WHERE id = ?', [id]);
    await connection.commit();
    return NextResponse.json({ success: true, message: 'MUI Kota berhasil dihapus' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting MUI Kota:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus MUI Kota' }, { status: 500 });
  } finally {
    connection.release();
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const connection = await pool.getConnection();
  try {
    const { id } = params;
    await connection.beginTransaction();
    const { kota, alamat, no_telp, anggota, pimpinan, map_lat, map_lng } = await request.json();

    if (!kota) {
      return NextResponse.json({ success: false, error: 'Nama Kota wajib diisi' }, { status: 400 });
    }

    await connection.query(
      'UPDATE mui_kota SET kota = ?, alamat = ?, no_telp = ?, map_lat = ?, map_lng = ? WHERE id = ?',
      [kota, alamat || '', no_telp || '', map_lat || -6.200000, map_lng || 106.816666, id]
    );

    // Delete existing anggota
    await connection.query('DELETE FROM mui_kota_anggota WHERE mui_kota_id = ?', [id]);

    // Insert updated pimpinan
    if (pimpinan && Array.isArray(pimpinan) && pimpinan.length > 0) {
      for (const p of pimpinan) {
        await connection.query(
          'INSERT INTO mui_kota_anggota (mui_kota_id, nama, jabatan, bidang, no_hp, status) VALUES (?, ?, ?, ?, ?, ?)',
          [id, p.nama, p.jabatan || '', '', p.no_hp || '', 'Pimpinan']
        );
      }
    }

    // Insert updated anggota
    if (anggota && Array.isArray(anggota) && anggota.length > 0) {
      for (const agt of anggota) {
        await connection.query(
          'INSERT INTO mui_kota_anggota (mui_kota_id, nama, jabatan, bidang, no_hp, status) VALUES (?, ?, ?, ?, ?, ?)',
          [id, agt.nama, agt.jabatan || '', agt.bidang || '', agt.no_hp || '', 'Anggota']
        );
      }
    }

    await connection.commit();
    return NextResponse.json({ success: true, message: 'MUI Kota berhasil diupdate' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating MUI Kota:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengupdate MUI Kota' }, { status: 500 });
  } finally {
    connection.release();
  }
}
