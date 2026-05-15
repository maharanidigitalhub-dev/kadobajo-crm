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

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await requireSuperAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.role !== undefined)      updates.role      = body.role;
  if (body.active !== undefined)    updates.active    = body.active;
  if (body.is_active !== undefined) updates.active    = body.is_active;
  if (!Object.keys(updates).length) return NextResponse.json({ error: 'No fields' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}`, {
    method: 'PATCH', headers: H, body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(Array.isArray(data) ? data[0] : data);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!await requireSuperAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}`, {
    method: 'PATCH', headers: H, body: JSON.stringify({ active: false }),
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
