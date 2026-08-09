import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can delete.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // Check if user exists and is not the last admin
    const [user] = await pool.query<RowDataPacket[]>('SELECT role FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user[0].role === 'ADMIN') {
      const [admins] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE role = "ADMIN"');
      if (admins.length <= 1) {
         return NextResponse.json({ success: false, error: 'Cannot delete the last admin user' }, { status: 400 });
      }
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    // For simplicity, we just handle toggling status or updating role/name here
    const updates = [];
    const values = [];

    const statusMap: Record<string, string> = {
      APPROVED: 'APPROVED', Aktif: 'APPROVED', PENDING: 'PENDING',
      REJECTED: 'REJECTED', 'Non-Aktif': 'REJECTED'
    };
    const roleMap: Record<string, string> = {
      ADMIN: 'ADMIN', STAFF: 'STAFF', EDITOR: 'STAFF', ANGGOTA: 'ANGGOTA', USER: 'ANGGOTA'
    };

    if (body.status !== undefined && statusMap[body.status]) {
      updates.push('status = ?');
      values.push(statusMap[body.status]);
    }
    if (body.role !== undefined && roleMap[body.role]) {
      updates.push('role = ?');
      values.push(roleMap[body.role]);
    }
    if (body.name !== undefined) {
      updates.push('name = ?');
      values.push(body.name);
    }
    if (body.password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(body.password, 10));
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    
    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}
