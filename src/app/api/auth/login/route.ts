import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { generateToken, setSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, email, password, role, status FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    if (user.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Akun belum aktif atau telah dinonaktifkan' }, { status: 403 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = generateToken(tokenPayload);
    await setSession(token);

    // Record audit log
    await pool.query('INSERT INTO audit_logs (id, user_id, action, entity) VALUES (UUID(), ?, ?, ?)', [
      user.id, 'LOGIN', 'auth'
    ]);

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
