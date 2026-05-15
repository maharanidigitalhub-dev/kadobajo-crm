import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NOT SET';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'NOT SET';

  // Test actual Supabase connection
  let supabaseTest: { ok: boolean; status?: number; rows?: number; error?: string } = { ok: false };
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/customers?select=id&limit=1`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    });
    const body = await res.text();
    let parsed;
    try { parsed = JSON.parse(body); } catch { parsed = body; }
    supabaseTest = {
      ok: res.ok,
      status: res.status,
      rows: Array.isArray(parsed) ? parsed.length : undefined,
      error: !res.ok ? body : undefined,
    };
  } catch (e: unknown) {
    supabaseTest = { ok: false, error: e instanceof Error ? e.message : 'unknown' };
  }

  // Test insert
  let insertTest: { ok: boolean; status?: number; error?: string } = { ok: false };
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/customers`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        name: 'Debug Test',
        email: 'debug@test.com',
        phone: '62800000' + Date.now().toString().slice(-4),
        status: 'new',
        source: 'debug',
      }),
      cache: 'no-store',
    });
    const body = await res.text();
    insertTest = {
      ok: res.ok,
      status: res.status,
      error: !res.ok ? body : undefined,
    };
    // Clean up test data
    if (res.ok) {
      const inserted = JSON.parse(body);
      if (inserted[0]?.id) {
        await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${inserted[0].id}`, {
          method: 'DELETE',
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        });
      }
    }
  } catch (e: unknown) {
    insertTest = { ok: false, error: e instanceof Error ? e.message : 'unknown' };
  }

  return NextResponse.json({
    supabase_url: supabaseUrl.slice(0, 40) + '...',
    supabase_key_set: supabaseKey !== 'NOT SET',
    supabase_key_prefix: supabaseKey.slice(0, 20) + '...',
    read_test: supabaseTest,
    insert_test: insertTest,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
