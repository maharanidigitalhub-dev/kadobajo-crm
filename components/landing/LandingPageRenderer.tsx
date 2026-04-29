'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { LandingPageContent } from '@/lib/landing-pages';

const DEFAULT_WHATSAPP = '6282146970988';

interface Props {
  content: LandingPageContent;
}

export default function LandingPageRenderer({ content }: Props) {
  const [utm, setUtm] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', flight_date: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: p.get('utm_source') ?? '',
      utm_medium: p.get('utm_medium') ?? '',
      utm_campaign: p.get('utm_campaign') ?? '',
    });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sourceUrl = typeof window === 'undefined' ? '' : window.location.href;

  const formValid = useMemo(
    () => Boolean(form.name.trim() && form.phone.replace(/\D/g, '').length >= 9),
    [form]
  );

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'WhatsApp number is required';
    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          ...utm,
          source_slug: content.slug,
          audience_segment: content.audience,
          landing_url: sourceUrl,
        }),
      });
      setDone(true);
      window.setTimeout(() => {
        const msg = encodeURIComponent(
          `Hi Kado Bajo! I'm ${form.name} from ${form.country || 'abroad'} and I'd like to order souvenirs.${form.flight_date ? ` My flight is on ${form.flight_date}.` : ''}`
        );
        window.location.href = `https://wa.me/${DEFAULT_WHATSAPP}?text=${msg}`;
      }, 1200);
    } finally {
      setLoading(false);
    }
  }

  // ── Pull extra fields from content (new Supabase schema) with fallbacks ──
  const c = content as any;
  const problem      = c.problem ?? {};
  const pains        = problem.pains ?? [];
  const bridge       = problem.bridge ?? '';
  const solution     = problem.solution ?? 'The most complete NTT souvenir experience. Curated, packed, and waiting at Komodo Airport — before you even check in.';
  const problemTitle = problem.title ?? "You didn't come this far to leave with nothing worth keeping.";
  const problemLabel = problem.sectionLabel ?? 'Sound Familiar?';

  const howItWorks: Array<{step:string;title:string;desc:string}> = c.howItWorks ?? [
    { step:'01', title:'Order Online',         desc:"Fill in the form on this page. Tell us your flight date, budget, and who you're shopping for. Done in 2 minutes." },
    { step:'02', title:'We Prepare Everything',desc:'Your personal shopper selects, packs, and gift-wraps your entire order. You do nothing.' },
    { step:'03', title:'Pick Up at the Airport',desc:"Come to Kado Bajo at Komodo Airport before check-in. Grab your order. Fly home." },
  ];

  const midCta = c.midCta ?? {
    headline: 'Ready to order?',
    cta: content.finalCta.ctaText,
    sub: 'Free packing · Personal shopper included · All cards accepted',
  };

  const formCopy = c.form ?? {
    headline: content.finalCta.title,
    subheadline: "No payment now. Just tell us your flight date and what you're looking for.",
    cta: content.finalCta.ctaText,
    sub: 'No payment now · Personal shopper contacts you within a few hours · Free packing & gift wrap included',
  };

  const urgency: string  = (content.hero as any).urgency ?? '';
  const heroImage: string = content.hero.heroImage ?? '';

  // ── Hero background style ──
  const heroBg = heroImage
    ? { backgroundImage:`linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(${heroImage})`, backgroundSize:'cover', backgroundPosition:'center' }
    : {};
  const heroTextColor = heroImage ? 'white' : undefined;
  const heroEyebrowColor = heroImage ? 'rgba(255,255,255,0.85)' : undefined;
  const heroBadgeBorder  = heroImage ? 'rgba(255,255,255,0.35)' : undefined;
  const heroBadgeBg      = heroImage ? 'rgba(255,255,255,0.12)' : undefined;

  const stepColors = ['#2D3F8F', '#b8922a', '#2d5a3d'];

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", background:'#FFFFFF', color:'#1a1209', minHeight:'100vh', overflowX:'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="nav-logo">
          <Image src="/logo.png" alt="Kado Bajo" width={36} height={36} style={{ borderRadius:'50%', objectFit:'cover' }} />
          <span>Kado Bajo</span>
        </a>
        <div className="nav-right">
          <button className="nav-cta" onClick={scrollToForm}>Order Now →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" style={heroBg}>
        {/* Floating logo */}
        <div className="hero-logo fadeUp d1">
          <div className="logo-float">
            <div className="logo-pulse">
              <Image
                src="/logo.png"
                alt="Kado Bajo"
                width={160}
                height={160}
                className="hero-logo-img"
                style={{ borderRadius:'50%', objectFit:'cover' }}
              />
            </div>
          </div>
        </div>

        <p className="hero-eyebrow fadeUp d1" style={heroEyebrowColor ? { color:heroEyebrowColor } : {}}>
          {content.hero.eyebrow}
        </p>
        <h1 className="hero-h1 serif fadeUp d2" style={heroTextColor ? { color:heroTextColor } : {}}>
          {content.hero.headline}
        </h1>
        <p className="hero-sub fadeUp d2" style={heroTextColor ? { color:'rgba(255,255,255,0.85)' } : {}}>
          {content.hero.subheadline}
        </p>

        <button className="hero-cta fadeUp d3" onClick={scrollToForm}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          {content.hero.ctaText}
        </button>

        {urgency && (
          <p className="hero-urgency" style={heroTextColor ? { color:'rgba(255,255,255,0.9)' } : {}}>
            🕐 {urgency}
          </p>
        )}

        <div className="hero-badges">
          {['✓ Free packing & gift wrap','✓ Personal shopper included','✓ All major cards accepted'].map(b => (
            <span key={b} className="hero-badge" style={{
              borderColor: heroBadgeBorder,
              background: heroBadgeBg,
              color: heroTextColor,
            }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          {content.trust.map(t => (
            <div key={t.text} className="trust-item">
              <span className="trust-icon">{t.icon}</span>
              <div>
                <div className="trust-text">{t.text}</div>
                <div className="trust-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM → SOLUTION ── */}
      {pains.length > 0 && (
        <section className="section">
          <p className="section-label">{problemLabel}</p>
          <h2 className="section-title serif" style={{ maxWidth:560 }}>{problemTitle}</h2>
          <div className="problem-grid">
            <ul className="pain-list">
              {pains.map((p: string, i: number) => (
                <li key={i} className="pain-item">
                  <span className="pain-text">{p}</span>
                </li>
              ))}
            </ul>
            <div className="solution-box">
              {bridge && <h3>{bridge}</h3>}
              <p>{solution}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section className="section" style={{ textAlign:'center' }}>
          <p className="section-label">Simple Process</p>
          <h2 className="section-title serif" style={{ margin:'0 auto 40px' }}>How It Works</h2>
          <div className="steps-grid">
            {howItWorks.map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number" style={{ background: stepColors[i] ?? '#2D3F8F' }}>{s.step}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── BENEFITS ── */}
      <section className="section">
        <p className="section-label">Why Kado Bajo</p>
        <h2 className="section-title serif">What makes us different</h2>
        <div className="benefits-grid">
          {content.benefits.map((b, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon">{(b as any).icon ?? '✦'}</div>
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-desc">{b.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section className="section">
          <p className="section-label">What&apos;s Inside</p>
          <h2 className="section-title serif">Our curated collection</h2>
          <div className="products-grid">
            {content.productHighlights.map((p, i) => (
              <div key={i} className="product-card">
                <div className="product-icon">{(p as any).icon ?? '📦'}</div>
                <div className="product-title">{p.title}</div>
                <div className="product-desc">{p.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <p className="section-label">Reviews</p>
        <h2 className="section-title serif">What travellers say</h2>
        <div className="testimonials-grid">
          {content.testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-author">
                <span className="testimonial-flag">{(t as any).flag ?? '🌍'}</span>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-loc">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MID CTA ── */}
      <div className="mid-cta">
        <h3 className="serif">{midCta.headline}</h3>
        <button className="hero-cta" onClick={scrollToForm} style={{ margin:'0 auto' }}>
          {midCta.cta}
        </button>
        <p>{midCta.sub}</p>
      </div>

      {/* ── LEAD FORM ── */}
      <section className="section" id="lead-form">
        <div className="form-section" ref={formRef}>
          <div className="form-card">
            {/* Form header */}
            <div className="form-header">
              <Image src="/logo.png" alt="" width={56} height={56} style={{ borderRadius:'50%', objectFit:'cover', flexShrink:0, boxShadow:'0 0 0 2px rgba(255,255,255,0.2)' }} />
              <div className="form-header-text">
                <h2>{formCopy.headline}</h2>
                <p>{formCopy.subheadline}</p>
              </div>
            </div>

            <div className="form-body">
              {done ? (
                <div className="success-box">
                  <div className="success-check">
                    <svg width="28" height="28" fill="none" stroke="#10B981" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="serif" style={{ fontSize:20, color:'#111827', marginBottom:8 }}>You&apos;re all set!</h3>
                  <p style={{ color:'#6B7280', fontSize:14 }}>Redirecting you to WhatsApp to confirm your order…</p>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="form-row form-field">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input className={`form-input${errors.name ? ' error' : ''}`}
                        value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Your name" />
                      {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">Country</label>
                      <input className="form-input" value={form.country}
                        onChange={e => setForm({...form, country: e.target.value})} placeholder="Your country" />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
                  </div>

                  <div className="form-field">
                    <label className="form-label">WhatsApp Number *</label>
                    <input className={`form-input${errors.phone ? ' error' : ''}`}
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+62 xxx xxxx xxxx" />
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                    <p className="form-hint">Include country code (e.g. +62 for Indonesia)</p>
                  </div>

                  <div className="form-row form-field">
                    <div>
                      <label className="form-label">Flight Date from Komodo</label>
                      <input className="form-input" type="date" value={form.flight_date}
                        onChange={e => setForm({...form, flight_date: e.target.value})} />
                      <p className="form-hint">Optional — helps us prepare in time</p>
                    </div>
                    <div>
                      <label className="form-label">Anything Else?</label>
                      <textarea className="form-input" value={form.notes}
                        onChange={e => setForm({...form, notes: e.target.value})}
                        placeholder="Budget, occasion, who you're buying for…"
                        rows={3} style={{ resize:'vertical' }} />
                    </div>
                  </div>

                  <div className="form-note">
                    💡 Only fields marked * are required. More info helps your personal shopper curate a better selection.
                  </div>

                  <button type="submit" className="form-submit" disabled={loading || !formValid}>
                    {loading ? (
                      <><span className="spin" />Processing…</>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        {formCopy.cta}
                      </>
                    )}
                  </button>
                  <p className="form-trust">{formCopy.sub}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section className="section">
          <p className="section-label">FAQ</p>
          <h2 className="section-title serif">Questions? Answered.</h2>
          <div className="faq-list" style={{ maxWidth:680 }}>
            {content.faq.map((f, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.question}
                  <span className="faq-plus" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && <div className="faq-answer">{f.answer}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FINAL CTA ── */}
      <section className="section">
        <div className="final-cta">
          <h2>{content.finalCta.title}</h2>
          <p>{content.finalCta.description}</p>
          <button className="final-cta-btn" onClick={scrollToForm}>
            {content.finalCta.ctaText}
          </button>
          <p className="final-trust">
            {(content.finalCta as any).trust ?? '✓ Free packing · ✓ Personal shopper · ✓ All cards accepted'}
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              <Image src="/logo.png" alt="" width={32} height={32} style={{ borderRadius:'50%', objectFit:'cover' }} />
              <span>Kado Bajo</span>
            </div>
            <p className="footer-text">The most complete NTT souvenir experience — at Komodo Airport.</p>
          </div>
          <div>
            <p className="footer-title">Location</p>
            <p className="footer-text">Jl. Yohanes Sehadun, Labuan Bajo<br />Depan Bandara Komodo, NTT</p>
          </div>
          <div>
            <p className="footer-title">Contact</p>
            <a href={`https://wa.me/${DEFAULT_WHATSAPP}`} className="footer-wa">📱 +62 821 4697 0988</a>
          </div>
          <div>
            <p className="footer-title">Follow</p>
            <div className="footer-socials">
              <a href="#" className="footer-social">Instagram</a>
              <a href="#" className="footer-social">TikTok</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Kado Bajo. All rights reserved.</p>
          <a href="#" className="footer-legal">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
