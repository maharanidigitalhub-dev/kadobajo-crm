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

export async function GET() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/cms_content?id=eq.seo&select=content`,
    { headers: H, cache: 'no-store' }
  );
  const data = await res.json();
  if (!res.ok || !data?.length) return NextResponse.json(DEFAULT_SEO);
  return NextResponse.json({ ...DEFAULT_SEO, ...data[0].content });
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cms_content`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ id: 'seo', content: body, updated_at: new Date().toISOString() }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: 'Failed to save', detail: err }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

const DEFAULT_SEO = {
  site: {
    name: 'Kado Bajo',
    tagline: 'Authentic NTT Souvenirs at Komodo Airport',
    url: 'https://kadobajo.id',
    logo: '/logo.png',
    locale: 'en_US',
    themeColor: '#2D3F8F',
  },
  homepage: {
    title: 'Kado Bajo – Authentic NTT Souvenirs at Komodo Airport',
    description: 'Order curated East Nusa Tenggara gifts online. Personal shopper included. Pick up before your flight at Komodo Airport — zero stress.',
    keywords: 'kado bajo, souvenir labuan bajo, souvenir komodo, NTT souvenirs, komodo airport gifts, labuan bajo souvenir, tenun ikat NTT',
    ogImage: '/logo.png',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  social: {
    instagram: '',
    tiktok: '',
    facebook: '',
    twitter: '',
  },
  structured: {
    businessName: 'Kado Bajo',
    businessType: 'Store',
    address: 'Jl. Yohanes Sehadun, Labuan Bajo, NTT, Indonesia',
    phone: '+6282146970988',
    priceRange: '$$',
    openingHours: 'Mo-Su 06:00-22:00',
    geo: { lat: '-8.4897', lng: '119.8869' },
  },
  robots: {
    index: true,
    follow: true,
    noindexPaths: ['/admin', '/api'],
  },
};
