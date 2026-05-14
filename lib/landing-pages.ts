export const LANDING_SLUGS = ['lp', 'lp-2', 'lp-3', 'lp-4', 'lp-5'] as const;
export type LandingSlug = (typeof LANDING_SLUGS)[number];

export type LandingStatus = 'draft' | 'live';

export interface LandingPageContent {
  slug: LandingSlug;
  audience: string;
  status: LandingStatus;
  title: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaUrl: string;
    heroImage: string;
  };
  trust: Array<{ icon: string; text: string; sub: string }>;
  benefits: Array<{ title: string; description: string }>;
  productHighlights: Array<{ title: string; description: string }>;
  testimonials: Array<{ name: string; location: string; quote: string }>;
  faq: Array<{ question: string; answer: string }>;
  finalCta: {
    title: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
  };
}

export interface LandingPageRecord {
  slug: LandingSlug;
  audience: string;
  title: string;
  status: LandingStatus;
  updated_at: string;
  content: LandingPageContent;
}

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

const AUDIENCE_MAP: Record<LandingSlug, string> = {
  lp: 'primary / premium / global',
  'lp-2': 'SEA audience',
  'lp-3': 'AUS/NZ audience',
  'lp-4': 'China audience',
  'lp-5': 'Indonesia audience',
};

function defaultLandingContent(slug: LandingSlug): LandingPageContent {
  const audience = AUDIENCE_MAP[slug];
  const regionHeadline: Record<LandingSlug, string> = {
    lp: 'Premium Gifts from East Nusa Tenggara, Ready at Komodo Airport',
    'lp-2': 'SEA Travellers: Fast Airport Pickup for Authentic NTT Souvenirs',
    'lp-3': 'Australia & NZ Travellers: Curated NTT Gifts, Zero Shopping Stress',
    'lp-4': 'China Market: Trusted NTT Souvenir Concierge Before Departure',
    'lp-5': 'Indonesia Travellers: Oleh-oleh NTT Premium Siap Ambil di Bandara',
  };

  return {
    slug,
    audience,
    status: 'live',
    title: `Kado Bajo ${slug.toUpperCase()} Landing Page`,
    seo: {
      metaTitle: `Kado Bajo ${slug.toUpperCase()} | Komodo Airport Souvenirs`,
      metaDescription: 'Order curated East Nusa Tenggara gifts online and pick up before check-in at Komodo Airport.',
      ogImage: '/logo.png',
    },
    hero: {
      eyebrow: 'Komodo Airport · Labuan Bajo',
      headline: regionHeadline[slug],
      subheadline: 'Order in minutes. Our personal shopper prepares everything. Pick up before your flight.',
      ctaText: 'Reserve My Gifts Now',
      ctaUrl: '#lead-form',
      heroImage: '',
    },
    trust: [
      { icon: '🌍', text: '30+ Countries', sub: 'Trusted by global travellers' },
      { icon: '⭐', text: '5-Star Rated', sub: 'Loved by returning buyers' },
      { icon: '✈️', text: 'Airport Pickup', sub: 'Before check-in counters' },
    ],
    benefits: [
      { title: 'Curated Authentic Products', description: 'Handpicked products from local artisans across NTT.' },
      { title: 'Airport Convenience', description: 'Pickup at Komodo Airport without luggage hassle.' },
      { title: 'Personal Shopper Included', description: 'Tell us your budget and we curate the right gift mix.' },
    ],
    productHighlights: [
      { title: 'Tenun & Songke', description: 'Traditional fabrics woven by Flores communities.' },
      { title: 'Artisan Coffee', description: 'Single-origin beans from local highlands.' },
      { title: 'Local Signature Snacks', description: 'Travel-safe packaging for gift-ready items.' },
    ],
    testimonials: [
      { name: 'Sarah M.', location: 'Australia', quote: 'Smooth ordering and amazing quality. Perfect airport pickup.' },
      { name: 'Wei L.', location: 'China', quote: 'Fast response and very professional gift preparation.' },
    ],
    faq: [
      { question: 'How soon should I order?', answer: 'Ideally 24 hours before departure for best availability.' },
      { question: 'Where do I pick up?', answer: 'At Kado Bajo store in front of Komodo Airport check-in area.' },
    ],
    finalCta: {
      title: 'Ready to secure your gifts?',
      description: 'Submit your details and our team will assist your order flow quickly.',
      ctaText: 'Start My Order',
      ctaUrl: '#lead-form',
    },
  };
}

function headers(prefer = 'return=representation') {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: prefer,
  };
}

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase env vars are not configured');
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      ...headers(),
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(json?.message ?? json?.error_description ?? res.statusText);
  }

  return json as T;
}

export async function ensureLandingPageSeeds() {
  for (const slug of LANDING_SLUGS) {
    await upsertLandingPage(defaultLandingContent(slug));
  }
}

export async function getLandingPages(): Promise<LandingPageRecord[]> {
  await ensureLandingPageSeeds();
  const rows = await rest<LandingPageRecord[]>('/landing_pages?select=*&order=updated_at.desc');
  return rows;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageRecord | null> {
  if (!LANDING_SLUGS.includes(slug as LandingSlug)) return null;
  await ensureLandingPageSeeds();
  const rows = await rest<LandingPageRecord[]>(`/landing_pages?slug=eq.${encodeURIComponent(slug)}&select=*`);
  return rows[0] ?? null;
}

export async function upsertLandingPage(content: LandingPageContent): Promise<LandingPageRecord> {
  const payload = {
    slug: content.slug,
    audience: content.audience,
    title: content.title,
    status: content.status,
    content,
    updated_at: new Date().toISOString(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/landing_pages`, {
    method: 'POST',
    cache: 'no-store',
    headers: headers('resolution=merge-duplicates,return=representation,on_conflict=slug'),
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(json?.message ?? json?.error_description ?? 'Failed to upsert landing page');
  }

  return (Array.isArray(json) ? json[0] : json) as LandingPageRecord;
}

export function buildDefaultLandingContent(slug: LandingSlug): LandingPageContent {
  return defaultLandingContent(slug);
}
