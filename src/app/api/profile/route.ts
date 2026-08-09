import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import path from 'path';
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getUploadPath, validateUploadedFile } from '@/lib/fileUpload';

type ProfileRow = RowDataPacket & {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Sesi tidak valid.' }, { status: 401 });

  const [rows] = await pool.query<ProfileRow[]>(
    'SELECT id, name, email, role, status, avatar_url, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
    [session.id]
  );
  if (!rows.length) return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });

  return NextResponse.json({ success: true, data: rows[0] });
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: 'Sesi tidak valid.' }, { status: 401 });

    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim().toLowerCase();
    const currentPassword = String(form.get('current_password') || '');
    const newPassword = String(form.get('new_password') || '');
    const avatar = form.get('avatar');

    if (name.length < 2) return NextResponse.json({ success: false, error: 'Nama minimal 2 karakter.' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Format email tidak valid.' }, { status: 400 });
    }

    const [users] = await pool.query<ProfileRow[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [session.id]);
    if (!users.length) return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });

    const [duplicates] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1', [email, session.id]);
    if (duplicates.length) return NextResponse.json({ success: false, error: 'Email sudah digunakan akun lain.' }, { status: 409 });

    const updates = ['name = ?', 'email = ?'];
    const values: unknown[] = [name, email];

    if (newPassword) {
      if (newPassword.length < 8) return NextResponse.json({ success: false, error: 'Kata sandi baru minimal 8 karakter.' }, { status: 400 });
      if (!currentPassword || !(await bcrypt.compare(currentPassword, users[0].password))) {
        return NextResponse.json({ success: false, error: 'Kata sandi saat ini salah.' }, { status: 400 });
      }
      updates.push('password = ?');
      values.push(await bcrypt.hash(newPassword, 10));
    }

    if (avatar instanceof File && avatar.size > 0) {
      const validation = await validateUploadedFile(avatar, ['image/jpeg', 'image/png', 'image/webp']);
      if (!validation.valid) return NextResponse.json({ success: false, error: validation.reason }, { status: 400 });

      const extension = path.extname(avatar.name).toLowerCase();
      const filename = `${session.id}-${randomUUID()}${extension}`;
      await writeFile(getUploadPath('uploads/profiles', filename, true), Buffer.from(await avatar.arrayBuffer()));
      updates.push('avatar_url = ?');
      values.push(`/uploads/profiles/${filename}`);
    }

    values.push(session.id);
    await pool.query(`UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);

    return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui.' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: 'Gagal memperbarui profil.' }, { status: 500 });
  }
}
