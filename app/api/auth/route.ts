import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_users?email=eq.${encodeURIComponent(email)}&active=eq.true&select=id,email,name,role,password`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: 'no-store',
      }
    );

    const users = await res.json();
    if (!res.ok || !users?.length) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, role: user.role, name: user.name });
    response.cookies.set('auth',      'true',      { httpOnly: true, path: '/', maxAge: 60*60*24*7, sameSite: 'lax' });
    response.cookies.set('auth_role', user.role,   { httpOnly: true, path: '/', maxAge: 60*60*24*7, sameSite: 'lax' });
    response.cookies.set('auth_name', user.name,   { httpOnly: true, path: '/', maxAge: 60*60*24*7, sameSite: 'lax' });
    response.cookies.set('auth_id',   user.id,     { httpOnly: true, path: '/', maxAge: 60*60*24*7, sameSite: 'lax' });
    return response;
  } catch (err) {
    console.error('[auth]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  ['auth','auth_role','auth_name','auth_id'].forEach(k =>
    res.cookies.set(k, '', { maxAge: 0, path: '/' })
  );
  return res;
}
