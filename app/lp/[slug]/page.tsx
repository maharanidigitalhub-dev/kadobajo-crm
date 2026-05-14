'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { LP_DATA, VALID_SLUGS, type LPSlug } from '../lp-data';

const WHATSAPP = '6282146970988';

export default function LandingPage() {
  const params = useParams();
  const slug = params.slug as LPSlug;
  const lp = LP_DATA[slug];

  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', flight_date: '', notes: '' });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!lp || !VALID_SLUGS.includes(slug)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>404</h1>
          <p style={{ color: '#6B7280' }}>Landing page not found.</p>
        </div>
      </div>
    );
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'WhatsApp number is required';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    setErrors({});
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, utm_source: slug, utm_medium: 'landing_page', utm_campaign: lp.audience }),
      });
    } catch { /* always redirect */ }
    finally { setLoading(false); }
    setSubmitted(true);
    setTimeout(() => {
      const msg = encodeURIComponent(`Hi Kado Bajo! I'm ${form.name} from ${form.country || 'abroad'} and I'd like to order souvenirs.${form.flight_date ? ` My flight is on ${form.flight_date}.` : ''}`);
      window.location.href = `https://wa.me/${WHATSAPP}?text=${msg}`;
    }, 1200);
  }

  const S = {
    section: 'padding: 72px 24px; max-width: 960px; margin: 0 auto;',
  };

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
        .nav-cta { display:none !important; }
        .scrolled .nav-cta { display:flex !important; }
        .benefit-card:hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(45,63,143,0.1) !important; border-color:rgba(45,63,143,0.25) !important; }
        .product-card:hover { box-shadow:0 4px 12px rgba(45,63,143,0.08) !important; }
        .faq-q:hover { background:#F8F9FF !important; }
        .form-input:focus { border-color:#2D3F8F !important; box-shadow:0 0 0 3px rgba(45,63,143,0.1) !important; background:white !important; }
        .form-input::placeholder { color:#9CA3AF; }
        .form-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(45,63,143,0.35) !important; }
        .form-submit:disabled { opacity:0.55; cursor:not-allowed; }
        @media(max-width:640px) {
          .section { padding:48px 20px !important; }
          .steps-grid { grid-template-columns:1fr !important; }
          .benefits-grid { grid-template-columns:1fr !important; }
          .products-grid { grid-template-columns:1fr 1fr !important; }
          .testimonials-grid { grid-template-columns:1fr !important; }
          .problem-grid { grid-template-columns:1fr !important; }
          .form-row { grid-template-columns:1fr !important; }
          .final-cta-box { padding:40px 24px !important; border-radius:16px !important; }
          .hero-logo-img { width:120px !important; height:120px !important; }
        }
      `}</style>

      {/* ── 1. NAVBAR ── */}
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
          <img src="/logo.png" alt="Kado Bajo" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover' }} />
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:'#1B2A6B', letterSpacing:1, textTransform:'uppercase' }}>Kado Bajo</span>
        </div>
        <button className="nav-cta" onClick={scrollToForm} style={{
          display:'none', alignItems:'center', gap:6,
          background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white',
          border:'none', cursor:'pointer', padding:'9px 20px', borderRadius:6,
          fontSize:13, fontWeight:700, transition:'all 0.2s',
        }}>Order Now →</button>
      </nav>

      {/* ── 2. HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'120px 24px 80px', background:'linear-gradient(180deg,#F8F9FF 0%,#fff 60%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:600, background:'radial-gradient(ellipse,rgba(45,63,143,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div className="fadeUp d1" style={{ marginBottom:28 }}>
          <div className="logo-float">
            <div className="logo-pulse">
              <img src="/logo.png" alt="Kado Bajo" className="hero-logo-img" style={{ width:160, height:160, borderRadius:'50%', objectFit:'cover', display:'block', boxShadow:'0 12px 48px rgba(45,63,143,0.28)' }} />
            </div>
          </div>
        </div>
        <p className="fadeUp d1" style={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color:'#2D3F8F', marginBottom:20 }}>{lp.hero.eyebrow}</p>
        <h1 className="serif fadeUp d2" style={{ fontSize:'clamp(28px,5vw,56px)', color:'#1a1209', lineHeight:1.15, marginBottom:24, maxWidth:780 }}>
          {lp.hero.headline}{' '}
          <em style={{ color:'#2D3F8F', fontStyle:'normal' }}>{lp.hero.headlineEm}</em>
          {lp.hero.headlineEnd ? <>{' '}{lp.hero.headlineEnd}</> : null}
        </h1>
        <p className="fadeUp d2" style={{ fontSize:'clamp(15px,2vw,18px)', color:'#7a6e61', lineHeight:1.7, maxWidth:520, margin:'0 auto 32px', fontWeight:300 }}>{lp.hero.subheadline}</p>
        <button className="fadeUp d3" onClick={scrollToForm} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', padding:'16px 36px', borderRadius:6, fontSize:15, fontWeight:700, border:'none', cursor:'pointer', marginBottom:16 }}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          {lp.hero.cta}
        </button>
        <p style={{ fontSize:13, color:'#2D3F8F', fontWeight:600, marginBottom:28 }}>{lp.hero.urgency}</p>
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8 }}>
          {['✓ Free packing & gift wrap','✓ Personal shopper included','✓ All major cards accepted'].map(b => (
            <span key={b} style={{ fontSize:12, fontWeight:500, padding:'8px 16px', borderRadius:20, color:'#2D3F8F', border:'1.5px solid rgba(45,63,143,0.2)', background:'rgba(45,63,143,0.04)' }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── 3. TRUST BAR ── */}
      <div style={{ background:'#f7f2ea', borderTop:'1px solid rgba(180,160,120,0.2)', borderBottom:'1px solid rgba(180,160,120,0.2)', padding:'20px 24px' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'center', gap:24 }}>
          {[{icon:'🌍',text:'30+ Countries',sub:'Trusted worldwide'},{icon:'⭐',text:'5-Star Rated',sub:'Tripadvisor & Google'},{icon:'✈️',text:'At Komodo Airport',sub:'Before check-in'},{icon:'🎁',text:'Personal Shopper',sub:'Included — Free'}].map(t => (
            <div key={t.text} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <div><div style={{ fontSize:13, fontWeight:600, color:'#1a1209' }}>{t.text}</div><div style={{ fontSize:11, color:'#7a6e61' }}>{t.sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. PROBLEM → SOLUTION ── */}
      <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>{lp.problem.sectionLabel}</p>
        <h2 className="serif" style={{ fontSize:32, color:'#1a1209', lineHeight:1.25, marginBottom:32, maxWidth:560 }}>{lp.problem.title}</h2>
        <div className="problem-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'center' }}>
          <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:14 }}>
            {lp.problem.pains.map((p, i) => (
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', background:'#FEF2F2', borderRadius:8, borderLeft:'3px solid #EF4444' }}>
                <span style={{ color:'#EF4444', fontWeight:700, flexShrink:0 }}>✕</span>
                <span style={{ fontSize:14, color:'#374151', lineHeight:1.6 }}>{p}</span>
              </li>
            ))}
          </ul>
          <div style={{ background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', borderRadius:16, padding:32, color:'white' }}>
            <h3 className="serif" style={{ fontSize:22, marginBottom:16, lineHeight:1.35 }}>{lp.problem.bridge}</h3>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.75 }}>The most complete NTT souvenir experience. Curated, packed, and waiting at Komodo Airport — before you even check in.</p>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>Simple Process</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:40 }}>How It Works</h2>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              {n:'01',c:'#2D3F8F',title:'Order Online',desc:'Fill in the form below. Tell us your flight date, budget, and who you\'re buying for. 2 minutes.'},
              {n:'02',c:'#b8922a',title:'We Prepare Everything',desc:'Your personal shopper selects, packs, and gift-wraps your entire order. You do nothing.'},
              {n:'03',c:'#2d5a3d',title:'Pick Up at the Airport',desc:'Come to Kado Bajo at Komodo Airport before check-in. Grab your order. Fly home.'},
            ].map(s => (
              <div key={s.n} style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:14, padding:'28px 24px', position:'relative' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:s.c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:'white', marginBottom:16 }}>{s.n}</div>
                <div style={{ fontWeight:700, fontSize:15, color:'#1a1209', marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:13, color:'#7a6e61', lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 6. BENEFITS ── */}
      <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>Why Kado Bajo</p>
        <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>What makes us different</h2>
        <div className="benefits-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {lp.benefits.map((b, i) => (
            <div key={i} className="benefit-card" style={{ background:'#F8F9FF', border:'1.5px solid #E8ECF8', borderRadius:14, padding:'24px 20px', transition:'all 0.2s' }}>
              <div style={{ fontSize:24, marginBottom:12 }}>{b.icon}</div>
              <div style={{ fontWeight:700, fontSize:14, color:'#1B2A6B', marginBottom:8 }}>{b.title}</div>
              <div style={{ fontSize:13, color:'#7a6e61', lineHeight:1.7 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. PRODUCTS ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>What's Inside</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>Our curated collection</h2>
          <div className="products-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
            {[
              {icon:'🧵',title:'Tenun Ikat & Songke',desc:'Handwoven traditional cloth. Manggarai & Flores motifs. Each piece unique.'},
              {icon:'☕',title:'Artisan Flores Coffee',desc:'Single-origin NTT highland coffee. Roasted locally. Beans or ground.'},
              {icon:'🍯',title:'Wild Forest Honey',desc:'Raw, unfiltered honey from NTT forests. No additives. Traceable origin.'},
              {icon:'🦎',title:'Komodo Carvings',desc:'Hand-carved wood figures by local artisans. Keychains to display pieces.'},
              {icon:'💎',title:'Pearls & Jewellery',desc:'Freshwater pearls and handmade jewellery from local craftspeople.'},
              {icon:'🍪',title:'Local Snacks',desc:'Kompiang, Pia Bajo, local spices — authentic NTT flavours, travel-packaged.'},
            ].map(p => (
              <div key={p.title} className="product-card" style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, padding:20, transition:'all 0.2s' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{p.icon}</div>
                <div style={{ fontWeight:700, fontSize:14, color:'#1a1209', marginBottom:6 }}>{p.title}</div>
                <div style={{ fontSize:12, color:'#7a6e61', lineHeight:1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 8. TESTIMONIALS ── */}
      <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>Reviews</p>
        <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>What travellers say</h2>
        <div className="testimonials-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
          {lp.testimonials.map((t, i) => (
            <div key={i} style={{ background:'#F8F9FF', border:'1.5px solid #E8ECF8', borderRadius:14, padding:24 }}>
              <div style={{ color:'#F59E0B', fontSize:14, letterSpacing:2, marginBottom:12 }}>★★★★★</div>
              <p style={{ fontSize:14, color:'#374151', lineHeight:1.75, fontStyle:'italic', marginBottom:16 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>{t.flag}</span>
                <div><div style={{ fontSize:13, fontWeight:700, color:'#1B2A6B' }}>{t.name}</div><div style={{ fontSize:11, color:'#7a6e61' }}>{t.location}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. MID CTA ── */}
      <div style={{ background:'#f7f2ea', borderTop:'1px solid rgba(180,160,120,0.2)', borderBottom:'1px solid rgba(180,160,120,0.2)', padding:'48px 32px', textAlign:'center' }}>
        <h3 className="serif" style={{ fontSize:26, color:'#1a1209', marginBottom:20 }}>{lp.midCta.headline}</h3>
        <button onClick={scrollToForm} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', padding:'16px 32px', borderRadius:6, fontSize:15, fontWeight:700, border:'none', cursor:'pointer' }}>
          {lp.midCta.cta}
        </button>
        <p style={{ fontSize:13, color:'#7a6e61', marginTop:14 }}>Free packing · Personal shopper included · All cards accepted</p>
      </div>

      {/* ── 10. LEAD FORM ── */}
      <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <div ref={formRef} style={{ maxWidth:640, margin:'0 auto' }}>
          <div style={{ background:'white', border:'2px solid #E8ECF8', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 48px rgba(45,63,143,0.12)' }}>
            <div style={{ background:'linear-gradient(135deg,#1B2A6B,#2D3F8F)', padding:'28px 32px', display:'flex', gap:16, alignItems:'center' }}>
              <img src="/logo.png" alt="" style={{ width:56, height:56, borderRadius:'50%', objectFit:'cover', flexShrink:0, boxShadow:'0 0 0 2px rgba(255,255,255,0.2)' }} />
              <div>
                <h2 className="serif" style={{ fontSize:18, color:'white', marginBottom:4, lineHeight:1.3 }}>{lp.form.headline}</h2>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{lp.form.subheadline}</p>
              </div>
            </div>
            <div style={{ padding:'28px 32px' }}>
              {submitted ? (
                <div style={{ textAlign:'center', padding:'32px 0' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                  <h3 className="serif" style={{ fontSize:20, marginBottom:8 }}>You&apos;re all set!</h3>
                  <p style={{ color:'#7a6e61', fontSize:14 }}>Redirecting you to WhatsApp to confirm your order&#8230;</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }} className="form-row">
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Full Name *</label>
                      <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" style={{ width:'100%', padding:'12px 16px', borderRadius:10, border:`1.5px solid ${errors.name ? '#EF4444' : '#E5E7EB'}`, background: errors.name ? '#FEF2F2' : '#F9FAFB', fontSize:14, outline:'none', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif", color:'#111827' }} />
                      {errors.name && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#6B7280', marginBottom:6 }}>Country *</label>
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
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }} className="form-row">
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
                    💡 Only the fields marked * are required. More info helps your personal shopper curate a better selection.
                  </div>
                  {errors.submit && <div style={{ fontSize:13, color:'#DC2626', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'12px 16px', marginBottom:16 }}>{errors.submit}</div>}
                  <button type="submit" className="form-submit" disabled={loading} style={{ width:'100%', padding:16, borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:15, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif" }}>
                    {loading ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />Processing…</> : (
                      <><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>{lp.form.cta}</>
                    )}
                  </button>
                  <p style={{ fontSize:12, color:'#9CA3AF', textAlign:'center', marginTop:14 }}>No payment now · Personal shopper contacts you within a few hours · Free packing & gift wrap</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <div style={{ background:'#F8F9FF', borderTop:'1px solid #E8ECF8', borderBottom:'1px solid #E8ECF8' }}>
        <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', color:'#2D3F8F', marginBottom:12 }}>FAQ</p>
          <h2 className="serif" style={{ fontSize:32, color:'#1a1209', marginBottom:32 }}>Questions? Answered.</h2>
          <div style={{ maxWidth:680, display:'flex', flexDirection:'column', gap:10 }}>
            {lp.faqs.map((f, i) => (
              <div key={i} style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, overflow:'hidden' }}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width:'100%', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', textAlign:'left', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, color:'#1a1209', transition:'background 0.15s' }}>
                  {f.q}
                  <span style={{ fontSize:20, color:'#2D3F8F', flexShrink:0, marginLeft:12, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition:'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && <div style={{ padding:'14px 20px 16px', fontSize:14, color:'#7a6e61', lineHeight:1.75, borderTop:'1px solid #F3F4F6' }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── 12. FINAL CTA ── */}
      <section className="section" style={{ padding:'72px 24px', maxWidth:960, margin:'0 auto' }}>
        <div className="final-cta-box" style={{ background:'linear-gradient(135deg,#1B2A6B,#2D3F8F)', borderRadius:20, padding:'56px 40px', textAlign:'center', maxWidth:720, margin:'0 auto' }}>
          <h2 className="serif" style={{ fontSize:'clamp(24px,4vw,38px)', color:'white', marginBottom:16, lineHeight:1.25 }}>{lp.finalCta.headline}</h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.7)', marginBottom:32, lineHeight:1.7, maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>{lp.finalCta.body}</p>
          <button onClick={scrollToForm} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'white', color:'#1B2A6B', padding:'16px 36px', borderRadius:8, fontWeight:700, fontSize:15, border:'none', cursor:'pointer', marginBottom:20 }}>
            {lp.finalCta.cta}
          </button>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>✓ Free packing &nbsp;·&nbsp; ✓ Personal shopper &nbsp;·&nbsp; ✓ All cards accepted</p>
        </div>
      </section>

      {/* ── 13. FOOTER ── */}
      <footer style={{ background:'#F8F9FF', borderTop:'1.5px solid #E8ECF8', padding:'40px 32px' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:28 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <img src="/logo.png" alt="" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover' }} />
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
            <a href={`https://wa.me/${WHATSAPP}`} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'#16A34A', textDecoration:'none' }}>
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
