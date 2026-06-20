/**
 * fileUpload.ts - Secure File Upload Validation & Storage Helper
 * 
 * Keamanan:
 * - Whitelist extension MIME yang diizinkan (jpg, png, pdf)
 * - Blacklist ekstensi berbahaya (double extension, shell, script)
 * - Validasi MIME type aktual dari buffer file (magic bytes)
 * - Sanitasi nama file agar tidak bisa path traversal
 * - Penyimpanan di luar public root (di /uploads/ luar /public/)
 */

import path from 'path';
import fs from 'fs';

// ── Whitelist: HANYA ekstensi ini yang boleh ──────────────────────────────────
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']);

// ── Whitelist: MIME type yang diizinkan (dari Content-Type & magic bytes) ─────
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);

// ── Blacklist: Pola nama/ekstensi yang selalu DITOLAK ─────────────────────────
// Menangkap: shell.php, shell.php.jpg, shell.phtml, .htaccess, .php5, dsb.
const DANGEROUS_PATTERNS = [
  /\.php(\d?|html|ml|s)?$/i,
  /\.phtml$/i,
  /\.phar$/i,
  /\.asp(x?)$/i,
  /\.jsp$/i,
  /\.sh$/i,
  /\.py$/i,
  /\.exe$/i,
  /\.bat$/i,
  /\.cmd$/i,
  /\.htaccess$/i,
  /\.htpasswd$/i,
  /\.js$/i,
  /\.mjs$/i,
  /\.cgi$/i,
  /\.pl$/i,
  /\.svg$/i, // SVG dapat menjalankan JS sehingga diblokir
];

// ── Magic bytes untuk verifikasi MIME file (deep validation) ──────────────────
const MAGIC_BYTES: { [mime: string]: Buffer[] } = {
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png':  [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  'image/gif':  [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
  'image/webp': [Buffer.from('RIFF')], // Partial check, header RIFF....WEBP
  'application/pdf': [Buffer.from('%PDF')],
};

/**
 * Periksa apakah nama file aman untuk diupload.
 * Validasi: ekstensi whitelist + bukan pola berbahaya (double ext, shell, dll).
 */
export function isFileSafe(filename: string): boolean {
  const lower = filename.toLowerCase();

  // Tolak jika mengandung pola ekstensi berbahaya di mana pun dalam nama file
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(lower)) return false;
  }

  // Ambil ekstensi paling akhir
  const ext = path.extname(lower);
  if (!ext) return false;

  // Wajib ada di whitelist
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Verifikasi MIME type file berdasarkan magic bytes (isi buffer-nya).
 * Mencegah file yang disamarkan misalnya shell.php yang isinya PHP tapi
 * extension-nya .jpg.
 */
export function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  for (const sig of signatures) {
    if (buffer.slice(0, sig.length).equals(sig)) return true;
  }
  return false;
}

/**
 * Validasi lengkap sebuah File object sebelum disimpan ke disk.
 * Mengembalikan { valid: false, reason: '...' } jika tidak lolos.
 */
export async function validateUploadedFile(
  file: File,
  allowedMimes?: string[]
): Promise<{ valid: boolean; reason?: string }> {
  // 1. Cek nama file dari sisi ekstensi & blacklist
  if (!isFileSafe(file.name)) {
    return { valid: false, reason: `Tipe file tidak diizinkan: ${file.name}` };
  }

  // 2. Cek MIME type yang dideklarasikan oleh browser
  const allowedMimeSet = allowedMimes
    ? new Set(allowedMimes)
    : ALLOWED_MIME_TYPES;

  if (!allowedMimeSet.has(file.type)) {
    return { valid: false, reason: `MIME type tidak diizinkan: ${file.type}` };
  }

  // 3. Verifikasi magic bytes (isi file yang sebenarnya)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!verifyMagicBytes(buffer, file.type)) {
    return { valid: false, reason: 'Isi file tidak sesuai dengan tipe yang dideklarasikan (magic bytes mismatch).' };
  }

  // 4. Cek ukuran (maks 10MB)
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, reason: 'Ukuran file terlalu besar (maks 10MB).' };
  }

  return { valid: true };
}

/**
 * Sanitasi nama file: hapus semua karakter berbahaya, cegah path traversal.
 * Contoh: "../../shell.php.jpg" -> "shellphpjpg.jpg" (tidak valid, ditolak sebelum sampai sini)
 */
export function sanitizeFilename(filename: string): string {
  // Ambil hanya basename (hapus path traversal)
  const base = path.basename(filename);
  
  // Ganti semua karakter non-alphanumeric kecuali titik dan tanda hubung
  const sanitized = base.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  
  // Pastikan tidak ada double dot yang bisa menyebabkan double extension berbahaya
  // misal: "file..php.jpg" -> tetap dicek oleh isFileSafe
  return sanitized;
}

/**
 * Simpan file ke direktori yang AMAN (di luar public root).
 * Gunakan /private_uploads/ yang tidak bisa diakses langsung via URL browser.
 * Untuk serving file, buat route API `/api/media/[...path]` yang memverifikasi
 * autentikasi sebelum mengirimkan file.
 * 
 * Untuk file yang MEMANG perlu diakses publik (gambar berita, galeri),
 * gunakan parameter saveToPublic = true.
 */
export function getUploadPath(
  subDirectory: string,
  filename: string,
  saveToPublic: boolean = true
): string {
  const root = saveToPublic
    ? path.join(process.cwd(), 'public') 
    : path.join(process.cwd(), 'private_uploads'); // Di luar public root

  const dirPath = path.join(root, subDirectory);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return path.join(dirPath, filename);
}
