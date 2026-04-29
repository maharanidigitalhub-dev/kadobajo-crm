'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LP_DATA, VALID_SLUGS, type LPSlug } from '../../lp/lp-data';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SLUG_META: Record<LPSlug, { label: string; flag: string; color: string }> = {
  'lp':   { label: 'Universal',  flag: '🌍', color: '#2D3F8F' },
  'lp-2': { label: 'EU / US',    flag: '🇺🇸', color: '#1D4ED8' },
  'lp-3': { label: 'SEA',        flag: '🇸🇬', color: '#0369A1' },
  'lp-4': { label: 'AUS / NZ',   flag: '🇦🇺', color: '#047857' },
  'lp-5': { label: 'Indonesia',  flag: '🇮🇩', color: '#DC2626' },
};

// ── Inner component that uses useSearchParams (must be inside Suspense) ──
function CMSInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSlug = searchParams.get('slug') as LPSlug | null;
  const [activeSlug, setActiveSlug] = useState<LPSlug>(
    urlSlug && VALID_SLUGS.includes(urlSlug) ? urlSlug : 'lp'
  );

  useEffect(() => {
    if (urlSlug && VALID_SLUGS.includes(urlSlug) && urlSlug !== activeSlug) {
      setActiveSlug(urlSlug);
    }
  }, [urlSlug]);

  const [activeSection, setActiveSection] = useState<'hero' | 'copy' | 'faqs'>('hero');
  const [overrides, setOverrides] = useState<Partial<Record<LPSlug, any>>>({});
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/cms').then(r => r.ok ? r.json() : null).then(data => {
      if (data?.lp_overrides) setOverrides(data.lp_overrides);
    }).catch(() => {});
  }, []);

  const lp = LP_DATA[activeSlug];
  const ov = overrides[activeSlug] ?? {};

  function update(path: string, val: any) {
    setOverrides(prev => ({
      ...prev,
      [activeSlug]: { ...(prev[activeSlug] ?? {}), [path]: val },
    }));
  }

  function get(path: string, fallback: any) {
    return ov[path] !== undefined ? ov[path] : fallback;
  }

  function switchSlug(slug: LPSlug) {
    setActiveSlug(slug);
    router.replace(`/admin/cms?slug=${slug}`, { scroll: false });
  }

  async function handleSave() {
    setStatus('saving');
    try {
      const current = await fetch('/api/cms').then(r => r.ok ? r.json() : {}).catch(() => ({}));
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, lp_overrides: overrides }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setStatus('saved'); setTimeout(() => setStatus('idle'), 2500); }
      else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  }

  async function handleImageUpload(file: File) {
    setUploadError('');
    // No size limit
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) { setUploadError(data.error ?? 'Upload failed'); return; }
      update('hero_bg_image_url', data.url);
      update('hero_bg_type', 'image');
    } catch { setUploadError('Upload failed.'); }
    finally { setUploading(false); }
  }

  const S = {
    input: { width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, color:'#111827', outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' as const },
    label: { display:'block', fontSize:11, fontWeight:700 as const, textTransform:'uppercase' as const, letterSpacing:'1px', color:'#9CA3AF', marginBottom:6 },
    card: { background:'white', border:'1.5px solid #E8ECF8', borderRadius:16, padding:24, marginBottom:16 },
    fieldWrap: { marginBottom:16 },
  };

  const currentMeta = SLUG_META[activeSlug];
  const bgType     = get('hero_bg_type', 'gradient');
  const bgImageUrl = get('hero_bg_image_url', '');
  const bgOverlay  = get('hero_bg_overlay', 40);
  const bgColor    = get('hero_bg_color', '#F0F3FD');

  return (
    <div style={{ padding:32, fontFamily:"'DM Sans',sans-serif", maxWidth:900 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        input:focus, textarea:focus { border-color:#2D3F8F !important; box-shadow:0 0 0 3px rgba(45,63,143,0.1) !important; }
        textarea { resize:vertical; }
        .save-badge { animation: fadeIn 0.2s ease; }
        .drop-zone { border:2px dashed #C7D0F0; border-radius:12px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:#F8F9FF; }
        .drop-zone:hover { border-color:#2D3F8F; background:#F0F3FD; }
        .slug-tab { padding:8px 14px; border-radius:8px; border:1.5px solid #E8ECF8; cursor:pointer; transition:all 0.15s; background:white; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; }
        .section-tab { padding:7px 16px; border-radius:8px; font-size:13px; font-weight:600; border:none; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#111827', margin:0 }}>Landing Page CMS</h1>
          <p style={{ fontSize:13, color:'#9CA3AF', marginTop:4 }}>Edit konten untuk 5 audience landing pages</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {status === 'saved' && <span className="save-badge" style={{ fontSize:13, color:'#10B981', fontWeight:600 }}>✓ Tersimpan!</span>}
          {status === 'error' && <span className="save-badge" style={{ fontSize:13, color:'#EF4444', fontWeight:600 }}>✗ Gagal simpan</span>}
          <a href={`https://kadobajo.id/${activeSlug}`} target="_blank" rel="noreferrer"
            style={{ fontSize:13, color:'#6B7280', textDecoration:'none', padding:'8px 16px', border:'1.5px solid #E5E7EB', borderRadius:8 }}>
            Preview {activeSlug} ↗
          </a>
          <button onClick={handleSave} disabled={status === 'saving'}
            style={{ padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', background: status === 'saving' ? '#9CA3AF' : 'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
            {status === 'saving'
              ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />Menyimpan…</>
              : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* LP Slug Tabs */}
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', color:'#9CA3AF', marginBottom:10 }}>Landing Page</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {VALID_SLUGS.map(slug => {
            const m = SLUG_META[slug];
            const active = slug === activeSlug;
            const hasOverride = Object.keys(overrides[slug] ?? {}).length > 0;
            return (
              <button key={slug} className="slug-tab" onClick={() => switchSlug(slug)}
                style={{ background: active ? m.color : 'white', color: active ? 'white' : '#374151', borderColor: active ? m.color : '#E8ECF8', position:'relative' }}>
                {m.flag} {m.label}
                <span style={{ fontSize:10, color: active ? 'rgba(255,255,255,0.7)' : '#9CA3AF', display:'block' }}>/{slug}</span>
                {hasOverride && !active && (
                  <span style={{ position:'absolute', top:4, right:4, width:6, height:6, borderRadius:'50%', background:'#F59E0B' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:24, background:'#F3F4F6', padding:4, borderRadius:10, width:'fit-content' }}>
        {([['hero','🖼️ Hero & Background'],['copy','✍️ Teks & Copy'],['faqs','❓ FAQ']] as const).map(([key, label]) => (
          <button key={key} className="section-tab" onClick={() => setActiveSection(key as any)}
            style={{ background: activeSection === key ? currentMeta.color : 'transparent', color: activeSection === key ? 'white' : '#6B7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── HERO & BG ── */}
      {activeSection === 'hero' && (
        <div style={S.card}>
          <p style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:16 }}>🖼️ Background Hero — {currentMeta.flag} {currentMeta.label}</p>
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {[['gradient','✨ Gradient'],['color','🎨 Solid Color'],['image','🖼️ Gambar']].map(([key, label]) => (
              <button key={key} onClick={() => update('hero_bg_type', key)}
                style={{ padding:'10px 16px', borderRadius:10, border:`1.5px solid ${bgType === key ? currentMeta.color : '#E5E7EB'}`, cursor:'pointer', fontSize:13, fontWeight:600, background: bgType === key ? '#F0F3FD' : 'white', color: bgType === key ? currentMeta.color : '#6B7280', fontFamily:"'DM Sans',sans-serif" }}>
                {label}
              </button>
            ))}
          </div>

          {bgType === 'gradient' && (
            <div style={{ background:'linear-gradient(160deg,#F0F3FD,#F8F9FF)', borderRadius:10, padding:16, textAlign:'center' }}>
              <p style={{ fontSize:13, color:'#6B7280', margin:0 }}>✨ Gradient default biru-putih</p>
            </div>
          )}

          {bgType === 'color' && (
            <div>
              <label style={S.label}>Warna Background</label>
              <div style={{ display:'flex', gap:12 }}>
                <input type="color" value={bgColor} onChange={e => update('hero_bg_color', e.target.value)}
                  style={{ width:56, height:44, borderRadius:10, border:'1.5px solid #E5E7EB', cursor:'pointer', padding:4 }} />
                <input style={S.input} value={bgColor} onChange={e => update('hero_bg_color', e.target.value)} placeholder="#F8F9FF" />
              </div>
              <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                {['#F8F9FF','#FDF8F0','#0D1117','#1B2A6B','#2D3F8F','#FFFFFF','#1a1209','#F7F2EA'].map(c => (
                  <button key={c} onClick={() => update('hero_bg_color', c)}
                    style={{ width:32, height:32, borderRadius:8, background:c, border: bgColor === c ? `3px solid ${currentMeta.color}` : '1.5px solid #E5E7EB', cursor:'pointer' }} />
                ))}
              </div>
            </div>
          )}

          {bgType === 'image' && (
            <div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
                onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />

              {bgImageUrl ? (
                <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bgImageUrl} alt="Hero BG" style={{ width:'100%', height:180, objectFit:'cover', display:'block' }} />
                  <div style={{ position:'absolute', inset:0, background:`rgba(0,0,0,${bgOverlay/100})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ color:'white', fontSize:12, background:'rgba(0,0,0,0.5)', padding:'4px 10px', borderRadius:20 }}>Preview overlay {bgOverlay}%</span>
                  </div>
                  <button onClick={() => { update('hero_bg_image_url',''); update('hero_bg_type','gradient'); }}
                    style={{ position:'absolute', top:8, right:8, background:'#EF4444', color:'white', border:'none', borderRadius:8, padding:'4px 10px', fontSize:12, cursor:'pointer' }}>
                    ✕ Hapus
                  </button>
                </div>
              ) : (
                <div className="drop-zone" onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}>
                  {uploading
                    ? <span style={{ width:24, height:24, border:'3px solid #C7D0F0', borderTopColor:currentMeta.color, borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
                    : <div>
                        <div style={{ fontSize:32, marginBottom:8 }}>📸</div>
                        <p style={{ fontWeight:600, color:'#374151', margin:'0 0 4px' }}>Klik atau drag gambar</p>
                        <p style={{ fontSize:12, color:'#9CA3AF', margin:0 }}>JPG, PNG, WebP · Rekomendasi 1920×1080px</p>
                      </div>
                  }
                </div>
              )}

              {uploadError && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', marginTop:8, fontSize:13, color:'#DC2626' }}>
                  {uploadError}
                </div>
              )}

              <div style={{ marginTop:16 }}>
                <label style={S.label}>Atau masukkan URL gambar</label>
                <input style={S.input} value={bgImageUrl.startsWith('data:') ? '' : bgImageUrl}
                  onChange={e => update('hero_bg_image_url', e.target.value)} placeholder="https://..." />
              </div>

              {bgImageUrl && (
                <div style={{ marginTop:16 }}>
                  <label style={S.label}>Kegelapan Overlay: {bgOverlay}%</label>
                  <input type="range" min={0} max={80} step={5} value={bgOverlay}
                    onChange={e => update('hero_bg_overlay', Number(e.target.value))}
                    style={{ width:'100%', accentColor:currentMeta.color }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#9CA3AF', marginTop:4 }}>
                    <span>Terang</span><span>Gelap</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── COPY ── */}
      {activeSection === 'copy' && (
        <div style={S.card}>
          <p style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:20 }}>✍️ Teks — {currentMeta.flag} {currentMeta.label}</p>
          <p style={{ fontSize:12, color:'#9CA3AF', background:'#F8F9FF', padding:'8px 12px', borderRadius:8, marginBottom:20 }}>
            💡 Kosongkan field untuk menggunakan copy default dari template. Isi hanya yang ingin di-override.
          </p>
          {[
            { key:'hero_eyebrow',       label:'Eyebrow Text',       default: lp.hero.eyebrow },
            { key:'hero_headline',      label:'Hero Headline',      default: lp.hero.headline,     multiline:true },
            { key:'hero_headline_em',   label:'Headline Emphasis',  default: lp.hero.headlineEm },
            { key:'hero_headline_end',  label:'Headline End',       default: lp.hero.headlineEnd },
            { key:'hero_subheadline',   label:'Subheadline',        default: lp.hero.subheadline,  multiline:true },
            { key:'hero_cta',           label:'CTA Button Text',    default: lp.hero.cta },
            { key:'hero_urgency',       label:'Urgency Hook',       default: lp.hero.urgency },
            { key:'form_headline',      label:'Form Headline',      default: lp.form.headline },
            { key:'form_subheadline',   label:'Form Sub-copy',      default: lp.form.subheadline },
            { key:'form_cta',           label:'Form CTA Button',    default: lp.form.cta },
            { key:'final_cta_headline', label:'Final CTA Headline', default: lp.finalCta.headline },
            { key:'final_cta_body',     label:'Final CTA Body',     default: lp.finalCta.body,     multiline:true },
          ].map(field => (
            <div key={field.key} style={S.fieldWrap}>
              <label style={S.label}>{field.label}</label>
              {field.multiline ? (
                <textarea style={{ ...S.input, minHeight:64 }} value={get(field.key, '')}
                  onChange={e => update(field.key, e.target.value)}
                  placeholder={`Default: "${field.default?.slice(0,60) ?? ''}${(field.default?.length ?? 0) > 60 ? '…' : ''}"`} />
              ) : (
                <input style={S.input} value={get(field.key, '')}
                  onChange={e => update(field.key, e.target.value)}
                  placeholder={`Default: "${field.default?.slice(0,60) ?? ''}${(field.default?.length ?? 0) > 60 ? '…' : ''}"`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── FAQ ── */}
      {activeSection === 'faqs' && (
        <div style={S.card}>
          <p style={{ fontSize:13, fontWeight:700, color:'#374151', marginBottom:8 }}>❓ FAQ — {currentMeta.flag} {currentMeta.label}</p>
          <p style={{ fontSize:12, color:'#9CA3AF', marginBottom:20 }}>FAQ default sudah ada dari template. Override di sini jika perlu.</p>
          {lp.faqs.map((faq, i) => (
            <div key={i} style={{ background:'#F8F9FF', border:'1.5px solid #E8ECF8', borderRadius:12, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:12 }}>FAQ {i+1}</p>
              <div style={S.fieldWrap}>
                <label style={S.label}>Pertanyaan</label>
                <input style={S.input} value={get(`faq_${i}_q`, '')}
                  onChange={e => update(`faq_${i}_q`, e.target.value)} placeholder={`Default: "${faq.q}"`} />
              </div>
              <div>
                <label style={S.label}>Jawaban</label>
                <textarea style={{ ...S.input, minHeight:64 }} value={get(`faq_${i}_a`, '')}
                  onChange={e => update(`faq_${i}_a`, e.target.value)}
                  placeholder={`Default: "${faq.a.slice(0,80)}…"`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Suspense boundary required for useSearchParams ──
function CMSFallback() {
  return (
    <div style={{ padding:32, display:'flex', alignItems:'center', justifyContent:'center', minHeight:200 }}>
      <span style={{ width:24, height:24, border:'3px solid #E8ECF8', borderTopColor:'#2D3F8F', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CMSPage() {
  return (
    <Suspense fallback={<CMSFallback />}>
      <CMSInner />
    </Suspense>
  );
}
