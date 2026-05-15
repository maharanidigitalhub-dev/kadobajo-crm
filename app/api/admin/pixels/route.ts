import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=representation',
};

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_role')?.value === 'admin';
}

export async function GET() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cms_content?id=eq.pixels&select=content`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok || !data?.length) {
    return NextResponse.json({ pixels: [] });
  }
  return NextResponse.json(data[0].content ?? { pixels: [] });
}

export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cms_content`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      id: 'pixels',
      content: body,
      updated_at: new Date().toISOString(),
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: 'Failed to save', detail: err }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
