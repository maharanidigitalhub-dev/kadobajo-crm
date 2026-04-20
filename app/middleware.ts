import { NextRequest, NextResponse } from 'next/server';

const MAINTENANCE = process.env.MAINTENANCE_MODE === 'true';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;

  // ── MAINTENANCE MODE ──
  if (MAINTENANCE) {
    // LP → maintenance page
    if (!pathname.startsWith('/admin') &&
        !pathname.startsWith('/maintenance') &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/logo.png')) {
      return NextResponse.redirect(new URL('/maintenance', req.url));
    }
    // Admin → admin maintenance page (tapi masih bisa akses /admin/login untuk override)
    if (pathname.startsWith('/admin') &&
        !pathname.startsWith('/admin/maintenance') &&
        !pathname.startsWith('/admin/login') &&
        !pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/admin/maintenance', req.url));
    }
  }

  // ── ADMIN ROUTES ──
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(
      new URL(auth === 'true' ? '/admin/dashboard' : '/admin/login', req.url)
    );
  }

  const protectedPaths = ['/admin/dashboard', '/admin/customers', '/admin/cms'];
  if (protectedPaths.some(p => pathname.startsWith(p)) && auth !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (pathname === '/admin/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)'],
};
