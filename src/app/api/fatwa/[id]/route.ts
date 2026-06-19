import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }

    const id = params.id;
    
    // Check if exists
    const [fatwa] = await pool.query<RowDataPacket[]>('SELECT id FROM fatwas WHERE id = ?', [id]);
    if (fatwa.length === 0) {
      return NextResponse.json({ success: false, error: 'Fatwa not found' }, { status: 404 });
    }

    await pool.query('DELETE FROM fatwas WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Fatwa deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting fatwa:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete fatwa' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const updates = [];
    const values = [];

    const allowedFields = ['title', 'no', 'date', 'type', 'size', 'status'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    await pool.query(`UPDATE fatwas SET ${updates.join(', ')} WHERE id = ?`, values);
    
    return NextResponse.json({ success: true, message: 'Fatwa updated successfully' });
  } catch (error: any) {
    console.error('Error updating fatwa:', error);
    return NextResponse.json({ success: false, error: 'Failed to update fatwa' }, { status: 500 });
  }
}
