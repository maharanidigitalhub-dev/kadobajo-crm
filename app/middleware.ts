import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;

  // Detect admin subdomain from ALL possible headers
  const xForwardedHost = req.headers.get('x-forwarded-host') ?? '';
  const host = req.headers.get('host') ?? '';
  const isAdmin =
    xForwardedHost === 'admin.kadobajo.id' ||
    xForwardedHost.startsWith('admin.') ||
    host === 'admin.kadobajo.id' ||
    host.startsWith('admin.');

  // ── ADMIN SUBDOMAIN DETECTED ──
  if (isAdmin) {
    // Root → redirect to login or dashboard
    if (pathname === '/' || pathname === '') {
      const dest = auth === 'true' ? '/admin/dashboard' : '/admin/login';
      return NextResponse.redirect(new URL(dest, req.url));
    }

    // /login on admin subdomain → /admin/login
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // /dashboard on admin subdomain → /admin/dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // /customers on admin subdomain → /admin/customers
    if (pathname === '/customers') {
      return NextResponse.redirect(new URL('/admin/customers', req.url));
    }

    // Block landing page from showing on admin subdomain
    if (pathname === '/' || (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.match(/\.(png|jpg|ico|svg|webp)$/))) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // ── ADMIN ROUTES (/admin/*) ──
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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
