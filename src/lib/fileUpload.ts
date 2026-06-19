import path from 'path';

export function isFileSafe(fileName: string): boolean {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(fileName).toLowerCase();
  
  // Periksa apakah ekstensi ada di daftar yang diizinkan
  if (!allowedExts.includes(ext)) return false;
  
  // Proteksi ekstra terhadap nama file shell bypass seperti shell.php.jpg
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('.php') || lowerName.includes('.phtml') || lowerName.includes('.sh') || lowerName.includes('.exe')) {
    return false;
  }
  
  return true;
}
