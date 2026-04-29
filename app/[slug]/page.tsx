import { notFound } from 'next/navigation';
import { LP_DATA, VALID_SLUGS, type LPSlug } from '../lp/lp-data';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return VALID_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const slug = params.slug as LPSlug;
  if (!VALID_SLUGS.includes(slug)) return {};
  const lp = LP_DATA[slug];
  return {
    title: lp.meta.title,
    description: lp.meta.description,
  };
}

export default async function LandingPage({ params }: Props) {
  const slug = params.slug as LPSlug;
  if (!VALID_SLUGS.includes(slug)) notFound();

  // Ambil CMS overrides dari Supabase
  const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  let overrides: Record<string, any> = {};
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_content?id=eq.homepage&select=content`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: 'no-store',
      }
    );
    const data = await res.json();
    if (data?.[0]?.content?.lp_overrides?.[slug]) {
      overrides = data[0].content.lp_overrides[slug];
    }
  } catch {}

  const lp = LP_DATA[slug];

  // Helper: pakai override kalau ada, fallback ke LP_DATA
  function get(key: string, fallback: any) {
    return overrides[key] !== undefined ? overrides[key] : fallback;
  }

  const bgType     = get('hero_bg_type', 'gradient');
  const bgImageUrl = get('hero_bg_image_url', '');
  const bgOverlay  = get('hero_bg_overlay', 40);
  const bgColor    = get('hero_bg_color', '#F0F3FD');

  const heroBg =
    bgType === 'image' && bgImageUrl
      ? `url('${bgImageUrl}')`
      : bgType === 'color'
      ? bgColor
      : 'linear-gradient(160deg, #F0F3FD, #F8F9FF)';

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* HERO */}
      <section style={{
        background: heroBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        {bgType === 'image' && bgImageUrl && (
          <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${bgOverlay / 100})` }} />
        )}
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: bgType === 'image' ? '#fff' : '#6B7280', marginBottom: 16 }}>
            {get('hero_eyebrow', lp.hero.eyebrow)}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', color: bgType === 'image' ? '#fff' : '#111827', lineHeight: 1.2, marginBottom: 24 }}>
            {get('hero_headline', lp.hero.headline)}{' '}
            <em style={{ color: '#2D3F8F', fontStyle: 'normal' }}>{get('hero_headline_em', lp.hero.headlineEm)}</em>{' '}
            {get('hero_headline_end', lp.hero.headlineEnd)}
          </h1>
          <p style={{ fontSize: 18, color: bgType === 'image' ? 'rgba(255,255,255,0.9)' : '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
            {get('hero_subheadline', lp.hero.subheadline)}
          </p>
          <a href="/#form" style={{
            display: 'inline-block', padding: '16px 36px', borderRadius: 12,
            background: 'linear-gradient(135deg,#2D3F8F,#1B2A6B)',
            color: 'white', fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>
            {get('hero_cta', lp.hero.cta)}
          </a>
          <p style={{ marginTop: 16, fontSize: 13, color: bgType === 'image' ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>
            {get('hero_urgency', lp.hero.urgency)}
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {lp.benefits.map((b, i) => (
            <div key={i} style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: '#F8F9FF', padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: 'center', marginBottom: 40 }}>
            What Travellers Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {lp.testimonials.map((t, i) => (
              <div key={i} style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 16 }}>"{t.quote}"</p>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{t.flag} {t.name}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF' }}>{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '64px 24px', maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: 'center', marginBottom: 40 }}>FAQ</h2>
        {lp.faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 20, marginBottom: 20 }}>
            <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              {get(`faq_${i}_q`, faq.q)}
            </p>
            <p style={{ color: '#6B7280', lineHeight: 1.6 }}>
              {get(`faq_${i}_a`, faq.a)}
            </p>
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'linear-gradient(135deg,#2D3F8F,#1B2A6B)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: 'white', marginBottom: 16 }}>
          {get('final_cta_headline', lp.finalCta.headline)}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 32, fontSize: 16 }}>
          {get('final_cta_body', lp.finalCta.body)}
        </p>
        <a href="/#form" style={{
          display: 'inline-block', padding: '16px 36px', borderRadius: 12,
          background: 'white', color: '#2D3F8F', fontWeight: 700, fontSize: 16, textDecoration: 'none',
        }}>
          {lp.finalCta.cta}
        </a>
      </section>
    </main>
  );
}
