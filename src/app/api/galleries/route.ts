import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';
import { validateUploadedFile } from '@/lib/fileUpload';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM galleries ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch galleries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as string; // 'image' or 'video'
    const eventDate = formData.get('event_date') as string || null;
    let mediaUrl = formData.get('media_url') as string; // Used only for YouTube video
    
    // For multiple image uploads
    const files = formData.getAll('files') as File[];

    if (!title || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'image' && files.length > 0) {
      // Handle multiple images
      const urls: string[] = [];
      const safeFolder = title.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'Untitled';
      const dirPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', safeFolder);
      
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      let index = 1;
      for (const file of files) {
        if (file && file.size > 0) {
          const ext = path.extname(file.name) || '.png';
          const validation = await validateUploadedFile(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
          if (!validation.valid) {
            return NextResponse.json({ success: false, error: validation.reason || 'File type not allowed' }, { status: 400 });
          }
          
          let fileName = `${safeFolder}-${index}${ext}`;
          // Make sure filename is unique if adding to same album later
          while (fs.existsSync(path.join(dirPath, fileName))) {
            index++;
            fileName = `${safeFolder}-${index}${ext}`;
          }
          
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(path.join(dirPath, fileName), buffer);
          
          urls.push(`/uploads/gallery/${encodeURIComponent(safeFolder)}/${encodeURIComponent(fileName)}`);
          index++;
        }
      }
      
      await pool.query(
        'INSERT INTO galleries (title, type, media_url, event_date) VALUES (?, ?, ?, ?)',
        [title, type, JSON.stringify(urls), eventDate]
      );
      
      return NextResponse.json({ success: true, message: 'Gallery created successfully' });
    } else if (type === 'video' && mediaUrl) {
      // Handle youtube video URL
      await pool.query(
        'INSERT INTO galleries (title, type, media_url, event_date) VALUES (?, ?, ?, ?)',
        [title, type, JSON.stringify([mediaUrl]), eventDate]
      );
      return NextResponse.json({ success: true, message: 'Gallery created successfully' });
    }

    return NextResponse.json({ success: false, error: 'No media provided' }, { status: 400 });
  } catch (error: any) {
    console.error('Error creating gallery:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Gagal membuat galeri'
    }, { status: 500 });
  }
}
