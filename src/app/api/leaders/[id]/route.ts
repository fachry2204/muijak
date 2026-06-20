import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const position_id = formData.get('position_id') as string;
    const image = formData.get('image') as File | null;
    
    let queryArgs: any[] = [name, position_id];
    let imageQuery = '';

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const now = new Date();
      const filename = `leader-${now.getTime()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      fs.writeFileSync(filepath, buffer);
      
      imageQuery = ', image_url = ?';
      queryArgs.push(`/uploads/${filename}`);
    } else {
       const imgUrlStr = formData.get('image_url') as string;
       if (imgUrlStr) {
           imageQuery = ', image_url = ?';
           queryArgs.push(imgUrlStr);
       }
    }

    queryArgs.push(id);

    await pool.query(
      `UPDATE leaders SET name = ?, position_id = ?${imageQuery} WHERE id = ?`,
      queryArgs
    );

    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    await pool.query('DELETE FROM leaders WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
