'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '6281234567890';

const COUNTRIES = [
  { code: 'AU', name: 'Australia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'CA', name: 'Canada' },
  { code: 'OTHER', name: 'Other' },
];

const PRODUCTS = [
  { icon: '🧵', title: 'Tenun Ikat & Songke', desc: 'Handwoven traditional cloth. Manggarai & Flores motifs. Each piece unique — made by local weavers.' },
  { icon: '☕', title: 'Artisan Coffee', desc: 'Single-origin Flores & NTT highland coffee. Roasted locally. Available in beans or ground.' },
  { icon: '🍯', title: 'Wild Forest Honey', desc: 'Raw, unfiltered honey from NTT forests. No additives. Traceable origin.' },
  { icon: '🦎', title: 'Komodo Carvings', desc: 'Hand-carved wood figures. Local artisans. Various sizes — from keychains to display pieces.' },
  { icon: '💎', title: 'Pearls & Jewellery', desc: 'Freshwater pearls and handmade jewellery from local craftspeople.' },
  { icon: '🍪', title: 'Local Snacks', desc: 'Kompiang, Pia Bajo, processed fish, local spices — authentic NTT flavours, packaged for travel.' },
];

const TESTIMONIALS = [
  { flag: '🇦🇺', name: 'Matt D.', location: 'Melbourne, Australia', quote: "The best souvenir shopping I've ever had. Ordered the night before, picked up at the airport — beautifully packed, incredible quality. Wish this existed everywhere." },
  { flag: '🇸🇬', name: 'Priya S.', location: 'Singapore', quote: "The ikat cloth I got is absolutely stunning — I've had so many compliments. The airport pickup was genius. Nothing compared to the souvenirs here." },
  { flag: '🇩🇪', name: 'Klara V.', location: 'Berlin, Germany', quote: "Found things here I couldn't find anywhere else in Labuan Bajo. Felt like I was supporting real local craftspeople, not a tourist trap." },
];

const FAQS = [
  { q: 'When do I need to order by?', a: 'At least 24 hours before your flight. For same-day availability, please contact us directly.' },
  { q: 'Where exactly do I pick up?', a: 'At the Kado Bajo store, directly in front of Komodo Airport (Bandara Komodo), before the check-in counters.' },
  { q: "What if I don't know what to buy?", a: "Tell us your budget and who you're shopping for — we'll curate the perfect selection. Completely free." },
  { q: 'Is professional packing really included?', a: 'Yes. All orders include professional packing and gift wrapping. Fragile items receive extra protective packaging.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major international cards (Visa, Mastercard) and IDR cash.' },
  { q: 'Do you ship internationally?', a: 'Our primary service is airport pickup. For international shipping inquiries, please contact us directly via WhatsApp.' },
];

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', flight_date: '', notes: '' });
  const [utmParams, setUtmParams] = useState({ utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Capture UTM params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      utm_content: params.get('utm_content') ?? '',
    });
  }, []);

  // Sticky navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'WhatsApp number is required';
    else if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...utmParams }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Kado%20Bajo!%20I%27m%20${encodeURIComponent(form.name)}%20from%20${encodeURIComponent(form.country || 'abroad')}%20and%20I%27d%20like%20to%20order%20souvenirs.${form.flight_date ? `%20My%20flight%20is%20on%20${encodeURIComponent(form.flight_date)}.` : ''}`;
        }, 1200);
      }
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: '#fff', color: '#1a1209', minHeight: '100vh' }}>
{/* ── 1. NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo">
          <img src="/logo.png" alt="Kado Bajo" />
          <span>Kado Bajo</span>
        </a>
        <div className="nav-right">
          <button className="hero-cta nav-cta" onClick={scrollToForm}>Order Now →</button>
          <Link href="https://admin.kadobajo.id/login" className="nav-admin">Admin</Link>
        </div>
      </nav>

      {/* ── 2. HERO ── */}
      <section className="hero">
        <div className="hero-logo">
          <div className="logo-float">
            <div className="logo-pulse">
              <img src="/logo.png" alt="Kado Bajo Logo" className="hero-logo-img" />
            </div>
          </div>
        </div>

        <p className="hero-eyebrow fadeUp d1">Komodo Airport · Labuan Bajo · NTT</p>

        <h1 className="hero-h1 fadeUp d2">
          The Best of East Nusa Tenggara —{' '}
          <em>Ready at Komodo Airport</em>{' '}
          Before You Fly Home
        </h1>

        <p className="hero-sub fadeUp d2">
          Order online. Your personal shopper prepares everything. Pick up right before check-in — zero stress, zero luggage hassle.
        </p>

        <button className="hero-cta fadeUp d3" onClick={scrollToForm}>
          Reserve My Gifts Now →
        </button>

        <p className="hero-urgency">⏰ Order before your flight. We'll have everything packed and ready at the airport.</p>

        <div className="hero-badges">
          {['✓ Free packing & gift wrap', '✓ Personal shopper included', '✓ All major cards accepted'].map(b => (
            <span key={b} className="hero-badge">{b}</span>
          ))}
        </div>
      </section>

      {/* ── 3. TRUST BAR ── */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          {[
            { icon: '🌍', text: '30+ Countries', sub: 'Trusted by travellers worldwide' },
            { icon: '⭐', text: '5-Star Rated', sub: 'Tripadvisor & Google' },
            { icon: '✈️', text: 'Right at Komodo Airport', sub: 'Before check-in counters' },
            { icon: '🎁', text: 'Personal Shopper — Free', sub: 'No other souvenir shop has this' },
          ].map(t => (
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

      {/* ── 4. PROBLEM → SOLUTION ── */}
      <div className="section">
        <div className="problem-grid">
          <div>
            <p className="section-label">Sound familiar?</p>
            <h2 className="section-title">The Souvenir Problem Every Traveller Knows</h2>
            <ul className="pain-list" style={{ marginTop: 24 }}>
              {[
                'No time to shop properly after a packed Komodo itinerary',
                'Souvenir shops with limited selection and inconsistent quality',
                'Buying something at the last minute and regretting it on the plane',
              ].map(pain => (
                <li key={pain} className="pain-item">
                  <span className="pain-x">✕</span>
                  <span className="pain-text">{pain}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="solution-box">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>That's exactly what Kado Bajo exists to fix.</p>
            <h3>The most complete NTT souvenir experience.</h3>
            <p>Curated, packed, and waiting at Komodo Airport — before you even check in. You shop in 2 minutes. We handle everything else.</p>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── 5. HOW IT WORKS ── */}
      <div className="section">
        <p className="section-label" style={{ textAlign: 'center' }}>Simple process</p>
        <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto 40px', maxWidth: 520 }}>How It Works in 3 Steps</h2>
        <div className="steps-grid">
          <div className="step-card" style={{ borderTop: '3px solid var(--terracotta)' }}>
            <div className="step-number" style={{ background: 'var(--terracotta)' }}>①</div>
            <div className="step-title">Order Online</div>
            <div className="step-desc">Fill the form below. Tell us your flight date, budget, and who you're buying for. Done in 2 minutes.</div>
          </div>
          <div className="step-card" style={{ borderTop: '3px solid var(--gold)' }}>
            <div className="step-number" style={{ background: 'var(--gold)' }}>②</div>
            <div className="step-title">We Prepare Everything</div>
            <div className="step-desc">Your personal shopper selects, packs, and gift-wraps your entire order. You don't need to do anything.</div>
          </div>
          <div className="step-card" style={{ borderTop: '3px solid #2d5a3d' }}>
            <div className="step-number" style={{ background: '#2d5a3d' }}>③</div>
            <div className="step-title">Pick Up at the Airport</div>
            <div className="step-desc">Come to Kado Bajo store in front of Komodo Airport before check-in. Collect your order. Fly home.</div>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── 6. BENEFITS ── */}
      <div className="section">
        <p className="section-label">Why Kado Bajo</p>
        <h2 className="section-title" style={{ marginBottom: 32 }}>Everything You Need. Nothing You Don't.</h2>
        <div className="benefits-grid">
          {[
            { icon: '🎁', title: 'The Most Complete NTT Collection', desc: 'Handwoven Songke & Tenun ikat, Komodo wood carvings, artisan coffee, forest honey, freshwater pearls — all curated, authentic, from East Nusa Tenggara.' },
            { icon: '✈️', title: 'Airport Pickup. No Luggage Chaos.', desc: 'Order online. We select, pack and gift-wrap your items. Pick everything up right before check-in at Komodo Airport. Your suitcase stays untouched.' },
            { icon: '⭐', title: 'Personal Shopper — Free', desc: "Not sure what to get? Tell us who you're buying for — your mum, your best friend, your boss — and we'll curate the perfect selection." },
            { icon: '📦', title: 'Zero Damage. Professional Packing.', desc: "Fragile ceramics? Delicate textiles? We've packed thousands of NTT souvenirs for international flights. Everything arrives home intact, beautiful, ready to gift." },
            { icon: '🤝', title: 'Real Craft. Real Communities.', desc: 'From the weavers of Flores to the honey farmers of Timor — every product connects you directly to the people of East Nusa Tenggara.' },
          ].map(b => (
            <div key={b.title} className="benefit-card">
              <div className="benefit-icon">{b.icon}</div>
              <div className="benefit-title">{b.title}</div>
              <div className="benefit-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* ── 7. PRODUCT SHOWCASE ── */}
      <div className="section">
        <p className="section-label">What's inside</p>
        <h2 className="section-title" style={{ marginBottom: 8 }}>Curated from Across East Nusa Tenggara</h2>
        <p className="section-sub" style={{ marginBottom: 36 }}>Not generic souvenirs. Real products from real people — with stories worth sharing.</p>
        <div className="products-grid">
          {PRODUCTS.map(p => (
            <div key={p.title} className="product-card">
              <div className="product-icon">{p.icon}</div>
              <div className="product-title">{p.title}</div>
              <div className="product-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* ── 8. TESTIMONIALS ── */}
      <div className="section">
        <p className="section-label">What travellers say</p>
        <h2 className="section-title" style={{ marginBottom: 8 }}>From 30+ Countries Around the World</h2>
        <p className="section-sub" style={{ marginBottom: 36 }}>Real experiences. Real names. Real countries.</p>
        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <span className="testimonial-flag">{t.flag}</span>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-loc">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 9. MID-PAGE CTA ── */}
      <div className="mid-cta">
        <h3>Ready to order?</h3>
        <button className="hero-cta" onClick={scrollToForm} style={{ marginBottom: 0 }}>
          Order Now — Pick Up at Komodo Airport →
        </button>
        <p>Free packing · Personal shopper included · All cards accepted</p>
      </div>

      {/* ── 10. LEAD CAPTURE FORM ── */}
      <div className="section" id="form" ref={formRef}>
        <div className="form-section">
          <p className="section-label" style={{ textAlign: 'center' }}>Get started</p>
          <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto 8px' }}>Tell Us About Your Trip</h2>
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>No payment now. Just tell us your flight date and what you're looking for.</p>

          <div className="form-card">
            <div className="form-header">
              <img src="/logo.png" alt="Kado Bajo" />
              <div className="form-header-text">
                <h2>We'll Handle the Rest</h2>
                <p>Personal shopper · Professional packing · Airport pickup</p>
              </div>
            </div>

            {submitted ? (
              <div className="success-box">
                <div className="success-check">
                  <svg width="32" height="32" fill="none" stroke="#10B981" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="serif" style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>Order received!</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)' }}>Redirecting to WhatsApp to confirm your order…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-body">
                <div className="form-note">
                  💡 Only the fields marked * are required. More info helps your personal shopper curate a better selection.
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className={`form-input${errors.name ? ' error' : ''}`} value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Mitchell" />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">Country *</label>
                    <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                      style={{ appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select country…</option>
                      {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Email</label>
                    <input type="email" className={`form-input${errors.email ? ' error' : ''}`} value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                  <div className="form-field">
                    <label className="form-label">WhatsApp Number *</label>
                    <input type="tel" className={`form-input${errors.phone ? ' error' : ''}`} value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+628123456789" />
                    <div className="form-hint">Include country code</div>
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Flight Date from Komodo</label>
                  <input type="date" className="form-input" value={form.flight_date}
                    onChange={e => setForm({ ...form, flight_date: e.target.value })} />
                  <div className="form-hint">Optional — helps us prepare in time</div>
                </div>

                <div className="form-field">
                  <label className="form-label">Anything else?</label>
                  <textarea className="form-input" value={form.notes} rows={3}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Budget, occasion, who you're buying for — the more you tell us, the better your personal shopper can curate."
                    style={{ resize: 'vertical' }} />
                </div>

                {errors.submit && <div className="submit-error">{errors.submit}</div>}

                <button type="submit" className="form-submit" disabled={loading}>
                  {loading
                    ? <><span className="spin" />Processing…</>
                    : <>
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Reserve My Order — Free →
                      </>
                  }
                </button>
                <p className="form-trust">No payment now · Your personal shopper will contact you within a few hours · Free packing & gift wrap included</p>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* ── 11. FAQ ── */}
      <div className="section">
        <p className="section-label" style={{ textAlign: 'center' }}>Objection handling</p>
        <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto 8px', maxWidth: 480 }}>Frequently Asked Questions</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>Everything you need to know before you fly.</p>
        <div className="faq-list" style={{ maxWidth: 680, margin: '0 auto' }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className="faq-plus" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── 12. FINAL CTA ── */}
      <div className="section-sm">
        <div className="final-cta">
          <h2>Don't Leave Komodo Empty-Handed</h2>
          <p>Tell us your flight date. We'll prepare your order and have it waiting at Komodo Airport — perfectly packed and ready to go.</p>
          <button className="final-cta-btn" onClick={scrollToForm}>
            Order Now &amp; Pick Up at the Airport →
          </button>
          <div className="final-trust">✓ Free packing &amp; gift wrap &nbsp;·&nbsp; ✓ Personal shopper included &nbsp;·&nbsp; ✓ All major cards accepted</div>
        </div>
      </div>

      {/* ── 13. FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              <img src="/logo.png" alt="Kado Bajo" />
              <span>Kado Bajo</span>
            </div>
            <div className="footer-text">The most complete NTT souvenir experience, right at Komodo Airport.</div>
          </div>
          <div>
            <div className="footer-title">Store Address</div>
            <div className="footer-text">Jl. Yohanes Sehadun, Labuan Bajo<br />Depan Bandara Komodo, NTT</div>
          </div>
          <div>
            <div className="footer-title">Contact Us</div>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="footer-wa">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Us
            </a>
            <div className="footer-socials">
              <a href="#" target="_blank" rel="noreferrer" className="footer-social">Instagram</a>
              <a href="#" target="_blank" rel="noreferrer" className="footer-social">TikTok</a>
            </div>
          </div>
          <div>
            <div className="footer-title">Legal</div>
            <a href="#" className="footer-legal footer-text">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Kado Bajo · Labuan Bajo, Flores, NTT</span>
          <a href="#" className="footer-legal">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
