import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_role')?.value === 'admin';
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true, user: data[0] });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify({ active: false }),
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
