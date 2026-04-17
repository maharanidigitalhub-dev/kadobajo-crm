import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const auth = req.cookies.get('auth')?.value;
  const { pathname } = req.nextUrl;

  const protectedPaths = ['/dashboard', '/customers'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && auth !== 'true') {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && auth === 'true') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/customers/:path*', '/login'],
};
