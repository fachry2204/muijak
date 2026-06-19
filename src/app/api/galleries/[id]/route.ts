import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth';
import { isFileSafe } from '@/lib/fileUpload';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM galleries WHERE id = ?', [unwrappedParams.id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Gallery not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  try {
    // Attempt to delete physical files
    const [rows] = await pool.query<RowDataPacket[]>('SELECT type, media_url FROM galleries WHERE id = ?', [unwrappedParams.id]);
    if (rows.length > 0) {
      const row = rows[0];
      if (row.type === 'image') {
        try {
          const urls = JSON.parse(row.media_url);
          for (const fileUrl of urls) {
            const decodedPath = decodeURIComponent(fileUrl);
            const absolutePath = path.join(process.cwd(), 'public', decodedPath);
            if (fs.existsSync(absolutePath)) {
              fs.unlinkSync(absolutePath);
            }
          }
        } catch(e) {
          console.error("Error deleting physical files", e);
        }
      }
    }

    await pool.query('DELETE FROM galleries WHERE id = ?', [unwrappedParams.id]);
    return NextResponse.json({ success: true, message: 'Gallery deleted' });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete gallery' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  try {
    const body = await request.json();
    const { action, title, event_date, media_urls } = body;
    
    if (action === 'update_info') {
      await pool.query('UPDATE galleries SET title = ?, event_date = ? WHERE id = ?', [title, event_date, unwrappedParams.id]);
      return NextResponse.json({ success: true, message: 'Gallery info updated' });
    }
    
    if (action === 'update_media') {
      await pool.query('UPDATE galleries SET media_url = ? WHERE id = ?', [JSON.stringify(media_urls), unwrappedParams.id]);
      return NextResponse.json({ success: true, message: 'Gallery media updated' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json({ success: false, error: 'Failed to update gallery' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT media_url, title, type FROM galleries WHERE id = ?', [unwrappedParams.id]);
    if (rows.length === 0) return NextResponse.json({ success: false, error: 'Gallery not found' }, { status: 404 });
    
    const row = rows[0];
    if (row.type !== 'image') return NextResponse.json({ success: false, error: 'Can only upload to image galleries' }, { status: 400 });

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });

    let existingUrls: string[] = [];
    try {
      existingUrls = JSON.parse(row.media_url);
    } catch(e) {
      existingUrls = [row.media_url];
    }

    const safeFolder = row.title.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'Untitled';
    const dirPath = path.join(process.cwd(), 'public', 'uploads', 'gallery', safeFolder);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    let index = existingUrls.length + 1;
    for (const file of files) {
      if (file && file.size > 0) {
        const ext = path.extname(file.name) || '.png';
        if (!isFileSafe(file.name)) {
          return NextResponse.json({ success: false, error: 'File type not allowed' }, { status: 400 });
        }
        let fileName = `${safeFolder}-${index}${ext}`;
        while (fs.existsSync(path.join(dirPath, fileName))) {
          index++;
          fileName = `${safeFolder}-${index}${ext}`;
        }
        
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(dirPath, fileName), buffer);
        
        existingUrls.push(`/uploads/gallery/${encodeURIComponent(safeFolder)}/${encodeURIComponent(fileName)}`);
        index++;
      }
    }
    
    await pool.query('UPDATE galleries SET media_url = ? WHERE id = ?', [JSON.stringify(existingUrls), unwrappedParams.id]);
    return NextResponse.json({ success: true, message: 'Images added successfully', media_urls: existingUrls });
  } catch (error) {
    console.error('Error adding images:', error);
    return NextResponse.json({ success: false, error: 'Failed to add images' }, { status: 500 });
  }
}
