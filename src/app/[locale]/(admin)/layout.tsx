import { ReactNode } from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClientLayout from '@/components/layout/AdminClientLayout';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // Middleware handle the token check, but here we enforce it and verify validity.
  if (!session) {
    redirect('/login');
    return null;
  }

  const [users] = await pool.query<RowDataPacket[]>(
    'SELECT name, avatar_url FROM users WHERE id = ? LIMIT 1',
    [session.id]
  );
  const enrichedSession = { ...session, name: users[0]?.name, avatar_url: users[0]?.avatar_url };

  return (
    <AdminClientLayout session={enrichedSession}>
      {children}
    </AdminClientLayout>
  );
}
