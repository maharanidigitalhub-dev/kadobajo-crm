import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

async function supabase(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers as Record<string, string>),
    },
    cache: 'no-store',
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, data: text ? JSON.parse(text) : null };
}

export async function GET() {
  const { ok, data } = await supabase('/cms_content?id=eq.homepage&select=content');
  if (!ok || !data?.length) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }
  return NextResponse.json(data[0].content, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Try update first
    const { ok, status, data } = await supabase(
      '/cms_content?id=eq.homepage',
      {
        method: 'PATCH',
        body: JSON.stringify({ content: body, updated_at: new Date().toISOString() }),
      }
    );

    if (!ok) {
      // If not found, insert
      if (status === 404 || (Array.isArray(data) && data.length === 0)) {
        const ins = await supabase('/cms_content', {
          method: 'POST',
          body: JSON.stringify({ id: 'homepage', content: body }),
        });
        if (!ins.ok) {
          return NextResponse.json({ error: 'Failed to create content', detail: ins.data }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Failed to save', detail: data }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[cms] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
