import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ensureNewsTrashSchema } from '@/lib/newsTrash';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }

    const { action, ids, category_id } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== 'string' || !id.trim())) {
      return NextResponse.json({ success: false, error: 'Daftar berita yang dipilih tidak valid.' }, { status: 400 });
    }

    // Convert array of IDs to comma-separated string for IN clause, securely
    const placeholders = ids.map(() => '?').join(',');

    if (action === 'delete_permanent') {
      const [result] = await pool.query<ResultSetHeader>(`DELETE FROM news WHERE status = 'TRASHED' AND id IN (${placeholders})`, ids);
      return NextResponse.json({ success: true, affected: result.affectedRows, message: `${result.affectedRows} berita dihapus permanen.` });
    } 
    else if (action === 'trash') {
      await ensureNewsTrashSchema();
      const [result] = await pool.query<ResultSetHeader>(`UPDATE news SET status = 'TRASHED', deleted_at = NOW() WHERE status <> 'TRASHED' AND id IN (${placeholders})`, ids);
      return NextResponse.json({ success: true, affected: result.affectedRows, message: `${result.affectedRows} berita dipindahkan ke tong sampah.` });
    }
    else if (action === 'restore') {
      await ensureNewsTrashSchema();
      const [result] = await pool.query<ResultSetHeader>(`UPDATE news SET status = 'DRAFT', deleted_at = NULL WHERE status = 'TRASHED' AND id IN (${placeholders})`, ids);
      return NextResponse.json({ success: true, affected: result.affectedRows, message: `${result.affectedRows} berita dipulihkan sebagai draf.` });
    }
    else if (action === 'move_category') {
      if (!category_id) return NextResponse.json({ success: false, error: 'No category provided' }, { status: 400 });
      
      const params = [category_id, ...ids];
      await pool.query(`UPDATE news SET category_id = ? WHERE id IN (${placeholders})`, params);
      return NextResponse.json({ success: true, message: 'Category updated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API Bulk Error:', error);
    return NextResponse.json({ success: false, error: error?.sqlMessage || error?.message || 'Aksi massal gagal.' }, { status: 500 });
  }
}
