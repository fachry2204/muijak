import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM menus ORDER BY parent_id ASC, order_index ASC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Fetch menus error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title_id, title_en, title_ar, url, parent_id } = body;

    const [result]: any = await pool.query(
      `INSERT INTO menus (title_id, title_en, title_ar, url, parent_id) VALUES (?, ?, ?, ?, ?)`,
      [title_id, title_en, title_ar, url, parent_id || null]
    );

    await pool.query('INSERT INTO audit_logs (id, user_id, action, entity) VALUES (UUID(), ?, ?, ?)', [
      session.id, 'CREATE_MENU', 'menus'
    ]);

    return NextResponse.json({ success: true, message: 'Menu created successfully' });
  } catch (error) {
    console.error('Create menu error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { items } = await request.json(); // Array of { id, parent_id, order_index }

    // Use transaction for bulk update
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const item of items) {
        await connection.query(
          `UPDATE menus SET parent_id = ?, order_index = ? WHERE id = ?`,
          [item.parent_id, item.order_index, item.id]
        );
      }
      await connection.commit();
      
      await connection.query('INSERT INTO audit_logs (id, user_id, action, entity) VALUES (UUID(), ?, ?, ?)', [
        session.id, 'UPDATE_MENU_ORDER', 'menus'
      ]);

      connection.release();
      return NextResponse.json({ success: true, message: 'Menu order updated' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Update menu order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
