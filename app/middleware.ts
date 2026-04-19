import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;

  // Get all possible host headers
  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    '';

  // Check if this is admin subdomain
  // Also check VERCEL_URL env for local dev fallback
  const isAdmin =
    host.startsWith('admin.') ||
    host === 'admin.kadobajo.id' ||
    pathname.startsWith('/admin');

  console.log('[middleware]', { host, pathname, isAdmin, auth: !!auth });

  // ── ADMIN SUBDOMAIN ROUTES ──
  if (isAdmin) {
    // Strip /admin prefix if present (for path-based fallback)
    const adminPath = pathname.startsWith('/admin')
      ? pathname.replace(/^\/admin/, '') || '/'
      : pathname;

    if (adminPath === '/' || adminPath === '') {
      return NextResponse.redirect(
        new URL(auth === 'true' ? '/dashboard' : '/login', req.url)
      );
    }

    if (
      (adminPath.startsWith('/dashboard') || adminPath.startsWith('/customers')) &&
      auth !== 'true'
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (adminPath === '/login' && auth === 'true') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  // ── MAIN DOMAIN ──
  // Protect /login /dashboard /customers on main domain
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/customers')) {
    if (auth !== 'true') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === '/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)',],
};
