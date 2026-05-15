import type { Metadata } from 'next';
import './globals.css';
import PixelScripts from '@/components/PixelScripts';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

async function getSEO() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_content?id=eq.seo&select=content`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: 'no-store',
      }
    );
    const data = await res.json();
    return data?.[0]?.content ?? null;
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  const s = seo?.site ?? {};
  const h = seo?.homepage ?? {};
  const social = seo?.social ?? {};
  const siteUrl = s.url ?? 'https://kadobajo.id';

  return {
    title: {
      default: h.title ?? 'Kado Bajo – Authentic NTT Souvenirs at Komodo Airport',
      template: `%s | ${s.name ?? 'Kado Bajo'}`,
    },
    description: h.description ?? 'Order curated East Nusa Tenggara gifts online. Personal shopper included. Pick up before your flight at Komodo Airport.',
    keywords: h.keywords ?? 'kado bajo, souvenir labuan bajo, NTT souvenirs, komodo airport',
    authors: [{ name: s.name ?? 'Kado Bajo', url: siteUrl }],
    creator: s.name ?? 'Kado Bajo',
    metadataBase: new URL(siteUrl),
    alternates: { canonical: siteUrl },
    robots: {
      index: seo?.robots?.index ?? true,
      follow: seo?.robots?.follow ?? true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: s.name ?? 'Kado Bajo',
      title: h.title ?? 'Kado Bajo – Authentic NTT Souvenirs at Komodo Airport',
      description: h.description ?? 'Order curated East Nusa Tenggara gifts online.',
      locale: s.locale ?? 'en_US',
      images: [{
        url: h.ogImage ?? '/logo.png',
        width: 1200, height: 630,
        alt: s.name ?? 'Kado Bajo',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: h.title ?? 'Kado Bajo',
      description: h.description ?? 'Authentic NTT Souvenirs at Komodo Airport',
      images: [h.ogImage ?? '/logo.png'],
      site: social.twitter ? `@${social.twitter}` : undefined,
    },
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
    verification: {
      google: seo?.verification?.google ?? undefined,
    },
  };
}

async function getStructuredData() {
  const seo = await getSEO();
  if (!seo?.structured) return null;
  const s = seo.structured;
  const site = seo.site ?? {};
  return {
    '@context': 'https://schema.org',
    '@type': s.businessType ?? 'Store',
    name: s.businessName ?? 'Kado Bajo',
    url: site.url ?? 'https://kadobajo.id',
    logo: `${site.url ?? 'https://kadobajo.id'}/logo.png`,
    telephone: s.phone ?? '+6282146970988',
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address ?? 'Jl. Yohanes Sehadun, Labuan Bajo',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: s.geo?.lat ?? '-8.4897',
      longitude: s.geo?.lng ?? '119.8869',
    },
    openingHours: s.openingHours ?? 'Mo-Su 06:00-22:00',
    priceRange: s.priceRange ?? '$$',
    sameAs: Object.values(seo.social ?? {}).filter(Boolean),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = await getStructuredData();
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <PixelScripts />
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
