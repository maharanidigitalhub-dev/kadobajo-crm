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
  const { action, reviewed_by, note, status: bodyStatus } = await req.json();

  const newStatus = bodyStatus ?? (action === 'approve' ? 'approved' : 'rejected');
  if (!['approved', 'rejected'].includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // Get approval
  const getRes = await fetch(
    `${SUPABASE_URL}/rest/v1/crm_approvals?id=eq.${id}&select=*`,
    { headers: H, cache: 'no-store' }
  );
  const approvals = await getRes.json();
  if (!approvals?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const approval = approvals[0];

  // Update approval
  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_approvals?id=eq.${id}`, {
    method: 'PATCH',
    headers: H,
    body: JSON.stringify({
      status:        newStatus,
      reviewed_by:   reviewed_by ?? userId,
      reviewer_name: userName,
      review_note:   note ?? null,
      updated_at:    new Date().toISOString(),
    }),
    cache: 'no-store',
  });
  if (!patchRes.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });

  // Apply change if approved
  if (newStatus === 'approved') {
    const { type, payload } = approval;
    if (type === 'status_change' || type === 'customer') {
      await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${payload.customer_id ?? payload.id}`, {
        method: 'PATCH', headers: H,
        body: JSON.stringify({
          status:         payload.new_status ?? payload.status ?? payload.to_status,
          status_pending: false,
          pending_status: null,
          chat_photo_url: payload.chat_photo_url ?? null,
        }),
        cache: 'no-store',
      });
    } else if ((type === 'lp_change' || type === 'lp') && payload.full_content) {
      await fetch(`${SUPABASE_URL}/rest/v1/cms_content`, {
        method: 'POST',
        headers: { ...H, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ id: 'lp_overrides', content: payload.full_content, updated_at: new Date().toISOString() }),
        cache: 'no-store',
      });
    } else if ((type === 'cms_change' || type === 'cms') && payload.full_content) {
      await fetch(`${SUPABASE_URL}/rest/v1/cms_content`, {
        method: 'POST',
        headers: { ...H, Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ id: 'homepage', content: payload.full_content, updated_at: new Date().toISOString() }),
        cache: 'no-store',
      });
    }
  }

  return NextResponse.json({ success: true, status: newStatus });
}
