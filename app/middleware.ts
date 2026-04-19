import { NextRequest, NextResponse } from 'next/server';

function isAdminDomain(req: NextRequest): boolean {
  // Check multiple sources for the hostname
  const host =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('host') ||
    req.nextUrl.hostname ||
    '';
  return host.includes('admin.');
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;
  const adminDomain = isAdminDomain(req);

  // ── ADMIN DOMAIN (admin.kadobajo.id) ──
  if (adminDomain) {
    // Root → redirect to dashboard or login
    if (pathname === '/') {
      return NextResponse.redirect(
        new URL(auth === 'true' ? '/dashboard' : '/login', req.url)
      );
    }

    // Protected admin routes → require auth
    if (
      (pathname.startsWith('/dashboard') || pathname.startsWith('/customers')) &&
      auth !== 'true'
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Already logged in → skip login
    if (pathname === '/login' && auth === 'true') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  // ── MAIN DOMAIN (kadobajo.id) ──

  // Redirect admin routes to admin subdomain
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/customers')
  ) {
    const adminUrl = new URL(req.url);
    adminUrl.hostname = 'admin.kadobajo.id';
    adminUrl.host = 'admin.kadobajo.id';
    return NextResponse.redirect(adminUrl.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)',
  ],
};
