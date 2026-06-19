import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

// Konfigurasi Next-Intl Middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['id', 'en', 'ar'],
  defaultLocale: 'id',
  localePrefix: 'as-needed',
  localeDetection: false
});

export function middleware(req: NextRequest) {
  // Jalankan Intl Middleware terlebih dahulu
  const res = intlMiddleware(req);
  
  // Ambil token dari cookies
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Protected Admin Routes
  if (pathname.includes('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Verifikasi Token dan Role harus dilakukan di Server Component/API karena jwt.verify butuh Node.js runtime,
    // Di middleware (Edge Runtime), kita bisa gunakan JOSE, atau kita handle redirect dasar disini, 
    // dan validasi role ketat di layout admin.
  }

  // Jika akses /login tapi sudah punya token, arahkan ke /admin
  if (pathname.includes('/login') && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return res;
}

export const config = {
  // Terapkan middleware ke semua rute kecuali statis, _next/static, _next/image, favicon, dan API.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
