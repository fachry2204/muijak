import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM mui_kota ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching MUI Kota:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch MUI Kota' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { kota, alamat, no_telp, anggota, pimpinan, map_lat, map_lng } = await request.json();

    if (!kota) {
      return NextResponse.json({ success: false, error: 'Nama Kota wajib diisi' }, { status: 400 });
    }

    const [result]: any = await connection.query(
      'INSERT INTO mui_kota (kota, alamat, no_telp, map_lat, map_lng) VALUES (?, ?, ?, ?, ?)',
      [kota, alamat || '', no_telp || '', map_lat || -6.200000, map_lng || 106.816666]
    );

    const muiKotaId = result.insertId;

    if (pimpinan && Array.isArray(pimpinan) && pimpinan.length > 0) {
      for (const p of pimpinan) {
        await connection.query(
          'INSERT INTO mui_kota_anggota (mui_kota_id, nama, jabatan, bidang, no_hp, status) VALUES (?, ?, ?, ?, ?, ?)',
          [muiKotaId, p.nama, p.jabatan || '', '', p.no_hp || '', 'Pimpinan']
        );
      }
    }

    if (anggota && Array.isArray(anggota) && anggota.length > 0) {
      for (const agt of anggota) {
        await connection.query(
          'INSERT INTO mui_kota_anggota (mui_kota_id, nama, jabatan, bidang, no_hp, status) VALUES (?, ?, ?, ?, ?, ?)',
          [muiKotaId, agt.nama, agt.jabatan || '', agt.bidang || '', agt.no_hp || '', 'Anggota']
        );
      }
    }

    await connection.commit();
    return NextResponse.json({ success: true, message: 'MUI Kota berhasil ditambahkan' });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating MUI Kota:', error);
    return NextResponse.json({ success: false, error: 'Gagal menambahkan MUI Kota' }, { status: 500 });
  } finally {
    connection.release();
  }
}
