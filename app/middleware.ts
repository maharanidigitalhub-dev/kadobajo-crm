import { NextRequest, NextResponse } from 'next/server';

const ADMIN_HOSTNAME = 'admin.kadobajo.id';

// Admin routes that require auth
const ADMIN_PROTECTED = ['/dashboard', '/customers'];
// Admin-only routes (inaccessible from main domain)
const ADMIN_ROUTES = ['/dashboard', '/customers', '/login'];

export function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;
  const host = req.headers.get('host') ?? hostname;
  const isAdminDomain = host === ADMIN_HOSTNAME || host.startsWith('admin.');
  const auth = req.cookies.get('auth')?.value;

  // ── MAIN DOMAIN (kadobajo.id) ──
  if (!isAdminDomain) {
    // Block access to admin routes from main domain → redirect to admin subdomain
    if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
      return NextResponse.redirect(`https://${ADMIN_HOSTNAME}${pathname}`);
    }
    return NextResponse.next();
  }

  // ── ADMIN DOMAIN (admin.kadobajo.id) ──

  // Root → redirect to dashboard or login
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(auth === 'true' ? '/dashboard' : '/login', req.url)
    );
  }

  // Protected routes → require auth
  if (ADMIN_PROTECTED.some(r => pathname.startsWith(r)) && auth !== 'true') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Already logged in → skip login page
  if (pathname === '/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Landing page on admin domain → redirect to dashboard/login
  // (admin subdomain should only serve admin UI)
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(auth === 'true' ? '/dashboard' : '/login', req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, public files
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)',
  ],
};
