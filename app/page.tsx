'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '6281234567890'; // Replace with real number

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
  { flag: '🌍', name: 'Verified Traveller', location: 'International', quote: "The best souvenir shopping I've ever experienced. Ordered the night before, picked up at the airport — beautifully packed, incredible quality. Wish this existed everywhere." },
  { flag: '🌍', name: 'Komodo National Park Visitor', location: 'Verified Customer', quote: "Came straight from a liveaboard with no time to shop. Kado Bajo had everything sorted. The ikat cloth and coffee I brought home are stunning. Everyone asks where I got them." },
  { flag: '🌍', name: 'Happy Shopper', location: 'Bandara Komodo', quote: "Bought gifts for my whole family — packing was incredible, everything arrived intact. The personal shopper helped me choose perfectly for each person. Truly special service." },
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
    <div className="min-h-screen bg-[#FDF8F0] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-serif-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-fadeUp { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s; opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-[#FDF8F0]/90 backdrop-blur-sm border-b border-[#E8DFD0]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#C4A35A] flex items-center justify-center">
            <span className="text-white text-xs font-bold">K</span>
          </div>
          <span className="font-serif-display font-bold text-[#2C1810] tracking-wide text-sm">KADO BAJO</span>
        </div>
        <Link href="/login" className="font-body text-xs font-medium text-[#8B6914] border border-[#C4A35A] px-4 py-2 rounded-full hover:bg-[#C4A35A] hover:text-white transition-all duration-200">
          Admin Login
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center relative">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#C4A35A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full bg-[#E8A87C]/15 blur-3xl pointer-events-none" />
        <div className="animate-float inline-block mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#C4A35A] to-[#8B6914] flex items-center justify-center shadow-xl shadow-[#C4A35A]/30">
            <span className="text-3xl">🎁</span>
          </div>
        </div>
        <div className="animate-fadeUp delay-1">
          <p className="font-body text-[#C4A35A] font-medium tracking-[0.2em] text-xs uppercase mb-3">Komodo Airport · Labuan Bajo · NTT</p>
        </div>
        <h1 className="animate-fadeUp delay-2 font-serif-display text-4xl md:text-5xl font-bold text-[#2C1810] leading-tight mb-4 max-w-2xl mx-auto">
          The Best of East Nusa Tenggara —{' '}
          <em className="text-[#C4A35A] not-italic">Ready at Komodo Airport</em>{' '}
          Before You Fly Home
        </h1>
        <p className="animate-fadeUp delay-3 font-body text-[#6B4C3B] text-base md:text-lg max-w-lg mx-auto mb-4 font-light leading-relaxed">
          Order online. Your personal shopper prepares everything. Pick up right before check-in. The most complete NTT souvenir experience — zero stress, zero luggage hassle.
        </p>
        <p className="animate-fadeUp delay-3 font-body text-[#8B6914] text-sm font-medium mb-8">
          🌟 Trusted by travellers from over 30 countries. Shop before you leave.
        </p>
        <div className="animate-fadeUp delay-4 flex flex-wrap justify-center gap-3 mb-12 font-body">
          {['✓ Free packing & gift wrap', '✓ Personal shopper included', '✓ All major cards accepted'].map((b) => (
            <span key={b} className="text-xs bg-white border border-[#E8DFD0] text-[#6B4C3B] px-4 py-1.5 rounded-full shadow-sm">{b}</span>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-5 border border-[#E8DFD0] shadow-sm">
              <span className="text-2xl mb-3 block">{b.icon}</span>
              <h3 className="font-serif-display font-semibold text-[#2C1810] text-sm mb-2">{b.title}</h3>
              <p className="font-body text-[#6B4C3B] text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead Form */}
      <section className="px-6 pb-16 max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#C4A35A]/10 border border-[#E8DFD0] overflow-hidden">
          <div className="bg-gradient-to-r from-[#2C1810] to-[#4A2C1A] px-8 py-6">
            <h2 className="font-serif-display text-white text-xl font-bold mb-1">Your Last Stop Before Departure</h2>
            <p className="font-body text-[#E8C88A] text-sm font-light">Order now — we'll have everything packed & ready at Komodo Airport.</p>
          </div>

          {submitted ? (
            <div className="px-8 py-12 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif-display text-xl font-bold text-[#2C1810] mb-2">Order received!</h3>
              <p className="font-body text-[#6B4C3B] text-sm">Redirecting you to WhatsApp to confirm…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
              {/* Name */}
              <div>
                <label className="font-body text-xs font-medium text-[#4A2C1A] uppercase tracking-wider block mb-1.5">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sarah Mitchell"
                  className={`font-body w-full px-4 py-3 rounded-xl border text-sm text-[#2C1810] placeholder-[#C4A8A0] bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-[#E8DFD0]'}`} />
                {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="font-body text-xs font-medium text-[#4A2C1A] uppercase tracking-wider block mb-1.5">
                  Country <span className="text-[#A89080] normal-case tracking-normal font-normal">(helps us serve you better)</span>
                </label>
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="font-body w-full px-4 py-3 rounded-xl border border-[#E8DFD0] text-sm text-[#2C1810] bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all appearance-none cursor-pointer">
                  <option value="">Select your country…</option>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="font-body text-xs font-medium text-[#4A2C1A] uppercase tracking-wider block mb-1.5">
                  Email <span className="text-[#A89080] normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                  className={`font-body w-full px-4 py-3 rounded-xl border text-sm text-[#2C1810] placeholder-[#C4A8A0] bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-[#E8DFD0]'}`} />
                {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="font-body text-xs font-medium text-[#4A2C1A] uppercase tracking-wider block mb-1.5">WhatsApp Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-[#A89080]">+</span>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="628123456789 or 61412345678"
                    className={`font-body w-full pl-6 pr-4 py-3 rounded-xl border text-sm text-[#2C1810] placeholder-[#C4A8A0] bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-[#E8DFD0]'}`} />
                </div>
                <p className="font-body text-xs text-[#A89080] mt-1">Include country code (e.g. 628… Indonesia, 614… Australia, 1… USA)</p>
                {errors.phone && <p className="font-body text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {errors.submit && <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{errors.submit}</p>}

              <button type="submit" disabled={loading}
                className="font-body w-full bg-gradient-to-r from-[#C4A35A] to-[#8B6914] text-white font-medium py-4 rounded-xl hover:shadow-lg hover:shadow-[#C4A35A]/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing…</>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Order Now &amp; Pick Up at the Airport →
                  </>
                )}
              </button>
              <p className="font-body text-center text-xs text-[#A89080]">Your data is safe. We will never spam you.</p>
            </form>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <h2 className="font-serif-display text-center text-2xl font-bold text-[#2C1810] mb-2">What Travellers Say</h2>
        <p className="font-body text-center text-[#8B7355] text-sm mb-8">From 30+ countries around the world</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-5 border border-[#E8DFD0] shadow-sm">
              <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <span key={i} className="text-[#C4A35A] text-sm">★</span>)}</div>
              <p className="font-body text-[#4A2C1A] text-xs italic leading-relaxed mb-3">"{t.quote}"</p>
              <p className="font-body text-[#8B7355] text-xs font-medium">{t.flag} {t.name}</p>
              <p className="font-body text-[#A89080] text-xs">{t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-20 max-w-2xl mx-auto">
        <h2 className="font-serif-display text-center text-2xl font-bold text-[#2C1810] mb-2">Frequently Asked Questions</h2>
        <p className="font-body text-center text-[#8B7355] text-sm mb-8">Everything you need to know before you fly</p>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-4 font-body font-semibold text-[#2C1810] text-sm flex justify-between items-center text-left">
                {faq.q}
                <span className={`text-[#C4A35A] text-xl transition-transform duration-200 inline-block ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && <p className="font-body px-5 pb-4 text-sm text-[#6B4C3B] leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#E8DFD0] py-6 text-center">
        <p className="font-body text-xs text-[#A89080]">© 2025 Kado Bajo · Komodo Airport, Labuan Bajo, Flores, NTT</p>
      </footer>
    </div>
  );
}
