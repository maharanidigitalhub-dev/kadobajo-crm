import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;

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
  matcher: ['/admin', '/admin/:path*'],
};
