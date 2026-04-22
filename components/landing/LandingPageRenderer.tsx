'use client';

import { useEffect, useMemo, useState } from 'react';
import { LandingPageContent } from '@/lib/landing-pages';

const DEFAULT_WHATSAPP = '6282146970988';

interface Props {
  content: LandingPageContent;
}

export default function LandingPageRenderer({ content }: Props) {
  const [utm, setUtm] = useState({ utm_source: '', utm_medium: '', utm_campaign: '' });
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: p.get('utm_source') ?? '',
      utm_medium: p.get('utm_medium') ?? '',
      utm_campaign: p.get('utm_campaign') ?? '',
    });
  }, []);

  const sourceUrl = typeof window === 'undefined' ? '' : window.location.href;

  const formValid = useMemo(
    () => Boolean(form.name.trim() && form.phone.replace(/\D/g, '').length >= 9),
    [form]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;

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
        window.location.href = `https://wa.me/${DEFAULT_WHATSAPP}?text=Hi%20Kado%20Bajo,%20I%20came%20from%20${encodeURIComponent(content.slug)}%20and%20want%20to%20order.`;
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1209]">
      <section className="hero" style={content.hero.heroImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url(${content.hero.heroImage})`, backgroundSize: 'cover' } : {}}>
        <p className="hero-eyebrow">{content.hero.eyebrow}</p>
        <h1 className="hero-h1">{content.hero.headline}</h1>
        <p className="hero-sub">{content.hero.subheadline}</p>
        <a href={content.hero.ctaUrl} className="hero-cta">{content.hero.ctaText}</a>
      </section>

      <div className="trust-bar">
        <div className="trust-bar-inner">
          {content.trust.map((item) => (
            <div key={item.text} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <div>
                <div className="trust-text">{item.text}</div>
                <div className="trust-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <p className="section-label">Benefits</p>
        <h2 className="section-title">Why this audience converts</h2>
        <div className="benefits-grid">
          {content.benefits.map((b) => (
            <div key={b.title} className="benefit-card">
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-desc">{b.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section-label">Product highlights</p>
        <div className="products-grid">
          {content.productHighlights.map((p) => (
            <div key={p.title} className="product-card">
              <div className="product-title">{p.title}</div>
              <div className="product-desc">{p.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section-label">Testimonials</p>
        <div className="testimonials-grid">
          {content.testimonials.map((t) => (
            <div key={`${t.name}-${t.location}`} className="testimonial-card">
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testimonial-name">{t.name}</div>
              <div className="testimonial-loc">{t.location}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section-label">FAQ</p>
        <div className="faq-list">
          {content.faq.map((f) => (
            <div key={f.question} className="faq-item">
              <div className="faq-question">{f.question}</div>
              <div className="faq-answer">{f.answer}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm" id="lead-form">
        <div className="final-cta">
          <h2>{content.finalCta.title}</h2>
          <p>{content.finalCta.description}</p>
          {done ? (
            <p className="text-white">Thanks! Redirecting to WhatsApp…</p>
          ) : (
            <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-3 text-left">
              <input className="form-input" placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <input className="form-input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
              <input className="form-input" placeholder="WhatsApp" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              <button className="final-cta-btn" type="submit" disabled={loading || !formValid}>
                {loading ? 'Submitting...' : content.finalCta.ctaText}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
