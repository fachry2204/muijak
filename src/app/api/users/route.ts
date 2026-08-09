import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';
import { randomUUID } from 'crypto';

import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, email, role, created_at, status FROM users ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, status } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    // Check if email already exists
    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }

    const roleMap: Record<string, 'ADMIN' | 'STAFF' | 'ANGGOTA'> = {
      ADMIN: 'ADMIN', STAFF: 'STAFF', EDITOR: 'STAFF', ANGGOTA: 'ANGGOTA', USER: 'ANGGOTA'
    };
    const statusMap: Record<string, 'APPROVED' | 'PENDING' | 'REJECTED'> = {
      APPROVED: 'APPROVED', Aktif: 'APPROVED', PENDING: 'PENDING',
      REJECTED: 'REJECTED', 'Non-Aktif': 'REJECTED'
    };
    const normalizedRole = roleMap[role];
    const normalizedStatus = statusMap[status] || 'APPROVED';
    if (!normalizedRole) {
      return NextResponse.json({ success: false, error: 'Role user tidak valid' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    await pool.query(
      'INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name.trim(), email.trim().toLowerCase(), hashedPassword, normalizedRole, normalizedStatus]
    );

    return NextResponse.json({ success: true, message: 'User created successfully', id: userId });
  } catch (error: any) {
    console.error('Error creating user:', error);
    const message = error?.code === 'ER_DUP_ENTRY'
      ? 'Email sudah digunakan oleh user lain'
      : error?.sqlMessage || error?.message || 'Failed to create user';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
