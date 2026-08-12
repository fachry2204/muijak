import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { validateUploadedFile } from '@/lib/fileUpload';
import { getSession } from '@/lib/auth';
import { ensureNewsGalleryTable } from '@/lib/newsGallery';

export async function GET() {
  try {
    const session = await getSession();
    await ensureNewsGalleryTable();
    // Bersihkan berita yang sudah berada di tong sampah selama 30 hari.
    try {
      await pool.query(`
        DELETE ng FROM news_gallery ng
        INNER JOIN news n ON n.id = ng.news_id
        WHERE UPPER(n.status) = 'TRASHED'
          AND n.deleted_at IS NOT NULL
          AND n.deleted_at <= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
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

    const publicFilter = session ? '' : "WHERE UPPER(n.status) = 'PUBLISHED'";
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT n.*, c.name_id as category_name, u.name as author_name 
      FROM news n 
      LEFT JOIN categories c ON n.category_id = c.id 
      LEFT JOIN users u ON n.author_id = u.id 
      ${publicFilter}
      ORDER BY n.created_at DESC
    `);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Tidak memiliki akses untuk membuat berita.' }, { status: 403 });
    }

    const formData = await request.formData();
    
    const title_id = formData.get('title_id') as string;
    const requestedSlug = String(formData.get('slug') || '');
    const slug = requestedSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category_id = formData.get('category_id') as string;
    const status = (formData.get('status') as string) || 'DRAFT';
    const meta_title = (formData.get('meta_title') as string) || title_id;
    const meta_desc = (formData.get('meta_desc') as string) || '';
    const meta_keywords = (formData.get('meta_keywords') as string) || '';
    const youtube_url = String(formData.get('youtube_url') || '').trim() || null;
    let content_id = (formData.get('content_id') as string) || '';
    const published_at_raw = formData.get('published_at') as string | null;
    // If status is PUBLISHED, use provided date or now; if DRAFT, leave null
    const published_at = status === 'PUBLISHED'
      ? (published_at_raw ? new Date(published_at_raw) : new Date())
      : (published_at_raw ? new Date(published_at_raw) : null);
    
    if (!title_id?.trim() || !slug || !content_id?.trim() || !category_id) {
      return NextResponse.json({ success: false, error: 'Judul, slug, kategori, dan isi berita wajib diisi.' }, { status: 400 });
    }

    const [existingNews] = await pool.query<RowDataPacket[]>('SELECT id FROM news WHERE slug = ? LIMIT 1', [slug]);
    if (existingNews.length) {
      return NextResponse.json({
        success: true,
        id: existingNews[0].id,
        already_saved: true,
        message: 'Berita ini sudah tersimpan. Anda akan kembali ke daftar berita.'
      });
    }

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
    
    await ensureNewsGalleryTable();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        'INSERT INTO news (id, title_id, slug, content_id, category_id, author_id, image_url, youtube_url, status, published_at, meta_title, meta_desc, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newsId, title_id.trim(), slug, content_id, category_id, session.id, imageUrl, youtube_url, status, published_at, meta_title, meta_desc, meta_keywords]
      );

      for (const url of galleryUrls) {
        await connection.query('INSERT INTO news_gallery (news_id, image_url) VALUES (?, ?)', [newsId, url]);
      }
      await connection.commit();
    } catch (transactionError: any) {
      await connection.rollback();
      if (transactionError?.code === 'ER_DUP_ENTRY') {
        const [duplicate] = await pool.query<RowDataPacket[]>('SELECT id FROM news WHERE slug = ? LIMIT 1', [slug]);
        if (duplicate.length) {
          return NextResponse.json({
            success: true,
            id: duplicate[0].id,
            already_saved: true,
            message: 'Berita ini sudah tersimpan. Anda akan kembali ke daftar berita.'
          });
        }
      }
      throw transactionError;
    } finally {
      connection.release();
    }

    return NextResponse.json({ success: true, id: newsId, message: 'Berita berhasil disimpan.' }, { status: 201 });
  } catch (error: any) {
    console.error('News create error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create news' }, { status: 500 });
  }
}
