import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get('auth_id')?.value;
  if (!id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}&select=id,email,name,role,avatar_url,created_at`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok || !data?.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(data[0]);
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const id = cookieStore.get('auth_id')?.value;
  if (!id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const allowed: Record<string, unknown> = {};

  // Only allow safe fields
  if (body.name)       allowed.name       = body.name;
  if (body.avatar_url !== undefined) allowed.avatar_url = body.avatar_url;

  // Password change — verify old password first
  if (body.new_password) {
    if (!body.old_password) return NextResponse.json({ error: 'Old password required' }, { status: 400 });

    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}&select=password`,
      { headers: H, cache: 'no-store' }
    );
    const checkData = await checkRes.json();
    if (!checkData?.[0] || checkData[0].password !== body.old_password) {
      return NextResponse.json({ error: 'Password lama tidak sesuai' }, { status: 400 });
    }
    allowed.password = body.new_password;
  }

  if (!Object.keys(allowed).length) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_users?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify(allowed),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

  // Update name cookie if changed
  const response = NextResponse.json({ success: true, user: data[0] });
  if (body.name) {
    response.cookies.set('auth_name', body.name, {
      httpOnly: true, path: '/', maxAge: 60*60*24*7, sameSite: 'lax'
    });
  }
  return response;
}
