import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { getSession } from '@/lib/auth';
import { ensureNewsGalleryTable } from '@/lib/newsGallery';
import { ensureNewsTrashSchema } from '@/lib/newsTrash';
// @ts-ignore
import { validateUploadedFile } from '@/lib/fileUpload';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await ensureNewsGalleryTable();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM news WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    const [galleryRows] = await pool.query<RowDataPacket[]>(
      'SELECT image_url FROM news_gallery WHERE news_id = ? ORDER BY id ASC',
      [id]
    );
    return NextResponse.json({
      success: true,
      data: {
        ...rows[0],
        gallery_images: galleryRows.map((item) => item.image_url)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }

    const { id } = await params;
    const formData = await request.formData();
    await ensureNewsGalleryTable();
    
    const title_id = formData.get('title_id') as string;
    const slug = formData.get('slug') as string;
    const category_id = formData.get('category_id') as string;
    const status = (formData.get('status') as string) || 'DRAFT';
    const meta_title = (formData.get('meta_title') as string) || title_id;
    const meta_desc = (formData.get('meta_desc') as string) || '';
    const meta_keywords = (formData.get('meta_keywords') as string) || '';
    let content_id = (formData.get('content_id') as string) || '';
    const published_at_raw = formData.get('published_at') as string | null;
    const published_at = status === 'PUBLISHED'
      ? (published_at_raw ? new Date(published_at_raw) : new Date())
      : (published_at_raw ? new Date(published_at_raw) : null);
    
    const imageMain = formData.get('image_main') as File | null;
    const galleryFiles = formData.getAll('gallery') as File[];
    
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

    let imageUpdateQuery = '';
    let queryParams: any[] = [title_id, slug, category_id, status, published_at, meta_title, meta_desc, meta_keywords];
    
    if (imageMain && imageMain.size > 0) {
      const ext = path.extname(imageMain.name) || '.jpg';
      const validation = await validateUploadedFile(imageMain, ['image/jpeg', 'image/png', 'image/webp']);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.reason || 'File type not allowed' }, { status: 400 });
      }
      const mainFileName = `MUI Jakarta-${safeTitle}-utama${ext}`;
      const buffer = Buffer.from(await imageMain.arrayBuffer());
      fs.writeFileSync(path.join(mainDir, mainFileName), buffer);
      const imageUrl = `/gambar/berita/${folderDate}/${mainFileName}`;
      imageUpdateQuery = ', image_url = ?';
      queryParams.push(imageUrl);
    }
    
    const imgRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/gi;
    let imgCount = 1;
    content_id = content_id.replace(imgRegex, (match, extStr, base64Data) => {
      let ext = '.' + extStr;
      if (ext === '.jpeg') ext = '.jpg';
      
      const fileName = `MUI Jakarta-${safeTitle}-edit-${imgCount}${ext}`;
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(path.join(mainDir, fileName), buffer);
      
      const relativeUrl = `/gambar/berita/${folderDate}/${fileName}`;
      imgCount++;
      return `<img src="${relativeUrl}" alt="${altText}" title="${title_id}" class="img-fluid rounded my-4" />`;
    });
    
    queryParams.push(content_id);
    queryParams.push(id);
    
    await pool.query(
      `UPDATE news SET title_id = ?, slug = ?, category_id = ?, status = ?, published_at = ?, meta_title = ?, meta_desc = ?, meta_keywords = ?${imageUpdateQuery}, content_id = ? WHERE id = ?`,
      queryParams
    );
    
    if (galleryFiles.length > 0) {
      const galleryUrls = [];
      let galCount = 1;
      for (const file of galleryFiles) {
        if (file.size > 0) {
          if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: `Gambar galeri ${file.name} melebihi batas 2MB.` }, { status: 400 });
          }
          const ext = path.extname(file.name) || '.jpg';
          const validation = await validateUploadedFile(file, ['image/jpeg', 'image/png', 'image/webp']);
          if (!validation.valid) {
            return NextResponse.json({ success: false, error: validation.reason || 'File type not allowed' }, { status: 400 });
          }
          const galFileName = `MUI Jakarta-${safeTitle}-${id}-edit-${galCount}${ext}`;
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(path.join(galleryDir, galFileName), buffer);
          galleryUrls.push(`/gambar/berita/${folderDate}/Gallery/${galFileName}`);
          galCount++;
        }
      }
      
      await pool.query('DELETE FROM news_gallery WHERE news_id = ?', [id]);
      for (const url of galleryUrls) {
        await pool.query('INSERT INTO news_gallery (news_id, image_url) VALUES (?, ?)', [id, url]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('News update error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }

    const { id } = await params;
    await ensureNewsTrashSchema();
    const [rows] = await pool.query<any>('SELECT status FROM news WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'News not found' }, { status: 404 });
    }

    if (rows[0].status === 'TRASHED') {
      await ensureNewsGalleryTable();
      await pool.query('DELETE FROM news_gallery WHERE news_id = ?', [id]);
      await pool.query('DELETE FROM news WHERE id = ?', [id]);
      return NextResponse.json({ success: true, message: 'Permanently deleted' });
    } else {
      await pool.query('UPDATE news SET status = "TRASHED", deleted_at = NOW() WHERE id = ?', [id]);
      return NextResponse.json({ success: true, message: 'Moved to trash' });
    }
  } catch (error: any) {
    console.error('News delete error:', error);
    return NextResponse.json({ success: false, error: error?.sqlMessage || error?.message || 'Gagal memproses berita.' }, { status: 500 });
  }
}
