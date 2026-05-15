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

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const role   = cookieStore.get('auth_role')?.value;
  const userId = cookieStore.get('auth_id')?.value;
  if (!role || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type   = searchParams.get('type');
  const status = searchParams.get('status') ?? 'pending';

  let filter = '';
  if (status && status !== 'all') filter += `status=eq.${status}&`;
  if (type) filter += `type=eq.${type}&`;
  if (!['superadmin', 'manager'].includes(role)) {
    filter += `requested_by=eq.${userId}&`;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/crm_approvals?${filter}order=created_at.desc&select=*`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(Array.isArray(data) ? data : []);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const role     = cookieStore.get('auth_role')?.value;
  const userId   = cookieStore.get('auth_id')?.value;
  const userName = cookieStore.get('auth_name')?.value;
  if (!role || !userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, payload, requested_by } = await req.json();
  if (!type || !payload) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const autoApprove = ['superadmin', 'manager'].includes(role);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/crm_approvals`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      type,
      requested_by:   requested_by ?? userId,
      requester_name: userName,
      payload,
      status:         autoApprove ? 'approved' : 'pending',
      reviewed_by:    autoApprove ? userId : null,
      reviewer_name:  autoApprove ? userName : null,
    }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: 201 });
}
