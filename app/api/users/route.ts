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
    // BUGFIX: Tambahkan alias active:is_active agar nama field konsisten dengan AppUser interface
    `${SUPABASE_URL}/rest/v1/crm_users?select=id,name,email,role,active,created_at&order=created_at.desc`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  // BUGFIX: DB pakai kolom 'active', UI/AppUser pakai 'is_active' — map di sini
  const mapped = Array.isArray(data)
    ? data.map((u: Record<string, unknown>) => ({ ...u, is_active: u.active }))
    : data;
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  if (!await requireSuperAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { name, email, password, role } = await req.json();
  const allowed = ['admin', 'manager', 'management', 'superadmin'];
  if (!allowed.includes(role)) return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users`, {
    method: 'POST',
    headers: { ...H, Prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify({ name, email, password, role, active: true }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data?.message ?? 'Failed' }, { status: 500 });
  return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: 201 });
}
