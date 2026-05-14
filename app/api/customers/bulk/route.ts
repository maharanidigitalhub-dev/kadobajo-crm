import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=ignore-duplicates,return=representation',
};

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (!['superadmin', 'manager', 'admin'].includes(role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { customers } = await req.json() as { customers: Record<string, unknown>[] };
  if (!Array.isArray(customers) || customers.length === 0) {
    return NextResponse.json({ error: 'Data kosong' }, { status: 400 });
  }
  if (customers.length > 500) {
    return NextResponse.json({ error: 'Maksimal 500 baris' }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify(customers),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: 'Import failed', detail: err }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json({ imported: Array.isArray(data) ? data.length : 0 }, { status: 201 });
}
