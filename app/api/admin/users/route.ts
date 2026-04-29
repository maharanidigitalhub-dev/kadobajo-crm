import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

async function requireAdmin() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  return role === 'admin';
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users?select=id,email,name,role,active,created_at&order=created_at.asc`, {
    headers: H, cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const { email, password, name, role } = body;
  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users`, {
    method: 'POST',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify({ email, password, name, role, active: true }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data?.message ?? 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true, user: data[0] }, { status: 201 });
}
