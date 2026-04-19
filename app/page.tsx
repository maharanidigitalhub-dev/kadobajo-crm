'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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

const BENEFITS = [
  { icon: '🎁', title: 'The Most Complete NTT Collection', desc: 'Handwoven Songke & Tenun ikat, Komodo wood carvings, artisan coffee, forest honey, freshwater pearls — all curated, authentic, from East Nusa Tenggara.' },
  { icon: '✈️', title: 'Pick Up at Komodo Airport', desc: 'No need to carry bags around town. Order online, we prepare everything, you collect right before check-in. Simple, fast, stress-free.' },
  { icon: '⭐', title: 'Personal Shopper Included', desc: "Tell us your budget and who you're buying for. We'll curate the perfect selection — one gift or twenty. No extra charge." },
  { icon: '📦', title: 'Professional Packing & Gift Wrap', desc: 'Every order packed for international travel. Fragile items secured. Gift wrapping included. Your gifts arrive home perfect.' },
  { icon: '🤝', title: 'Every Purchase Supports Local Communities', desc: 'From the weavers of Flores to the honey farmers of Timor — your purchase connects directly to the people of East Nusa Tenggara.' },
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
  { q: 'Do you ship internationally?', a: 'Our primary service is airport pickup. For international shipping inquiries, please contact us directly.' },
];

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '' });
  const [utmParams, setUtmParams] = useState({ utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      utm_content: params.get('utm_content') ?? '',
    });
  }, []);

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
          window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Kado%20Bajo!%20I%27m%20${encodeURIComponent(form.name)}%20from%20${encodeURIComponent(form.country || 'abroad')}%20and%20I%27d%20like%20to%20order%20souvenirs.`;
        }, 1200);
      }
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0A0E1A', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }

        /* Navy brand colors extracted from logo */
        :root {
          --navy: #1B2A6B;
          --navy-light: #2D3F8F;
          --navy-dark: #0F1A45;
          --gold: #C4A020;
          --gold-light: #E8C040;
          --bg: #0A0E1A;
          --bg-card: #0F1528;
          --bg-card2: #131D35;
          --border: rgba(27,42,107,0.5);
          --text: #E8EAF0;
          --text-muted: #8B93B8;
        }

        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(27,42,107,0.4)} 70%{box-shadow:0 0 0 20px rgba(27,42,107,0)} 100%{box-shadow:0 0 0 0 rgba(27,42,107,0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }

        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-fadeUp { animation: fadeUp 0.8s ease forwards; }
        .animate-pulse-ring { animation: pulse-ring 2s ease infinite; }
        .d1{animation-delay:0.1s;opacity:0} .d2{animation-delay:0.25s;opacity:0} .d3{animation-delay:0.4s;opacity:0} .d4{animation-delay:0.55s;opacity:0}

        .btn-primary {
          background: linear-gradient(135deg, var(--navy-light), var(--navy));
          border: 1px solid rgba(45,63,143,0.6);
          transition: all 0.2s;
        }
        .btn-primary:hover { background: linear-gradient(135deg, #3D52B0, var(--navy-light)); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,42,107,0.5); }

        .card { background: var(--bg-card); border: 1px solid var(--border); }
        .card2 { background: var(--bg-card2); border: 1px solid var(--border); }

        .input-field {
          background: rgba(15,21,40,0.8);
          border: 1px solid rgba(27,42,107,0.4);
          color: var(--text);
          transition: all 0.2s;
        }
        .input-field:focus { outline: none; border-color: var(--navy-light); box-shadow: 0 0 0 3px rgba(27,42,107,0.2); }
        .input-field::placeholder { color: rgba(139,147,184,0.5); }

        .logo-glow { filter: drop-shadow(0 0 20px rgba(27,42,107,0.8)) drop-shadow(0 0 40px rgba(27,42,107,0.4)); }

        .star-gold { color: #C4A020; }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(27,42,107,0.5), transparent); }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(27,42,107,0.3)', backdropFilter: 'blur(12px)', background: 'rgba(10,14,26,0.9)' }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Kado Bajo" width={52} height={52} className="rounded-full object-cover" style={{ border: '2px solid rgba(27,42,107,0.8)' }} />
          <span className="serif font-bold tracking-widest text-sm uppercase" style={{ color: '#E8EAF0' }}>KADO BAJO</span>
        </div>
        <Link href="/login" className="text-xs font-medium px-4 py-2 rounded-full transition-all duration-200"
          style={{ color: '#8B93B8', border: '1px solid rgba(27,42,107,0.5)' }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = '#E8EAF0'; (e.target as HTMLElement).style.borderColor = 'rgba(45,63,143,0.8)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = '#8B93B8'; (e.target as HTMLElement).style.borderColor = 'rgba(27,42,107,0.5)'; }}>
          Admin Login
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        {/* Background effects */}
        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:'600px', height:'600px', background:'radial-gradient(circle, rgba(27,42,107,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundImage:'radial-gradient(rgba(27,42,107,0.08) 1px, transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />

        {/* Logo */}
        <div className="animate-float inline-block mb-8 relative">
          <div className="animate-pulse-ring" style={{ width:120, height:120, borderRadius:'50%', margin:'0 auto' }}>
            <Image src="/logo.jpg" alt="Kado Bajo Logo" width={120} height={120}
              className="logo-glow rounded-full object-cover"
              style={{ border: '3px solid rgba(27,42,107,0.8)', width:120, height:120 }} />
          </div>
        </div>

        <div className="animate-fadeUp d1">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#2D3F8F' }}>
            Komodo Airport · Labuan Bajo · NTT
          </p>
        </div>

        <h1 className="animate-fadeUp d2 serif text-4xl md:text-6xl font-bold leading-tight mb-5 max-w-3xl mx-auto" style={{ color: '#E8EAF0' }}>
          The Best of East Nusa Tenggara —{' '}
          <span style={{ color: '#4B63C8' }}>Ready at Komodo Airport</span>{' '}
          Before You Fly Home
        </h1>

        <p className="animate-fadeUp d3 text-base md:text-lg max-w-xl mx-auto mb-5 font-light leading-relaxed" style={{ color: '#8B93B8' }}>
          Order online. Your personal shopper prepares everything. Pick up right before check-in —
          zero stress, zero luggage hassle.
        </p>

        <p className="animate-fadeUp d3 text-sm font-semibold mb-10" style={{ color: '#4B63C8' }}>
          🌟 Trusted by travellers from over 30 countries
        </p>

        <div className="animate-fadeUp d4 flex flex-wrap justify-center gap-3 mb-4">
          {['✓ Free packing & gift wrap', '✓ Personal shopper included', '✓ All major cards accepted'].map((b) => (
            <span key={b} className="text-xs px-4 py-2 rounded-full" style={{ color: '#8B93B8', border: '1px solid rgba(27,42,107,0.4)', background: 'rgba(27,42,107,0.1)' }}>{b}</span>
          ))}
        </div>
      </section>

      <div className="divider mx-6 mb-16" />

      {/* Benefits */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <h2 className="serif text-center text-2xl font-bold mb-10" style={{ color: '#E8EAF0' }}>Why Travellers Choose Kado Bajo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card rounded-2xl p-5 hover:border-[#2D3F8F] transition-all duration-200 hover:-translate-y-1">
              <span className="text-2xl mb-3 block">{b.icon}</span>
              <h3 className="serif font-semibold text-sm mb-2" style={{ color: '#C8D0F0' }}>{b.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#8B93B8' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider mx-6 mb-16" />

      {/* Lead Form */}
      <section className="px-6 pb-16 max-w-lg mx-auto">
        <div className="card rounded-3xl overflow-hidden" style={{ boxShadow: '0 0 60px rgba(27,42,107,0.3)' }}>
          {/* Card header */}
          <div style={{ background: 'linear-gradient(135deg, #0F1A45, #1B2A6B)', padding: '28px 32px', borderBottom: '1px solid rgba(27,42,107,0.5)' }}>
            <div className="flex items-center gap-3 mb-3">
              <Image src="/logo.jpg" alt="Kado Bajo" width={40} height={40} className="rounded-full object-cover" style={{ border: '2px solid rgba(45,63,143,0.6)' }} />
              <div>
                <h2 className="serif text-white text-lg font-bold leading-none">Your Last Stop Before Departure</h2>
                <p className="text-xs mt-1" style={{ color: '#8B93B8' }}>Pack it. Ship it. Done before check-in.</p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="px-8 py-14 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(27,42,107,0.3)', border: '2px solid rgba(27,42,107,0.6)' }}>
                <svg className="w-8 h-8" fill="none" stroke="#4B63C8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="serif text-xl font-bold mb-2" style={{ color: '#E8EAF0' }}>Order received!</h3>
              <p className="text-sm" style={{ color: '#8B93B8' }}>Redirecting to WhatsApp to confirm your order…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8B93B8' }}>Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Mitchell"
                  className={`input-field w-full px-4 py-3 rounded-xl text-sm ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8B93B8' }}>
                  Country <span className="normal-case font-normal tracking-normal" style={{ color: '#4A5280' }}>(helps us serve you better)</span>
                </label>
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer">
                  <option value="" style={{ background: '#0F1528' }}>Select your country…</option>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code} style={{ background: '#0F1528' }}>{c.name}</option>)}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8B93B8' }}>
                  Email <span className="normal-case font-normal tracking-normal" style={{ color: '#4A5280' }}>(optional)</span>
                </label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                  className={`input-field w-full px-4 py-3 rounded-xl text-sm ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#8B93B8' }}>WhatsApp Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#4A5280' }}>+</span>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="628123456789"
                    className={`input-field w-full pl-6 pr-4 py-3 rounded-xl text-sm ${errors.phone ? 'border-red-500' : ''}`} />
                </div>
                <p className="text-xs mt-1" style={{ color: '#4A5280' }}>Include country code (628… Indonesia, 614… Australia, 1… USA)</p>
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              {errors.submit && <p className="text-sm text-red-400 rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{errors.submit}</p>}

              <button type="submit" disabled={loading}
                className="btn-primary w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Order Now &amp; Pick Up at the Airport →
                  </>
                )}
              </button>
              <p className="text-center text-xs" style={{ color: '#4A5280' }}>Your data is safe. We will never spam you.</p>
            </form>
          )}
        </div>
      </section>

      <div className="divider mx-6 mb-16" />

      {/* Testimonials */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <h2 className="serif text-center text-2xl font-bold mb-2" style={{ color: '#E8EAF0' }}>What Travellers Say</h2>
        <p className="text-center text-sm mb-8" style={{ color: '#8B93B8' }}>From 30+ countries around the world</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card rounded-2xl p-5">
              <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <span key={i} className="star-gold text-sm">★</span>)}</div>
              <p className="text-xs italic leading-relaxed mb-4" style={{ color: '#8B93B8' }}>"{t.quote}"</p>
              <div className="flex items-center gap-2">
                <span className="text-lg">{t.flag}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#C8D0F0' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: '#4A5280' }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider mx-6 mb-16" />

      {/* FAQ */}
      <section className="px-6 pb-20 max-w-2xl mx-auto">
        <h2 className="serif text-center text-2xl font-bold mb-2" style={{ color: '#E8EAF0' }}>Frequently Asked Questions</h2>
        <p className="text-center text-sm mb-8" style={{ color: '#8B93B8' }}>Everything you need to know before you fly</p>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-4 flex justify-between items-center text-left transition-colors hover:bg-white/5"
                style={{ color: '#C8D0F0' }}>
                <span className="text-sm font-semibold">{faq.q}</span>
                <span className="text-xl transition-transform duration-200 ml-3 flex-shrink-0"
                  style={{ color: '#2D3F8F', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: '#8B93B8', borderTop: '1px solid rgba(27,42,107,0.2)' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="divider mx-6" />
      <footer className="py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Image src="/logo.jpg" alt="Kado Bajo" width={28} height={28} className="rounded-full object-cover opacity-60" />
          <span className="serif text-sm font-bold tracking-widest" style={{ color: '#4A5280' }}>KADO BAJO</span>
        </div>
        <p className="text-xs" style={{ color: '#2D3570' }}>© 2025 Kado Bajo · Komodo Airport, Labuan Bajo, Flores, NTT</p>
      </footer>
    </div>
  );
}
