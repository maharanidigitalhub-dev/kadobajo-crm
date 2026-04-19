import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;

  // Detect admin domain — check all possible header sources
  const host =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    req.nextUrl.host ??
    '';

  const isAdmin =
    host === 'admin.kadobajo.id' ||
    host.startsWith('admin.kadobajo') ||
    host.startsWith('admin.') ||
    // Env var flag — set NEXT_PUBLIC_IS_ADMIN=true in admin Vercel project
    process.env.NEXT_PUBLIC_IS_ADMIN === 'true';

  // ── ADMIN DOMAIN ──
  if (isAdmin) {
    // Root → redirect to login or dashboard
    if (pathname === '/') {
      return NextResponse.redirect(
        new URL(auth === 'true' ? '/dashboard' : '/login', req.url)
      );
    }

    // Protect dashboard & customers
    if (
      (pathname.startsWith('/dashboard') || pathname.startsWith('/customers')) &&
      auth !== 'true'
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Already logged in — skip login
    if (pathname === '/login' && auth === 'true') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  // ── MAIN DOMAIN (kadobajo.id) ──
  // These routes don't exist on main domain
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/customers') ||
    pathname === '/login'
  ) {
    if (auth !== 'true') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)',],
};
