import { NextRequest, NextResponse } from 'next/server';

type UserRole = 'admin' | 'editor' | 'viewer';

// Route permissions — siapa yang boleh akses
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin/users': ['admin'],
  '/admin/cms':   ['admin', 'editor'],
};

function canAccess(pathname: string, role: UserRole | null): boolean {
  if (!role) return false;
  for (const [route, allowed] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return allowed.includes(role);
    }
  }
  // Route lain yang tidak didefinisikan — semua role boleh akses
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth     = req.cookies.get('auth')?.value;
  const userRole = req.cookies.get('user_role')?.value as UserRole | null;

  const xForwardedHost = req.headers.get('x-forwarded-host') ?? '';
  const host           = req.headers.get('host') ?? '';
  const isAdmin =
    xForwardedHost === 'admin.kadobajo.id' ||
    xForwardedHost.startsWith('admin.') ||
    host === 'admin.kadobajo.id' ||
    host.startsWith('admin.');

  // ── ADMIN SUBDOMAIN ──
  if (isAdmin) {
    if (pathname === '/' || pathname === '') {
      const dest = auth === 'true' ? '/admin/dashboard' : '/admin/login';
      return NextResponse.redirect(new URL(dest, req.url));
    }
    if (pathname === '/login')     return NextResponse.redirect(new URL('/admin/login', req.url));
    if (pathname === '/dashboard') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    if (pathname === '/customers') return NextResponse.redirect(new URL('/admin/customers', req.url));
    if (pathname === '/users')     return NextResponse.redirect(new URL('/admin/users', req.url));

    if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.match(/\.(png|jpg|ico|svg|webp)$/)) {
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

  // Belum login
  const protectedPaths = ['/admin/dashboard', '/admin/customers', '/admin/cms', '/admin/users'];
  if (protectedPaths.some(p => pathname.startsWith(p)) && auth !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Sudah login tapi buka /login
  if (pathname === '/admin/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Cek permission berdasarkan role
  if (auth === 'true' && userRole) {
    if (!canAccess(pathname, userRole)) {
      // Redirect ke dashboard dengan pesan unauthorized
      const url = new URL('/admin/dashboard', req.url);
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
};
