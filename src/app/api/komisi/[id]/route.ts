import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const [komisiRows] = await pool.query<RowDataPacket[]>('SELECT * FROM komisi WHERE id = ?', [params.id]);
    if (komisiRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    
    const komisi = komisiRows[0];
    
    const [anggotaRows] = await pool.query<RowDataPacket[]>('SELECT * FROM komisi_anggota WHERE komisi_id = ?', [params.id]);
    
    return NextResponse.json({ success: true, data: { ...komisi, anggota: anggotaRows } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, members, subKomisi } = await request.json();
    let members_count = members ? members.length : 0;
    
    if (subKomisi && subKomisi.length > 0) {
      for (const sub of subKomisi) {
        if (sub.members) {
          members_count += sub.members.length;
        }
      }
    }
    
    await pool.query(
      'UPDATE komisi SET name = ?, members_count = ? WHERE id = ?',
      [name, members_count, params.id]
    );
    
    // Reset anggota
    await pool.query('DELETE FROM komisi_anggota WHERE komisi_id = ?', [params.id]);
    
    if (members && members.length > 0) {
      for (const member of members) {
        if (member.nama) {
          await pool.query(
            'INSERT INTO komisi_anggota (komisi_id, nama, jabatan, no_hp, sub_komisi_name) VALUES (?, ?, ?, ?, NULL)',
            [params.id, member.nama, member.jabatan || '', member.no_hp || '']
          );
        }
      }
    }

    if (subKomisi && subKomisi.length > 0) {
      for (const sub of subKomisi) {
        if (sub.name && sub.members && sub.members.length > 0) {
          for (const member of sub.members) {
            if (member.nama) {
              await pool.query(
                'INSERT INTO komisi_anggota (komisi_id, nama, jabatan, no_hp, sub_komisi_name) VALUES (?, ?, ?, ?, ?)',
                [params.id, member.nama, member.jabatan || '', member.no_hp || '', sub.name]
              );
            }
          }
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }

    await pool.query('DELETE FROM komisi WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
