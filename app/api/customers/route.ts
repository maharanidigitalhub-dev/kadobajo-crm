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

async function requireAuth() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  return ['superadmin', 'manager', 'admin'].includes(role ?? '');
}

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.desc`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const contentType = req.headers.get('content-type') ?? '';
  let customerData: Record<string, unknown> = {};
  let chatPhotoUrl: string | undefined;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('chat_photo') as File | null;

    if (file && file.size > 0) {
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Ukuran foto maksimal 2MB' }, { status: 400 });
      }
      const filename = `${Date.now()}-${file.name}`;
      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/chat-photos/${filename}`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': file.type,
            'x-upsert': 'false',
          },
          body: await file.arrayBuffer(),
        }
      );
      if (uploadRes.ok) {
        chatPhotoUrl = `${SUPABASE_URL}/storage/v1/object/public/chat-photos/${filename}`;
      }
    }

    form.forEach((val, key) => {
      if (key !== 'chat_photo') customerData[key] = String(val);
    });
  } else {
    customerData = await req.json();
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ ...customerData, chat_photo_url: chatPhotoUrl }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: 'Failed', detail: data }, { status: 500 });
  return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: 201 });
}
