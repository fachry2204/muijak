import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM fatwas ORDER BY id DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    // If table doesn't exist, this will fail. We can gracefully return empty array or auto-create.
    console.error('Error fetching fatwas:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch fatwas', data: [] }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    let title = '';
    let no = '';
    let date = '';
    let type = '';
    let sizeStr = '0 KB';
    let status = 'Draft';
    let fileUrl = null;

    try {
      const formData = await request.formData();
      title = formData.get('title') as string;
      no = formData.get('no') as string;
      date = formData.get('date') as string;
      type = formData.get('type') as string;
      status = (formData.get('status') as string) || 'Draft';
      
      const file = formData.get('file_pdf') as File | null;
      
      if (file && file.size > 0) {
        const ext = path.extname(file.name) || '.pdf';
        const fileName = `fatwa-${Date.now()}${ext}`;
        const dirPath = path.join(process.cwd(), 'public', 'fatwa', 'dokumen');
        
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(dirPath, fileName), buffer);
        fileUrl = `/fatwa/dokumen/${fileName}`;
        
        const sizeInKb = Math.round(file.size / 1024);
        if (sizeInKb > 1024) {
          sizeStr = `${(sizeInKb / 1024).toFixed(1)} MB`;
        } else {
          sizeStr = `${sizeInKb} KB`;
        }
      }
    } catch (err) {
      // If client sends JSON
      return NextResponse.json({ success: false, error: 'Request body must be multipart/form-data' }, { status: 400 });
    }

    if (!title || !no || !date || !type) {
      return NextResponse.json({ success: false, error: 'Title, No, Date, and Type are required' }, { status: 400 });
    }

    const [result] = await pool.query<any>(
      'INSERT INTO fatwas (title, no, date, type, size, file_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, no, date, type, sizeStr, fileUrl, status]
    );

    return NextResponse.json({ success: true, message: 'Fatwa created successfully', id: result.insertId });
  } catch (error: any) {
    console.error('Error creating fatwa:', error);
    return NextResponse.json({ success: false, error: 'Failed to create fatwa' }, { status: 500 });
  }
}
