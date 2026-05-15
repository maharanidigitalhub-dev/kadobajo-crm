import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_role')?.value === 'superadmin';
}

export async function GET() {
  if (!await requireSuperAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crm_users?select=id,email,name,role,active,avatar_url,created_at&order=created_at.asc`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await requireSuperAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { email, password, name, role } = await req.json();
  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  const allowed = ['superadmin', 'manager', 'admin', 'management'];
  if (!allowed.includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users`, {
    method: 'POST',
    headers: { ...H, Prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify({ email, password, name, role, active: true }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data?.message ?? 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true, user: Array.isArray(data) ? data[0] : data }, { status: 201 });
}
