import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCurrentUser, PERMISSIONS } from '@/lib/auth';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const serviceHeaders = () => ({
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
});

// GET — list semua users
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !PERMISSIONS.canManageUsers(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users?select=id,email,name,role,is_active,created_at,last_login&order=created_at.asc`,
      { headers: serviceHeaders(), cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[users GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — tambah user baru
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !PERMISSIONS.canManageUsers(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email, password, name, role } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users`,
      {
        method: 'POST',
        headers: serviceHeaders(),
        body: JSON.stringify({ email: email.toLowerCase().trim(), password_hash, name, role, is_active: true }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      if (err.includes('unique')) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data[0]);
  } catch (err) {
    console.error('[users POST]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
