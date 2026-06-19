import { ReactNode } from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClientLayout from '@/components/layout/AdminClientLayout';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // Middleware handle the token check, but here we enforce it and verify validity.
  if (!session) {
    redirect('/login');
    return null;
  }

  return (
    <AdminClientLayout session={session}>
      {children}
    </AdminClientLayout>
  );
}
