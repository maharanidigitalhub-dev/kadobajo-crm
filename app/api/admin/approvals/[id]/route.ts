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
  const role     = cookieStore.get('auth_role')?.value;
  const userId   = cookieStore.get('auth_id')?.value;
  const userName = cookieStore.get('auth_name')?.value;

  if (!['superadmin', 'manager'].includes(role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  let newStatus: string = body.status;
  if (!newStatus && body.action) {
    newStatus = body.action === 'approve' ? 'approved' : 'rejected';
  }
  if (!['approved', 'rejected'].includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const getRes = await fetch(
    `${SUPABASE_URL}/rest/v1/crm_approvals?id=eq.${id}&select=*`,
    { headers: H, cache: 'no-store' }
  );
  const approvals = await getRes.json();
  if (!approvals?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const approval = approvals[0];

  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_approvals?id=eq.${id}`, {
    method: 'PATCH',
    headers: H,
    body: JSON.stringify({
      status:        newStatus,
      reviewed_by:   userId,
      reviewer_name: userName,
      review_note:   body.review_note ?? null,
      updated_at:    new Date().toISOString(),
    }),
    cache: 'no-store',
  });
  if (!patchRes.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });

  if (newStatus === 'approved') {
    const { type, payload } = approval;
    if (type === 'status_change') {
      await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${payload.customer_id}`, {
        method: 'PATCH',
        headers: H,
        body: JSON.stringify({ status: payload.new_status ?? payload.to_status }),
        cache: 'no-store',
      });
    } else if ((type === 'lp_change' || type === 'cms_change') && payload.full_content) {
      await fetch(`${SUPABASE_URL}/rest/v1/cms_content`, {
        method: 'POST',
        headers: { ...H, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          id:         type === 'lp_change' ? 'lp_overrides' : 'homepage',
          content:    payload.full_content,
          updated_at: new Date().toISOString(),
        }),
        cache: 'no-store',
      });
    }
  }

  return NextResponse.json({ success: true, status: newStatus });
}
