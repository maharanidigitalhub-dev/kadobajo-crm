import { NextRequest, NextResponse } from 'next/server';

type Role = 'admin' | 'manager' | 'sales' | 'viewer';

const ROLE_ACCESS: Record<string, Role[]> = {
  '/admin/dashboard':  ['admin', 'manager', 'sales', 'viewer'],
  '/admin/customers':  ['admin', 'manager', 'sales', 'viewer'],
  '/admin/cms':        ['admin'],
  '/admin/users':      ['admin'],
};

function canAccess(path: string, role: Role): boolean {
  const match = Object.keys(ROLE_ACCESS).find(p => path.startsWith(p));
  if (!match) return true;
  return ROLE_ACCESS[match].includes(role);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;
  const role = (req.cookies.get('auth_role')?.value ?? 'viewer') as Role;

  // Detect admin subdomain
  const xHost = req.headers.get('x-forwarded-host') ?? '';
  const host  = req.headers.get('host') ?? '';
  const isAdminDomain = xHost.includes('admin.') || host.includes('admin.');

  if (isAdminDomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.match(/\.(png|jpg|ico|svg|webp|css|js)$/)) {
    return NextResponse.redirect(new URL(auth === 'true' ? '/admin/dashboard' : '/admin/login', req.url));
  }

  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Root redirect
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL(auth === 'true' ? '/admin/dashboard' : '/admin/login', req.url));
  }

  // Require auth
  if (pathname !== '/admin/login' && auth !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Already logged in → skip login
  if (pathname === '/admin/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  // Role-based access
  if (auth === 'true' && !canAccess(pathname, role)) {
    return NextResponse.redirect(new URL('/admin/dashboard?error=forbidden', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)',],
};
