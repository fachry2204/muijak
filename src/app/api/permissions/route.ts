import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM permissions ORDER BY id ASC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const permissions = await request.json(); // Array of permissions objects
    
    // Process each permission update
    for (const p of permissions) {
      await pool.query(
        'UPDATE permissions SET admin_access = ?, editor_access = ?, user_access = ? WHERE id = ?',
        [p.admin_access ? 1 : 0, p.editor_access ? 1 : 0, p.user_access ? 1 : 0, p.id]
      );
    }

    return NextResponse.json({ success: true, message: 'Permissions saved successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update permissions' }, { status: 500 });
  }
}
