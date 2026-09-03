import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { validateUploadedFile } from '@/lib/fileUpload';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT setting_key, setting_value FROM settings');
    
    // Convert array to object
    const settingsObj: Record<string, string> = {};
    rows.forEach(row => {
      settingsObj[row.setting_key] = row.setting_value;
    });

    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !['ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let settings: Record<string, string> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          if (value.size > 0) {
            const validation = await validateUploadedFile(value, ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
            if (!validation.valid) {
              return NextResponse.json({ success: false, error: validation.reason || 'File type not allowed' }, { status: 400 });
            }
            const ext = path.extname(value.name).toLowerCase() || '.png';
            const fileName = `${key}-${Date.now()}${ext}`;
            const dirPath = path.join(process.cwd(), 'public', 'uploads');
            
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            
            const buffer = Buffer.from(await value.arrayBuffer());
            fs.writeFileSync(path.join(dirPath, fileName), buffer);
            settings[key] = `/uploads/${fileName}`;
          }
        } else {
          settings[key] = value.toString();
        }
      }
    } else {
      settings = await request.json();
    }
    
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error in POST /api/settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
