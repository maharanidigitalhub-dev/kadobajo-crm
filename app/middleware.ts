import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get('auth')?.value;

  // All admin routes are under /admin/*
  // (admin.kadobajo.id/* gets rewritten to /admin/* by next.config.js)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // /admin or /admin/ → redirect to /admin/login or /admin/dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(
      new URL(auth === 'true' ? '/admin/dashboard' : '/admin/login', req.url)
    );
  }

  // Protect dashboard & customers
  if (
    (pathname.startsWith('/admin/dashboard') ||
      pathname.startsWith('/admin/customers') ||
      pathname.startsWith('/admin/cms')) &&
    auth !== 'true'
  ) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Already logged in → skip login page
  if (pathname === '/admin/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
