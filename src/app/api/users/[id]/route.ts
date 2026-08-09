import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

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
    const [targetUsers] = await pool.query<RowDataPacket[]>('SELECT id, email FROM users WHERE id = ? LIMIT 1', [id]);
    if (!targetUsers.length) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    const statusMap: Record<string, string> = {
      APPROVED: 'APPROVED', ACTIVE: 'APPROVED', AKTIF: 'APPROVED',
      PENDING: 'PENDING', REJECTED: 'REJECTED', INACTIVE: 'REJECTED',
      'NON-AKTIF': 'REJECTED'
    };
    const roleMap: Record<string, string> = {
      ADMIN: 'ADMIN', STAFF: 'STAFF', EDITOR: 'STAFF', ANGGOTA: 'ANGGOTA', USER: 'ANGGOTA'
    };

    const normalizedStatus = body.status !== undefined ? statusMap[String(body.status).trim().toUpperCase()] : undefined;
    const normalizedRole = body.role !== undefined ? roleMap[String(body.role).trim().toUpperCase()] : undefined;

    if (body.status !== undefined && !normalizedStatus) {
      return NextResponse.json({ success: false, error: 'Status user tidak valid.' }, { status: 400 });
    }
    if (body.role !== undefined && !normalizedRole) {
      return NextResponse.json({ success: false, error: 'Role user tidak valid.' }, { status: 400 });
    }
    if (normalizedStatus) {
      updates.push('status = ?');
      values.push(normalizedStatus);
    }
    if (normalizedRole) {
      updates.push('role = ?');
      values.push(normalizedRole);
    }
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (name.length < 2) return NextResponse.json({ success: false, error: 'Nama minimal 2 karakter.' }, { status: 400 });
      updates.push('name = ?');
      values.push(name);
    }
    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ success: false, error: 'Format email tidak valid.' }, { status: 400 });
      }
      const [duplicates] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, id]);
      if (duplicates.length) return NextResponse.json({ success: false, error: 'Email sudah digunakan user lain.' }, { status: 409 });
      updates.push('email = ?');
      values.push(email);
    }
    if (body.password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(body.password, 10));
    }
    
    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);

    const [result] = await pool.query<ResultSetHeader>(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    if (!result.affectedRows) return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });
    
    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error: any) {
    console.error('Error updating user:', error);
    const message = error?.code === 'ER_DUP_ENTRY'
      ? 'Email sudah digunakan user lain.'
      : error?.sqlMessage || error?.message || 'Gagal memperbarui user.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
