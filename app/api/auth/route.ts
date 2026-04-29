import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, updateLastLogin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // Cari user di Supabase
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    // Verifikasi password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    // Update last login
    await updateLastLogin(user.id);

    // Set cookies
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    const cookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    };

    res.cookies.set('auth', 'true', cookieOpts);
    res.cookies.set('user_id', user.id, cookieOpts);
    res.cookies.set('user_role', user.role, cookieOpts);
    res.cookies.set('user_name', user.name, cookieOpts);

    return res;
  } catch (err) {
    console.error('[auth POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('auth');
  res.cookies.delete('user_id');
  res.cookies.delete('user_role');
  res.cookies.delete('user_name');
  return res;
}
