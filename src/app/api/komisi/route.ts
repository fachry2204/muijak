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
    const { name, head, description, status, members, subKomisi } = await request.json();
    let members_count = members ? members.length : 0;
    
    if (subKomisi && subKomisi.length > 0) {
      for (const sub of subKomisi) {
        if (sub.members) {
          members_count += sub.members.length;
        }
      }
    }
    
    const [result] = await pool.query<any>(
      'INSERT INTO komisi (name, head, members_count, description, status) VALUES (?, ?, ?, ?, ?)',
      [name, head || '', members_count, description, status || 'Aktif']
    );
    
    const komisiId = result.insertId;
    
    if (members && members.length > 0) {
      for (const member of members) {
        if (member.nama) {
          await pool.query(
            'INSERT INTO komisi_anggota (komisi_id, nama, jabatan, no_hp, sub_komisi_name) VALUES (?, ?, ?, ?, NULL)',
            [komisiId, member.nama, member.jabatan || '', member.no_hp || '']
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
                [komisiId, member.nama, member.jabatan || '', member.no_hp || '', sub.name]
              );
            }
          }
        }
      }
    }
    
    return NextResponse.json({ success: true, id: komisiId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}
