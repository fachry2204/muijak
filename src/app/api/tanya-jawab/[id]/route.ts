import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM pertanyaan_umat WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Data tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengambil data' }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    let ulama_penjawab = '';
    let jawaban = '';
    let video_url = '';
    let photoUrl: string | null = null;

    try {
      const formData = await request.formData();
      ulama_penjawab = formData.get('ulama_penjawab') as string;
      jawaban = formData.get('jawaban') as string;
      video_url = formData.get('video_url') as string;
      const file = formData.get('ulama_photo_file') as File | null;
      const existingPhoto = formData.get('ulama_photo_existing') as string | null;

      if (file && file.size > 0) {
        const ext = path.extname(file.name) || '.jpg';
        const fileName = `ulama-${id}-${Date.now()}${ext}`;
        const dirPath = path.join(process.cwd(), 'public', 'gambar', 'ulama');
        
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(dirPath, fileName), buffer);
        photoUrl = `/gambar/ulama/${fileName}`;
      } else if (existingPhoto) {
        photoUrl = existingPhoto;
      }
    } catch (err) {
      // Fallback if client sent JSON instead of FormData (for backward compatibility if needed)
      return NextResponse.json({ success: false, error: 'Request body must be form-data' }, { status: 400 });
    }

    if (!ulama_penjawab || !jawaban) {
      return NextResponse.json({ success: false, error: 'Ulama Penjawab dan Jawaban wajib diisi' }, { status: 400 });
    }

    if (photoUrl !== null) {
      await pool.query(
        'UPDATE pertanyaan_umat SET ulama_penjawab = ?, jawaban = ?, video_url = ?, ulama_photo = ?, status = ? WHERE id = ?',
        [ulama_penjawab, jawaban, video_url || '', photoUrl, 'Dijawab', id]
      );
    } else {
      await pool.query(
        'UPDATE pertanyaan_umat SET ulama_penjawab = ?, jawaban = ?, video_url = ?, status = ? WHERE id = ?',
        [ulama_penjawab, jawaban, video_url || '', 'Dijawab', id]
      );
    }

    return NextResponse.json({ success: true, message: 'Berhasil menyimpan jawaban' });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ success: false, error: 'Gagal menyimpan jawaban' }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM pertanyaan_umat WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus data' }, { status: 500 });
  }
}
