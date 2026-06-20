import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/auth';
// @ts-ignore
import { validateUploadedFile } from '@/lib/fileUpload';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM leaders ORDER BY order_index ASC, id DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const position_id = formData.get('position_id') as string;
    const image = formData.get('image') as File | null;
    let image_url = null;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      // Validasi sederhana
      const now = new Date();
      const filename = `leader-${now.getTime()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      fs.writeFileSync(filepath, buffer);
      image_url = `/uploads/${filename}`;
    } else {
       // if they submitted a string URL instead
       const imgUrlStr = formData.get('image_url') as string;
       if(imgUrlStr) image_url = imgUrlStr;
    }

    const [result] = await pool.query<any>(
      'INSERT INTO leaders (name, position_id, image_url) VALUES (?, ?, ?)',
      [name, position_id, image_url]
    );

    return NextResponse.json({ success: true, message: 'Added successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to add' }, { status: 500 });
  }
}
