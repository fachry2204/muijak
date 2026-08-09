import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { validateUploadedFile } from '@/lib/fileUpload';

export async function GET() {
  try {
    // Bersihkan berita yang sudah berada di tong sampah selama 30 hari.
    try {
      await pool.query(`
        DELETE FROM news
        WHERE UPPER(status) = 'TRASHED'
          AND deleted_at IS NOT NULL
          AND deleted_at <= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
    } catch (cleanupError: unknown) {
      // Tetap layani daftar berita jika migrasi deleted_at belum dijalankan.
      const errorCode = (cleanupError as {code?: string}).code;
      if (errorCode !== 'ER_BAD_FIELD_ERROR') throw cleanupError;
    }

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT n.*, c.name_id as category_name, u.name as author_name 
      FROM news n 
      LEFT JOIN categories c ON n.category_id = c.id 
      LEFT JOIN users u ON n.author_id = u.id 
      ORDER BY n.created_at DESC
    `);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title_id = formData.get('title_id') as string;
    const slug = formData.get('slug') as string;
    const category_id = formData.get('category_id') as string;
    const status = (formData.get('status') as string) || 'DRAFT';
    const meta_title = (formData.get('meta_title') as string) || title_id;
    const meta_desc = (formData.get('meta_desc') as string) || '';
    const meta_keywords = (formData.get('meta_keywords') as string) || '';
    let content_id = (formData.get('content_id') as string) || '';
    const published_at_raw = formData.get('published_at') as string | null;
    // If status is PUBLISHED, use provided date or now; if DRAFT, leave null
    const published_at = status === 'PUBLISHED'
      ? (published_at_raw ? new Date(published_at_raw) : new Date())
      : (published_at_raw ? new Date(published_at_raw) : null);
    
    const imageMain = formData.get('image_main') as File | null;
    const galleryFiles = formData.getAll('gallery') as File[];
    
    const crypto = require('crypto');
    const newsId = crypto.randomUUID();

    const fs = require('fs');
    const path = require('path');
    
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const folderDate = `${dd}-${mm}-${yyyy}`;
    
    const safeTitle = title_id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 50);
    const altText = `MUI Jakarta-${title_id}`;
    
    const publicDir = path.join(process.cwd(), 'public', 'gambar', 'berita');
    const mainDir = path.join(publicDir, folderDate);
    const galleryDir = path.join(mainDir, 'Gallery');
    
    if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });
    if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });

    let imageUrl = null;
    if (imageMain && imageMain.size > 0) {
      const ext = path.extname(imageMain.name) || '.jpg';
      const validation = await validateUploadedFile(imageMain, ['image/jpeg', 'image/png', 'image/webp']);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.reason || 'File type not allowed' }, { status: 400 });
      }
      const mainFileName = `MUI Jakarta-${safeTitle}-utama${ext}`;
      const buffer = Buffer.from(await imageMain.arrayBuffer());
      fs.writeFileSync(path.join(mainDir, mainFileName), buffer);
      imageUrl = `/gambar/berita/${folderDate}/${mainFileName}`;
    }
    
    const imgRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/gi;
    let imgCount = 1;
    content_id = content_id.replace(imgRegex, (match, extStr, base64Data) => {
      let ext = '.' + extStr;
      if (ext === '.jpeg') ext = '.jpg';
      
      const fileName = `MUI Jakarta-${safeTitle}-${imgCount}${ext}`;
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(path.join(mainDir, fileName), buffer);
      
      const relativeUrl = `/gambar/berita/${folderDate}/${fileName}`;
      imgCount++;
      return `<img src="${relativeUrl}" alt="${altText}" title="${title_id}" class="img-fluid rounded my-4" />`;
    });
    
    const galleryUrls = [];
    let galCount = 1;
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const ext = path.extname(file.name) || '.jpg';
        const validation = await validateUploadedFile(file, ['image/jpeg', 'image/png', 'image/webp']);
        if (!validation.valid) {
          return NextResponse.json({ success: false, error: validation.reason || 'File type not allowed' }, { status: 400 });
        }
        const galFileName = `MUI Jakarta-${safeTitle}-${galCount}${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(galleryDir, galFileName), buffer);
        galleryUrls.push(`/gambar/berita/${folderDate}/Gallery/${galFileName}`);
        galCount++;
      }
    }
    
    await pool.query(
      'INSERT INTO news (id, title_id, slug, content_id, category_id, image_url, status, published_at, meta_title, meta_desc, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newsId, title_id, slug, content_id, category_id, imageUrl, status, published_at, meta_title, meta_desc, meta_keywords]
    );
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        news_id CHAR(36) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
      )
    `);
    
    for (const url of galleryUrls) {
      await pool.query('INSERT INTO news_gallery (news_id, image_url) VALUES (?, ?)', [newsId, url]);
    }

    return NextResponse.json({ success: true, id: newsId });
  } catch (error: any) {
    console.error('News create error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create news' }, { status: 500 });
  }
}
