import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const headers = () => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=representation',
});

export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_content?id=eq.homepage&select=content`,
      { headers: headers(), cache: 'no-store' }
    );
    const data = await res.json();
    if (!res.ok || !data?.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(data[0].content, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('[cms GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/cms_content`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        id: 'homepage',
        content: body,
        updated_at: new Date().toISOString(),
      }),
      cache: 'no-store',
    });

    const text = await res.text();
    console.log('[cms PUT] status:', res.status, 'body:', text.slice(0, 200));

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to save', detail: text }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[cms PUT]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
