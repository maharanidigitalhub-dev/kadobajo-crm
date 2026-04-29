import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@kadobajo.com';
const ADMIN_PASSWORD = '123456';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true });
      res.cookies.set('auth', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return res;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('auth', '', { maxAge: 0, path: '/' });
  return res;
}
