import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    if (path && !path.startsWith('/admin') && !path.startsWith('/api')) {
      await pool.query(
        'INSERT INTO web_visitors (ip_address, user_agent, path) VALUES (?, ?, ?)',
        [ip_address, user_agent, path]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
