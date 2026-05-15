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

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
    method: 'PATCH',
    headers: H,
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true, customer: Array.isArray(data) ? data[0] : data });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
    method: 'DELETE',
    headers: H,
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
