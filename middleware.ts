import { NextRequest, NextResponse } from 'next/server';

type Role = 'superadmin' | 'manager' | 'admin' | 'management';

const ROLE_ACCESS: Record<string, Role[]> = {
  '/admin/dashboard':  ['superadmin','manager','admin','management'],
  '/admin/customers':  ['superadmin','manager','admin','management'],
  '/admin/cms':        ['superadmin','manager','admin'],
  '/admin/pixels':     ['superadmin','manager'],
  '/admin/seo':        ['superadmin','manager'],
  '/admin/users':      ['superadmin'],
  '/admin/approvals':  ['superadmin','manager'],
  '/admin/settings':   ['superadmin','manager','admin','management'],
};

// CRM routes (non-admin domain): /dashboard, /customers, /approval, /users, /cms
const CRM_PROTECTED_PREFIXES = ['/dashboard', '/customers', '/approval', '/users', '/cms'];

function canAccess(path: string, role: Role): boolean {
  // superadmin bypasses all restrictions
  if (role === 'superadmin') return true;
  const match = Object.keys(ROLE_ACCESS).find(p => path.startsWith(p));
  if (!match) return true;
  return ROLE_ACCESS[match].includes(role);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;
  const role = (req.cookies.get('auth_role')?.value ?? 'management') as Role;

  const xHost = req.headers.get('x-forwarded-host') ?? '';
  const host  = req.headers.get('host') ?? '';
  const isAdminDomain = xHost.includes('admin.') || host.includes('admin.');

  if (isAdminDomain && !pathname.startsWith('/admin') && !pathname.startsWith('/api') &&
      !pathname.match(/\.(png|jpg|ico|svg|webp|css|js)$/)) {
    return NextResponse.redirect(new URL(auth === 'true' ? '/admin/dashboard' : '/admin/login', req.url));
  }

  // BUGFIX: Protect CRM routes (app/(crm)/) dari akses tanpa login
  const isCRMRoute = CRM_PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (isCRMRoute && auth !== 'true') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!pathname.startsWith('/admin')) return NextResponse.next();

  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL(auth === 'true' ? '/admin/dashboard' : '/admin/login', req.url));
  }

  if (pathname === '/admin/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  if (pathname !== '/admin/login' && auth !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (auth === 'true' && !canAccess(pathname, role)) {
    return NextResponse.redirect(new URL('/admin/dashboard?error=forbidden', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|api/).*)',],
};
