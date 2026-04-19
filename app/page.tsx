'use client';

import { useState, useEffect } from 'react';
import NextImage from 'next/image';
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
    <div style={{ background: '#fff', fontFamily: "'DM Sans', sans-serif", color: '#1a1209', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }

        /* Colors from template */
        :root {
          --ink: #1a1209;
          --navy: #2D3F8F;
          --navy-dark: #1B2A6B;
          --terracotta: #c4673a;
          --gold: #b8922a;
          --sand: #f7f2ea;
          --muted: #7a6e61;
          --border: rgba(180,160,120,0.2);
          --border-light: #E8ECF8;
        }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(45,63,143,0.25)} 70%{box-shadow:0 0 0 16px rgba(45,63,143,0)} 100%{box-shadow:0 0 0 0 rgba(45,63,143,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .fadeUp { animation: fadeUp 0.7s ease forwards; }
        .d1{animation-delay:0.1s;opacity:0} .d2{animation-delay:0.25s;opacity:0} .d3{animation-delay:0.4s;opacity:0}
        .logo-pulse { animation: pulse-ring 2.5s ease infinite; border-radius: 50%; display: inline-block; }
        .logo-float { animation: float 5s ease-in-out infinite; display: inline-block; }

        /* NAVBAR */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 32px;
          background: rgba(255,255,255,0.95);
          border-bottom: 1px solid transparent;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
        }
        .navbar.scrolled {
          border-bottom-color: var(--border-light);
          box-shadow: 0 2px 12px rgba(45,63,143,0.06);
          padding: 12px 32px;
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
        .nav-logo span { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 15px; color: var(--navy-dark); letter-spacing: 1px; text-transform: uppercase; }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-admin { font-size: 12px; color: #9CA3AF; text-decoration: none; padding: 6px 12px; border-radius: 20px; border: 1px solid #E5E7EB; transition: all 0.2s; }
        .nav-admin:hover { color: var(--navy); border-color: var(--navy); }
        .nav-cta {
          font-size: 13px; font-weight: 600; color: white; text-decoration: none;
          padding: 9px 20px; border-radius: 6px; cursor: pointer; border: none;
          background: linear-gradient(135deg, var(--navy), var(--navy-dark));
          transition: all 0.2s; display: none;
        }
        .navbar.scrolled .nav-cta { display: block; }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(45,63,143,0.3); }

        /* SECTIONS */
        .section { padding: 72px 24px; max-width: 960px; margin: 0 auto; }
        .section-sm { padding: 48px 24px; max-width: 960px; margin: 0 auto; }
        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--navy); margin-bottom: 12px;
        }
        .section-title { font-family: 'Playfair Display', serif; font-size: 32px; color: var(--ink); line-height: 1.25; margin-bottom: 16px; }
        .section-sub { font-size: 16px; color: var(--muted); line-height: 1.7; max-width: 560px; }

        .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border-light), transparent); margin: 0 32px; }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center;
          padding: 120px 24px 80px;
          background: linear-gradient(180deg, #F8F9FF 0%, #fff 60%);
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 800px; height: 600px;
          background: radial-gradient(ellipse, rgba(45,63,143,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-logo { margin-bottom: 32px; }
        .hero-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--navy); margin-bottom: 20px; }
        .hero-h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 58px); color: var(--ink); line-height: 1.15; margin-bottom: 24px; max-width: 780px; }
        .hero-h1 em { color: var(--navy); font-style: normal; }
        .hero-sub { font-size: 18px; color: var(--muted); line-height: 1.7; max-width: 520px; margin: 0 auto 32px; font-weight: 300; }
        .hero-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--navy), var(--navy-dark));
          color: white; padding: 16px 36px; border-radius: 6px;
          font-size: 15px; font-weight: 700; text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s; margin-bottom: 16px;
        }
        .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,63,143,0.35); }
        .hero-urgency { font-size: 13px; color: var(--navy); font-weight: 600; margin-bottom: 32px; }
        .hero-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .hero-badge { font-size: 12px; font-weight: 500; padding: 8px 18px; border-radius: 20px; color: var(--navy); border: 1.5px solid rgba(45,63,143,0.2); background: rgba(45,63,143,0.04); }

        /* TRUST BAR */
        .trust-bar { background: var(--sand); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 24px 32px; }
        .trust-bar-inner { max-width: 960px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; }
        .trust-item { display: flex; align-items: center; gap: 10px; }
        .trust-icon { font-size: 20px; }
        .trust-text { font-size: 13px; font-weight: 600; color: var(--ink); }
        .trust-sub { font-size: 11px; color: var(--muted); }

        /* PROBLEM */
        .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; }
        @media(max-width:640px){ .problem-grid { grid-template-columns: 1fr; } }
        .pain-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .pain-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: #FEF2F2; border-radius: 8px; border-left: 3px solid #EF4444; }
        .pain-x { color: #EF4444; font-weight: 700; flex-shrink: 0; font-size: 14px; }
        .pain-text { font-size: 14px; color: #374151; line-height: 1.6; }
        .solution-box { background: linear-gradient(135deg, var(--navy), var(--navy-dark)); border-radius: 16px; padding: 32px; color: white; }
        .solution-box h3 { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 16px; line-height: 1.35; }
        .solution-box p { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.75; }

        /* HOW IT WORKS */
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media(max-width:640px){ .steps-grid { grid-template-columns: 1fr; } }
        .step-card { background: #F8F9FF; border: 1.5px solid var(--border-light); border-radius: 14px; padding: 28px 24px; position: relative; }
        .step-number { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; color: white; margin-bottom: 16px; }
        .step-title { font-weight: 700; font-size: 15px; color: var(--ink); margin-bottom: 10px; }
        .step-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }

        /* BENEFITS */
        .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .benefit-card { background: #F8F9FF; border: 1.5px solid var(--border-light); border-radius: 14px; padding: 24px 20px; transition: all 0.2s; }
        .benefit-card:hover { border-color: rgba(45,63,143,0.25); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(45,63,143,0.08); }
        .benefit-icon { font-size: 24px; margin-bottom: 12px; }
        .benefit-title { font-weight: 700; font-size: 14px; color: var(--navy-dark); margin-bottom: 8px; }
        .benefit-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }

        /* PRODUCTS */
        .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
        .product-card { background: white; border: 1.5px solid var(--border-light); border-radius: 12px; padding: 20px; }
        .product-icon { font-size: 28px; margin-bottom: 10px; }
        .product-title { font-weight: 700; font-size: 14px; color: var(--ink); margin-bottom: 6px; }
        .product-desc { font-size: 12px; color: var(--muted); line-height: 1.65; }

        /* TESTIMONIALS */
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .testimonial-card { background: #F8F9FF; border: 1.5px solid var(--border-light); border-radius: 14px; padding: 24px; }
        .stars { color: #F59E0B; font-size: 14px; letter-spacing: 2px; margin-bottom: 12px; }
        .testimonial-quote { font-size: 14px; color: #374151; line-height: 1.75; font-style: italic; margin-bottom: 16px; }
        .testimonial-author { display: flex; align-items: center; gap: 10px; }
        .testimonial-flag { font-size: 20px; }
        .testimonial-name { font-size: 13px; font-weight: 700; color: var(--navy-dark); }
        .testimonial-loc { font-size: 11px; color: var(--muted); }

        /* MID CTA */
        .mid-cta { background: var(--sand); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 48px 32px; text-align: center; }
        .mid-cta h3 { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--ink); margin-bottom: 20px; }
        .mid-cta p { font-size: 13px; color: var(--muted); margin-top: 14px; }

        /* FORM */
        .form-section { max-width: 640px; margin: 0 auto; }
        .form-card { background: white; border: 2px solid var(--border-light); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 48px rgba(45,63,143,0.12); }
        .form-header { background: linear-gradient(135deg, var(--navy-dark), var(--navy)); padding: 28px 32px; display: flex; gap: 16px; align-items: center; }
        .form-header img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; box-shadow: 0 0 0 2px rgba(255,255,255,0.2); }
        .form-header-text h2 { font-family: 'Playfair Display', serif; font-size: 18px; color: white; margin-bottom: 4px; line-height: 1.3; }
        .form-header-text p { font-size: 12px; color: rgba(255,255,255,0.6); }
        .form-body { padding: 28px 32px; }
        .form-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; margin-bottom: 6px; }
        .form-input {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          border: 1.5px solid #E5E7EB; background: #F9FAFB;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #111827; outline: none; transition: all 0.2s;
        }
        .form-input:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(45,63,143,0.1); background: white; }
        .form-input::placeholder { color: #9CA3AF; }
        .form-input.error { border-color: #EF4444; background: #FEF2F2; }
        .form-field { margin-bottom: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media(max-width:500px){ .form-row { grid-template-columns: 1fr; } }
        .form-error { font-size: 12px; color: #EF4444; margin-top: 4px; }
        .form-hint { font-size: 11px; color: #9CA3AF; margin-top: 4px; }
        .form-note { font-size: 12px; color: #6B7280; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; }
        .form-submit {
          width: 100%; padding: 16px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--navy), var(--navy-dark));
          color: white; font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .form-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45,63,143,0.35); }
        .form-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .form-trust { font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 14px; }
        .spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .submit-error { font-size: 13px; color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
        .success-box { padding: 48px 32px; text-align: center; }
        .success-check { width: 64px; height: 64px; background: #ECFDF5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }

        /* FAQ */
        .faq-list { display: flex; flex-direction: column; gap: 10px; }
        .faq-item { background: white; border: 1.5px solid var(--border-light); border-radius: 12px; overflow: hidden; }
        .faq-question { width: 100%; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; text-align: left; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--ink); transition: background 0.15s; }
        .faq-question:hover { background: #F8F9FF; }
        .faq-plus { font-size: 20px; color: var(--navy); flex-shrink: 0; margin-left: 12px; transition: transform 0.2s; }
        .faq-answer { padding: 0 20px 16px; font-size: 14px; color: var(--muted); line-height: 1.75; border-top: 1px solid #F3F4F6; padding-top: 14px; }

        /* FINAL CTA */
        .final-cta { background: linear-gradient(135deg, var(--navy-dark), var(--navy)); border-radius: 20px; padding: 56px 40px; text-align: center; max-width: 720px; margin: 0 auto; }
        .final-cta h2 { font-family: 'Playfair Display', serif; font-size: clamp(24px, 4vw, 38px); color: white; margin-bottom: 16px; line-height: 1.25; }
        .final-cta p { font-size: 15px; color: rgba(255,255,255,0.7); margin-bottom: 32px; line-height: 1.7; max-width: 480px; margin-left: auto; margin-right: auto; }
        .final-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: var(--navy-dark);
          padding: 16px 36px; border-radius: 8px; font-weight: 700; font-size: 15px;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s; margin-bottom: 20px;
        }
        .final-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
        .final-trust { font-size: 12px; color: rgba(255,255,255,0.5); }

        /* FOOTER */
        .footer { background: #F8F9FF; border-top: 1.5px solid var(--border-light); padding: 40px 32px; }
        .footer-inner { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 28px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .footer-logo img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
        .footer-logo span { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px; color: var(--navy-dark); }
        .footer-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; }
        .footer-text { font-size: 13px; color: #6B7280; line-height: 1.7; }
        .footer-wa { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #16A34A; text-decoration: none; margin-top: 6px; }
        .footer-socials { display: flex; gap: 12px; margin-top: 8px; }
        .footer-social { font-size: 13px; color: var(--navy); text-decoration: none; font-weight: 600; padding: 4px 0; }
        .footer-bottom { max-width: 960px; margin: 24px auto 0; padding-top: 20px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .footer-copy { font-size: 12px; color: #9CA3AF; }
        .footer-legal { font-size: 12px; color: #9CA3AF; text-decoration: none; }
        .footer-legal:hover { color: var(--navy); }
      `}</style>

      {/* Nav */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E8ECF8', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: 'blur(8px)' }}
        className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <NextImage
            src="/logo.png"
            alt="Kado Bajo"
            width={48}
            height={48}
            className="rounded-full object-cover w-10 h-10 sm:w-12 sm:h-12"
          />
          <span className="serif font-bold tracking-widest text-sm sm:text-base uppercase" style={{ color: '#1B2A6B' }}>
            KADO BAJO
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        {/* Subtle background accent */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(45,63,143,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div className="animate-float inline-block mb-8">
          <div className="pulse" style={{ borderRadius: '50%', display: 'inline-block' }}>
            <NextImage src="/logo.png" alt="Kado Bajo Logo" width={110} height={110}
              className="rounded-full object-cover"
              style={{ boxShadow: '0 8px 32px rgba(45,63,143,0.25)' }} />
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

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E8ECF8, transparent)', margin: '0 24px 48px' }} />

      {/* Lead Form */}
      <section className="px-6 pb-16 max-w-lg mx-auto">
        <div className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid #E8ECF8', boxShadow: '0 8px 40px rgba(45,63,143,0.12)' }}>
          {/* Card header — navy, logo tetap */}
          <div style={{ background: 'linear-gradient(135deg, #1B2A6B, #2D3F8F)', padding: '28px 32px' }}>
            <div className="flex items-center gap-3">
              <NextImage src="/logo.png" alt="Kado Bajo" width={44} height={44} className="rounded-full object-cover flex-shrink-0"
                style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.2)' }} />
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
      </section>

      {/* Footer */}
      <div style={{ height: 1, background: '#F3F4F6', margin: '0 24px' }} />
      <footer className="py-8 text-center" style={{ background: '#fff' }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <NextImage src="/logo.png" alt="Kado Bajo" width={28} height={28} className="rounded-full object-cover" style={{ opacity: 0.8 }} />
          <span className="serif text-sm font-bold tracking-widest" style={{ color: '#1B2A6B' }}>KADO BAJO</span>
        </div>
      </footer>
    </div>
  );
}
