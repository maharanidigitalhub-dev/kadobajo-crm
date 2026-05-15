import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const BUCKET = 'cms-images'; // nama bucket di Supabase Storage

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validasi tipe & ukuran
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    // Buat nama file unik
    const ext = file.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${ext}`;

    // Upload ke Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: arrayBuffer,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[upload]', err);
      return NextResponse.json({ error: 'Upload failed', detail: err }, { status: 500 });
    }

    // Return public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error('[upload]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
