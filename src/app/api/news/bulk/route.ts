import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { action, ids, category_id } = await request.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
    }

    // Convert array of IDs to comma-separated string for IN clause, securely
    const placeholders = ids.map(() => '?').join(',');

    if (action === 'delete_permanent') {
      await pool.query(`DELETE FROM news WHERE id IN (${placeholders})`, ids);
      return NextResponse.json({ success: true, message: 'Permanently deleted successfully' });
    } 
    else if (action === 'trash') {
      await pool.query(`UPDATE news SET status = 'TRASHED' WHERE id IN (${placeholders})`, ids);
      return NextResponse.json({ success: true, message: 'Moved to trash successfully' });
    }
    else if (action === 'restore') {
      await pool.query(`UPDATE news SET status = 'DRAFT' WHERE id IN (${placeholders})`, ids);
      return NextResponse.json({ success: true, message: 'Restored successfully' });
    }
    else if (action === 'move_category') {
      if (!category_id) return NextResponse.json({ success: false, error: 'No category provided' }, { status: 400 });
      
      const params = [category_id, ...ids];
      await pool.query(`UPDATE news SET category_id = ? WHERE id IN (${placeholders})`, params);
      return NextResponse.json({ success: true, message: 'Category updated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Bulk Error:', error);
    return NextResponse.json({ success: false, error: 'Bulk action failed' }, { status: 500 });
  }
}
