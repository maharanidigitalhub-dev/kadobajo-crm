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
    if (Object.keys(errs).length) { setErrors(errs); formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
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
        window.location.href = `https://wa.me/${DEFAULT_WHATSAPP}?text=Hi%20Kado%20Bajo,%20I%20came%20from%20${encodeURIComponent(content.slug)}%20and%20want%20to%20order.`;
      }, 1200);
    } finally {
      setLoading(false);
    }
  }

  // Problem section — support both old flat structure and new nested structure
  const problem = (content as any).problem;
  const pains: string[] = problem?.pains ?? [];
  const bridge: string = problem?.bridge ?? '';
  const solution: string = problem?.solution ?? 'The most complete NTT souvenir experience. Curated, packed, and waiting at Komodo Airport — before you even check in.';
  const problemTitle: string = problem?.title ?? "You didn't come this far to leave with nothing worth keeping.";
  const problemLabel: string = problem?.sectionLabel ?? 'Sound Familiar?';

  // How it works
  const howItWorks: Array<{step: string; title: string; desc: string}> = (content as any).howItWorks ?? [
    { step: '01', title: 'Order Online', desc: "Fill in the form on this page. Tell us your flight date, budget, and who you're shopping for. Done in 2 minutes." },
    { step: '02', title: 'We Prepare Everything', desc: 'Your personal shopper selects, packs, and gift-wraps your entire order. You do nothing.' },
    { step: '03', title: 'Pick Up at the Airport', desc: "Come to Kado Bajo at Komodo Airport before check-in. Grab your order. Fly home." },
  ];

  // Mid CTA
  const midCta = (content as any).midCta ?? { headline: 'Ready to order?', cta: content.finalCta.ctaText, sub: 'Free packing · Personal shopper included · All cards accepted' };

  // Form copy
  const formCopy = (content as any).form ?? { headline: content.finalCta.title, subheadline: 'No payment now. Just tell us your flight date and what you\'re looking for.', cta: content.finalCta.ctaText, sub: 'No payment now · Personal shopper contacts you within a few hours · Free packing & gift wrap included' };

  // Hero urgency
  const urgency: string = (content.hero as any).urgency ?? '';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#FFFFFF', color: '#1a1209', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(45,63,143,0.3)} 70%{box-shadow:0 0 0 14px rgba(45,63,143,0)} 100%{box-shadow:0 0 0 0 rgba(45,63,143,0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .fadeUp { animation: fadeUp 0.7s ease forwards; }
        .d1{animation-delay:0.1s;opacity:0} .d2{animation-delay:0.25s;opacity:0} .d3{animation-delay:0.4s;opacity:0}
        .logo-pulse { animation: pulse 2.5s ease infinite; border-radius:50%; display:inline-block; }
        .logo-float { animation: float 5s ease-in-out infinite; display:inline-block; }
        .serif { font-family: 'Playfair Display', serif; }
        .nav-cta-hidden { display:none !important; }
        .scrolled .nav-cta-hidden { display:flex !important; }
        .benefit-card:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(45,63,143,0.1) !important; border-color:rgba(45,63,143,0.25) !important; }
        .product-card:hover { box-shadow:0 4px 12px rgba(45,63,143,0.08) !important; }
        .faq-q:hover { background:#F8F9FF !important; }
        .form-input:focus { border-color:#2D3F8F !important; box-shadow:0 0 0 3px rgba(45,63,143,0.1) !important; background:white !important; outline:none; }
        .form-input::placeholder { color:#9CA3AF; }
        .form-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(45,63,143,0.35) !important; }
        .form-submit:disabled { opacity:0.55; cursor:not-allowed; }
        @media(max-width:640px) {
          .steps-grid { grid-template-columns:1fr !important; }
          .benefits-grid { grid-template-columns:1fr !important; }
          .products-grid { grid-template-columns:1fr 1fr !important; }
          .testimonials-grid { grid-template-columns:1fr !important; }
          .problem-grid { grid-template-columns:1fr !important; }
          .form-row { grid-template-columns:1fr !important; }
          .final-cta-box { padding:40px 24px !important; border-radius:16px !important; }
          .hero-logo { width:120px !important; height:120px !important; }
          .footer-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: scrolled ? '12px 24px' : '16px 32px',
        background:'rgba(255,255,255,0.95)',
        borderBottom: scrolled ? '1px solid #E8ECF8' : '1px solid transparent',
        backdropFilter:'blur(8px)',
        boxShadow: scrolled ? '0 2px 12px rgba(45,63,143,0.06)' : 'none',
        transition:'all 0.3s',
      }} className={scrolled ? 'scrolled' : ''}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Image src="/logo.png" alt="Kado Bajo" width={32} height={32} style={{ borderRadius:'50%', objectFit:'cover' }} />
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:'#1B2A6B', letterSpacing:1, textTransform:'uppercase' }}>Kado Bajo</span>
        </div>
        <button className="nav-cta-hidden" onClick={scrollToForm} style={{
          display:'none', alignItems:'center', gap:6,
          background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white',
          border:'none', cursor:'pointer', padding:'9px 20px', borderRadius:6,
          fontSize:13, fontWeight:700, transition:'all 0.2s',
        }}>Order Now →</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', textAlign:'center', padding:'120px 24px 80px',
        background: content.hero.heroImage
          ? `linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(${content.hero.heroImage}) center/cover no-repeat`
          : 'linear-gradient(180deg,#F8F9FF 0%,#fff 60%)',
        position:'relative', overflow:'hidden',
        color: content.hero.heroImage ? 'white' : '#1a1209',
      }}>
        {!content.hero.heroImage && (
          <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:600, background:'radial-gradient(ellipse,rgba(45,63,143,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />
        )}
        <div className="fadeUp d1" style={{ marginBottom:28 }}>
          <div className="logo-float">
            <div className="logo-pulse">
              <Image src="/logo.png" alt="Kado Bajo" width={160} height={160} className="hero-logo" style={{ borderRadius:'50%', objectFit:'cover', display:'block', boxShadow:'0 12px 48px rgba(45,63,143,0.28)' }} />
            </div>
          </div>
        </div>
        <p className="fadeUp d1" style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color: content.hero.heroImage ? 'rgba(255,255,255,0.85)' : '#2D3F8F', marginBottom:20 }}>{content.hero.eyebrow}</p>
        <h1 className="serif fadeUp d2" style={{ fontSize:'clamp(28px,5vw,56px)', lineHeight:1.15, marginBottom:24, maxWidth:780, color: content.hero.heroImage ? 'white' : '#1a1209' }}>
          {content.hero.headline}
        </h1>
        <p className="fadeUp d2" style={{ fontSize:'clamp(15px,2vw,18px)', color: content.hero.heroImage ? 'rgba(255,255,255,0.85)' : '#7a6e61', lineHeight:1.7, maxWidth:520, margin:'0 auto 32px', fontWeight:300 }}>{content.hero.subheadline}</p>
        <button className="fadeUp d3" onClick={scrollToForm} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', padding:'16px 36px', borderRadius:6, fontSize:15, fontWeight:700, border:'none', cursor:'pointer', marginBottom:16, boxShadow:'0 4px 20px rgba(45,63,143,0.4)' }}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          {content.hero.ctaText}
        </button>
        {urgency && <p style={{ fontSize:13, color: content.hero.heroImage ? 'rgba(255,255,255,0.9)' : '#2D3F8F', fontWeight:600, marginBottom:28 }}>🕐 {urgency}</p>}
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8 }}>
          {['✓ Free packing & gift wrap','✓ Personal shopper included','✓ All major cards accepted'].map(b => (
            <span key={b} style={{ fontSize:12, fontWeight:500, padding:'8px 16px', borderRadius:20, color: content.hero.heroImage ? 'white' : '#2D3F8F', border:`1.5px solid ${content.hero.heroImage ? 'rgba(255,255,255,0.4)' : 'rgba(45,63,143,0.2)'}`, background: content.hero.heroImage ? 'rgba(255,255,255,0.12)' : 'rgba(45,63,143,0.04)' }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background:'#f7f2ea', borderTop:'1px solid rgba(180,160,120,0.2)', borderBottom:'1px solid rgba(180,160,120,0.2)', padding:'20px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'center', gap:24 }}>
          {content.trust.map(t => (
            <div key={t.text} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1a1209' }}>{t.text}</div>
                <div style={{ fontSize:11, color:'#7a6e61' }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM → SOLUTION ── */}
      {pains.length > 0 && (
        <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>{problemLabel}</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', lineHeight:1.25, marginBottom:32, maxWidth:560 }}>{problemTitle}</h2>
          <div className="problem-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'center' }}>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:14, padding:0, margin:0 }}>
              {pains.map((p, i) => (
                <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', background:'#FEF2F2', borderRadius:8, borderLeft:'3px solid #EF4444' }}>
                  <span style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{p}</span>
                </li>
              ))}
            </ul>
            <div style={{ background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', borderRadius:16, padding:32, color:'white' }}>
              {bridge && <h3 className="serif" style={{ fontSize:22, marginBottom:16, lineHeight:1.35 }}>{bridge}</h3>}
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.75 }}>{solution}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>Simple Process</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:40 }}>How It Works</h2>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {howItWorks.map((s, i) => (
              <div key={i} style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:14, padding:'28px 24px' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background: i===0?'#2D3F8F':i===1?'#b8922a':'#2d5a3d', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:'white', marginBottom:16 }}>{s.step}</div>
                <div style={{ fontWeight:700, fontSize:15, color:'#1a1209', marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:13, color:'#7a6e61', lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── BENEFITS ── */}
      <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>Why Kado Bajo</p>
        <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>What makes us different</h2>
        <div className="benefits-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {content.benefits.map((b, i) => (
            <div key={i} className="benefit-card" style={{ background:'#F8F9FF', border:'1.5px solid #E8ECF8', borderRadius:14, padding:'24px 20px', transition:'all 0.2s' }}>
              <div style={{ fontSize:24, marginBottom:12 }}>{(b as any).icon ?? '✦'}</div>
              <div style={{ fontWeight:700, fontSize:14, color:'#1B2A6B', marginBottom:8 }}>{b.title}</div>
              <div style={{ fontSize:13, color:'#7a6e61', lineHeight:1.7 }}>{b.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>What&apos;s Inside</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>Our curated collection</h2>
          <div className="products-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
            {content.productHighlights.map((p, i) => (
              <div key={i} className="product-card" style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, padding:20, transition:'all 0.2s' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{(p as any).icon ?? '📦'}</div>
                <div style={{ fontWeight:700, fontSize:14, color:'#1a1209', marginBottom:6 }}>{p.title}</div>
                <div style={{ fontSize:12, color:'#7a6e61', lineHeight:1.65 }}>{p.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>Reviews</p>
        <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>What travellers say</h2>
        <div className="testimonials-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {content.testimonials.map((t, i) => (
            <div key={i} style={{ background:'#F8F9FF', border:'1.5px solid #E8ECF8', borderRadius:14, padding:24 }}>
              <div style={{ color:'#F59E0B', fontSize:14, letterSpacing:2, marginBottom:12 }}>★★★★★</div>
              <p style={{ fontSize:14, color:'#374151', lineHeight:1.75, fontStyle:'italic', marginBottom:16 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>{(t as any).flag ?? '🌍'}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#1B2A6B' }}>{t.name}</div>
                  <div style={{ fontSize:11, color:'#7a6e61' }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MID CTA ── */}
      <div style={{ background:'#f7f2ea', borderTop:'1px solid rgba(180,160,120,0.2)', borderBottom:'1px solid rgba(180,160,120,0.2)', padding:'48px 32px', textAlign:'center' }}>
        <h3 className="serif" style={{ fontSize:26, color:'#1a1209', marginBottom:20 }}>{midCta.headline}</h3>
        <button onClick={scrollToForm} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', padding:'16px 32px', borderRadius:6, fontSize:15, fontWeight:700, border:'none', cursor:'pointer' }}>
          {midCta.cta}
        </button>
        <p style={{ fontSize:13, color:'#7a6e61', marginTop:14 }}>{midCta.sub}</p>
      </div>

      {/* ── LEAD FORM ── */}
      <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <div ref={formRef} style={{ maxWidth:640, margin:'0 auto' }} id="lead-form">
          <div style={{ background:'white', border:'2px solid #E8ECF8', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 48px rgba(45,63,143,0.12)' }}>
            <div style={{ background:'linear-gradient(135deg,#1B2A6B,#2D3F8F)', padding:'28px 32px', display:'flex', gap:16, alignItems:'center' }}>
              <Image src="/logo.png" alt="" width={56} height={56} style={{ borderRadius:'50%', objectFit:'cover', flexShrink:0, boxShadow:'0 0 0 2px rgba(255,255,255,0.2)' }} />
              <div>
                <h2 className="serif" style={{ fontSize:18, color:'white', marginBottom:4, lineHeight:1.3 }}>{formCopy.headline}</h2>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{formCopy.subheadline}</p>
              </div>
            </div>
            <div style={{ padding:'28px 32px' }}>
              {done ? (
                <div style={{ textAlign:'center', padding:'32px 0' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <h3 className="serif" style={{ fontSize:20, marginBottom:8 }}>You&apos;re all set!</h3>
                  <p style={{ color:'#7a6e61', fontSize:14 }}>Redirecting you to WhatsApp to confirm your order…</p>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Full Name *</label>
                      <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:`1.5px solid ${errors.name ? '#EF4444' : '#E5E7EB'}`, background: errors.name ? '#FEF2F2' : '#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827' }} />
                      {errors.name && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Country</label>
                      <input className="form-input" value={form.country} onChange={e => setForm({...form, country: e.target.value})} placeholder="Your country" style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Email</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827' }} />
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>WhatsApp Number *</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+62 xxx xxxx xxxx" style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:`1.5px solid ${errors.phone ? '#EF4444' : '#E5E7EB'}`, background: errors.phone ? '#FEF2F2' : '#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827' }} />
                    {errors.phone && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errors.phone}</p>}
                    <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>Include country code (e.g. +62 for Indonesia)</p>
                  </div>
                  <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Flight Date from Komodo</label>
                      <input className="form-input" type="date" value={form.flight_date} onChange={e => setForm({...form, flight_date: e.target.value})} style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827' }} />
                      <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>Optional — helps us prepare in time</p>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Anything Else?</label>
                      <textarea className="form-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Budget, occasion, who you're buying for…" rows={3} style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827', resize:'vertical' }} />
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:'#6B7280', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'10px 14px', marginBottom:20 }}>
                    💡 Only fields marked * are required. More info helps your personal shopper curate a better selection.
                  </div>
                  <button type="submit" className="form-submit" disabled={loading || !formValid} style={{ width:'100%', padding:16, borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif" }}>
                    {loading
                      ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />Processing…</>
                      : <><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>{formCopy.cta}</>
                    }
                  </button>
                  <p style={{ fontSize:12, color:'#9CA3AF', textAlign:'center', marginTop:14 }}>{formCopy.sub}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>FAQ</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>Questions? Answered.</h2>
          <div style={{ maxWidth:680, display:'flex', flexDirection:'column', gap:10 }}>
            {content.faq.map((f, i) => (
              <div key={i} style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, overflow:'hidden' }}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width:'100%', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', textAlign:'left', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:'#1a1209', transition:'background 0.15s' }}>
                  {f.question}
                  <span style={{ fontSize:20, color:'#2D3F8F', flexShrink:0, marginLeft:12, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition:'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && <div style={{ padding:'14px 20px 16px', fontSize:14, color:'#7a6e61', lineHeight:1.75, borderTop:'1px solid #F3F4F6' }}>{f.answer}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <div className="final-cta-box" style={{ background:'linear-gradient(135deg,#1B2A6B,#2D3F8F)', borderRadius:20, padding:'56px 40px', textAlign:'center', maxWidth:720, margin:'0 auto' }}>
          <h2 className="serif" style={{ fontSize:'clamp(24px,4vw,38px)', color:'white', marginBottom:16, lineHeight:1.25 }}>{content.finalCta.title}</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', marginBottom:32, lineHeight:1.7, maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>{content.finalCta.description}</p>
          <button onClick={scrollToForm} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', color:'#1B2A6B', padding:'16px 36px', borderRadius:8, fontWeight:700, fontSize:15, border:'none', cursor:'pointer', marginBottom:20 }}>
            {content.finalCta.ctaText}
          </button>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>
            {(content.finalCta as any).trust ?? '✓ Free packing · ✓ Personal shopper · ✓ All cards accepted'}
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#F8F9FF', borderTop:'1.5px solid #E8ECF8', padding:'40px 32px' }}>
        <div className="footer-grid" style={{ maxWidth:960, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:28 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <Image src="/logo.png" alt="" width={32} height={32} style={{ borderRadius:'50%', objectFit:'cover' }} />
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:14, color:'#1B2A6B' }}>Kado Bajo</span>
            </div>
            <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.7 }}>The most complete NTT souvenir experience — at Komodo Airport.</p>
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#7a6e61', marginBottom:8 }}>Location</p>
            <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.7 }}>Jl. Yohanes Sehadun, Labuan Bajo<br />Depan Bandara Komodo, NTT</p>
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#7a6e61', marginBottom:8 }}>Contact</p>
            <a href={`https://wa.me/${DEFAULT_WHATSAPP}`} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#16A34A', textDecoration:'none' }}>
              📱 +62 821 4697 0988
            </a>
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#7a6e61', marginBottom:8 }}>Follow</p>
            <div style={{ display:'flex', gap:12 }}>
              <a href="#" style={{ fontSize:13, color:'#2D3F8F', textDecoration:'none', fontWeight:600 }}>Instagram</a>
              <a href="#" style={{ fontSize:13, color:'#2D3F8F', textDecoration:'none', fontWeight:600 }}>TikTok</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth:960, margin:'24px auto 0', paddingTop:20, borderTop:'1px solid #E8ECF8', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <p style={{ fontSize:12, color:'#9CA3AF' }}>© 2026 Kado Bajo. All rights reserved.</p>
          <a href="#" style={{ fontSize:12, color:'#9CA3AF', textDecoration:'none' }}>Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
