'use client';

import { useState, useEffect, useRef } from 'react';

interface CMSContent {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    urgency: string;
    cta: string;
    bg_type: 'gradient' | 'image' | 'color';
    bg_color: string;
    bg_image_url: string;
    bg_overlay: number;
  };
  trust: { icon: string; text: string; sub: string }[];
  whatsapp: string;
}

const DEFAULT: CMSContent = {
  hero: {
    eyebrow: 'Komodo Airport · Labuan Bajo · NTT',
    headline: 'The Best of East Nusa Tenggara — Ready at Komodo Airport Before You Fly Home',
    subheadline: 'Order online. Your personal shopper prepares everything. Pick up right before check-in — zero stress, zero luggage hassle.',
    urgency: "⏰ Order before your flight. We'll have everything packed and ready at the airport.",
    cta: 'Reserve My Gifts Now →',
    bg_type: 'gradient',
    bg_color: '#F0F3FD',
    bg_image_url: '',
    bg_overlay: 40,
  },
  trust: [
    { icon: '🌍', text: '30+ Countries', sub: 'Trusted by travellers worldwide' },
    { icon: '⭐', text: '5-Star Rated', sub: 'Tripadvisor & Google' },
    { icon: '✈️', text: 'Right at Komodo Airport', sub: 'Before check-in counters' },
    { icon: '🎁', text: 'Personal Shopper — Free', sub: 'No other souvenir shop has this' },
  ],
  whatsapp: '6282146970988',
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function CMSPage() {
  const [content, setContent] = useState<CMSContent>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [activeTab, setActiveTab] = useState<'hero' | 'trust' | 'settings'>('hero');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/cms')
      .then(r => r.json())
      .then(data => { if (data && !data.error) setContent({ ...DEFAULT, ...data, hero: { ...DEFAULT.hero, ...data.hero } }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setStatus('saving');
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok && data.success) { setStatus('saved'); setTimeout(() => setStatus('idle'), 2500); }
      else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), async function handleImageUpload(file: File) {
  setUploadError('');
  if (file.size > 5 * 1024 * 1024) { setUploadError('File terlalu besar. Max 5MB.'); return; }
  if (!file.type.startsWith('image/')) { setUploadError('Hanya file gambar yang diizinkan.'); return; }

  setUploading(true);
  try {
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();

    if (!res.ok || !data.url) {
      setUploadError(data.error ?? 'Upload gagal. Coba lagi.');
      setUploading(false);
      return;
    }

    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, bg_image_url: data.url, bg_type: 'image' }
    }));
  } catch { setUploadError('Upload gagal. Coba lagi.'); }
  finally { setUploading(false); }
}
  
  
  function updateHero(key: keyof CMSContent['hero'], val: string | number) {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, [key]: val } }));
  }

  function updateTrust(idx: number, key: string, val: string) {
    setContent(prev => {
      const trust = [...prev.trust];
      trust[idx] = { ...trust[idx], [key]: val };
      return { ...prev, trust };
    });
  }

  // Preview background style
  const previewBg = () => {
    const h = content.hero;
    if (h.bg_type === 'image' && h.bg_image_url) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,${h.bg_overlay / 100}), rgba(0,0,0,${h.bg_overlay / 100})), url(${h.bg_image_url})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      };
    }
    if (h.bg_type === 'color') return { background: h.bg_color };
    return { background: 'linear-gradient(160deg, #F0F3FD 0%, #F8F9FF 50%, #EEF1FB 100%)' };
  };

  const S = {
    input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 14, color: '#111827', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' as const },
    label: { display: 'block', fontSize: 11, fontWeight: 700 as const, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#9CA3AF', marginBottom: 6 },
    tab: (a: boolean) => ({ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600 as const, border: 'none', cursor: 'pointer' as const, background: a ? '#2D3F8F' : 'transparent', color: a ? 'white' : '#6B7280' }),
    card: { background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 24, marginBottom: 16 },
    sectionTitle: { fontSize: 13, fontWeight: 700 as const, color: '#374151', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
    row: { display: 'flex', flexDirection: 'column' as const, gap: 16 },
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #E8ECF8', borderTopColor: '#2D3F8F', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: 860, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        .save-badge { animation: fadeIn 0.2s ease; }
        input:focus, textarea:focus { border-color: #2D3F8F !important; box-shadow: 0 0 0 3px rgba(45,63,143,0.1) !important; }
        textarea { resize: vertical; }
        .drop-zone { border: 2px dashed #C7D0F0; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: #F8F9FF; }
        .drop-zone:hover { border-color: #2D3F8F; background: #F0F3FD; }
        .bg-type-btn { padding: 10px 16px; border-radius: 10px; border: 1.5px solid #E5E7EB; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s; background: white; color: #6B7280; }
        .bg-type-btn.active { border-color: #2D3F8F; background: #F0F3FD; color: #2D3F8F; }
        .range-input { width: 100%; accent-color: #2D3F8F; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#111827', margin: 0 }}>Mini CMS</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Edit konten landing page kadobajo.id</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'saved' && <span className="save-badge" style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>✓ Tersimpan!</span>}
          {status === 'error' && <span className="save-badge" style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>✗ Gagal simpan</span>}
          <a href="https://kadobajo.id" target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', padding: '8px 16px', border: '1.5px solid #E5E7EB', borderRadius: 8 }}>
            Preview ↗
          </a>
          <button onClick={handleSave} disabled={status === 'saving'}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', background: status === 'saving' ? '#9CA3AF' : 'linear-gradient(135deg, #2D3F8F, #1B2A6B)', color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            {status === 'saving' ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Menyimpan…</> : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#F3F4F6', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {(['hero', 'trust', 'settings'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={S.tab(activeTab === tab)}>
            {tab === 'hero' ? '🎯 Hero' : tab === 'trust' ? '⭐ Trust Bar' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* ── HERO TAB ── */}
      {activeTab === 'hero' && (
        <div style={S.row}>

          {/* BACKGROUND SECTION */}
          <div style={S.card}>
            <p style={S.sectionTitle}>
              <span style={{ fontSize: 16 }}>🖼️</span> Background Hero
            </p>

            {/* Type selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[
                { key: 'gradient', label: '✨ Gradient', desc: 'Default biru-putih' },
                { key: 'color', label: '🎨 Solid Color', desc: 'Satu warna datar' },
                { key: 'image', label: '🖼️ Gambar', desc: 'Upload foto/gambar' },
              ].map(opt => (
                <button key={opt.key}
                  className={`bg-type-btn${content.hero.bg_type === opt.key ? ' active' : ''}`}
                  onClick={() => updateHero('bg_type', opt.key)}>
                  <div>{opt.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Gradient — no options needed */}
            {content.hero.bg_type === 'gradient' && (
              <div style={{ background: 'linear-gradient(160deg, #F0F3FD, #F8F9FF, #EEF1FB)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>✨ Menggunakan gradient default biru-putih</p>
              </div>
            )}

            {/* Solid Color */}
            {content.hero.bg_type === 'color' && (
              <div>
                <label style={S.label}>Pilih Warna Background</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="color" value={content.hero.bg_color}
                    onChange={e => updateHero('bg_color', e.target.value)}
                    style={{ width: 56, height: 44, borderRadius: 10, border: '1.5px solid #E5E7EB', cursor: 'pointer', padding: 4 }} />
                  <input style={{ ...S.input, flex: 1 }} value={content.hero.bg_color}
                    onChange={e => updateHero('bg_color', e.target.value)}
                    placeholder="#F8F9FF" />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {['#F8F9FF', '#FDF8F0', '#F0FDF4', '#FFF7ED', '#1B2A6B', '#0A0E1A', '#2D3F8F', '#FFFFFF'].map(c => (
                    <button key={c} onClick={() => updateHero('bg_color', c)}
                      style={{ width: 32, height: 32, borderRadius: 8, background: c, border: content.hero.bg_color === c ? '3px solid #2D3F8F' : '1.5px solid #E5E7EB', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            {content.hero.bg_type === 'image' && (
              <div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />

                {content.hero.bg_image_url ? (
                  <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                    <img src={content.hero.bg_image_url} alt="Hero BG"
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${content.hero.bg_overlay / 100})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 12, background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 20 }}>Preview dengan overlay</span>
                    </div>
                    <button onClick={() => { updateHero('bg_image_url', ''); updateHero('bg_type', 'gradient'); }}
                      style={{ position: 'absolute', top: 8, right: 8, background: '#EF4444', color: 'white', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>
                      ✕ Hapus
                    </button>
                  </div>
                ) : (
                  <div className="drop-zone" onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}>
                    {uploading ? (
                      <div>
                        <span style={{ width: 24, height: 24, border: '3px solid #C7D0F0', borderTopColor: '#2D3F8F', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite', marginBottom: 8 }} />
                        <p style={{ color: '#6B7280', fontSize: 14, margin: 0 }}>Mengupload…</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                        <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>Klik atau drag gambar ke sini</p>
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>JPG, PNG, WebP — max 5MB</p>
                        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>Rekomendasi: 1920×1080px landscape</p>
                      </div>
                    )}
                  </div>
                )}

                {uploadError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginTop: 8, fontSize: 13, color: '#DC2626' }}>
                    {uploadError}
                  </div>
                )}

                {/* URL input alternative */}
                <div style={{ marginTop: 16 }}>
                  <label style={S.label}>Atau masukkan URL gambar</label>
                  <input style={S.input} value={content.hero.bg_image_url.startsWith('data:') ? '' : content.hero.bg_image_url}
                    onChange={e => updateHero('bg_image_url', e.target.value)}
                    placeholder="https://example.com/hero-image.jpg" />
                </div>

                {/* Overlay control */}
                {content.hero.bg_image_url && (
                  <div style={{ marginTop: 16 }}>
                    <label style={S.label}>
                      Kegelapan Overlay: {content.hero.bg_overlay}%
                    </label>
                    <input type="range" className="range-input"
                      min={0} max={80} step={5}
                      value={content.hero.bg_overlay}
                      onChange={e => updateHero('bg_overlay', Number(e.target.value))} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                      <span>Terang (0%)</span>
                      <span>Gelap (80%)</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live mini preview */}
            <div style={{ marginTop: 20, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E8ECF8' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 14px', background: '#F8F9FF', borderBottom: '1px solid #E8ECF8' }}>
                Preview Background
              </div>
              <div style={{ ...previewBg(), height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: content.hero.bg_type === 'image' ? 'white' : '#6B7280', background: content.hero.bg_type === 'image' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: 20 }}>
                  Preview Hero Background
                </span>
              </div>
            </div>
          </div>

          {/* TEXT CONTENT SECTION */}
          <div style={S.card}>
            <p style={S.sectionTitle}><span style={{ fontSize: 16 }}>✍️</span> Konten Teks</p>
            <div style={S.row}>
              <div>
                <label style={S.label}>Eyebrow Text</label>
                <input style={S.input} value={content.hero.eyebrow}
                  onChange={e => updateHero('eyebrow', e.target.value)}
                  placeholder="Komodo Airport · Labuan Bajo · NTT" />
              </div>
              <div>
                <label style={S.label}>Headline Utama *</label>
                <textarea style={{ ...S.input, minHeight: 80 }} value={content.hero.headline}
                  onChange={e => updateHero('headline', e.target.value)} />
                <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Gunakan — untuk em dash</p>
              </div>
              <div>
                <label style={S.label}>Subheadline</label>
                <textarea style={{ ...S.input, minHeight: 64 }} value={content.hero.subheadline}
                  onChange={e => updateHero('subheadline', e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Urgency Hook</label>
                <input style={S.input} value={content.hero.urgency}
                  onChange={e => updateHero('urgency', e.target.value)} />
              </div>
              <div>
                <label style={S.label}>CTA Button</label>
                <input style={S.input} value={content.hero.cta}
                  onChange={e => updateHero('cta', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TRUST TAB ── */}
      {activeTab === 'trust' && (
        <div style={S.card}>
          <p style={S.sectionTitle}><span style={{ fontSize: 16 }}>⭐</span> Trust Bar Badges</p>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>4 badge kepercayaan di bawah hero section.</p>
          <div style={S.row}>
            {content.trust.map((item, i) => (
              <div key={i} style={{ background: '#F8F9FF', border: '1.5px solid #E8ECF8', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>Badge {i + 1}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={S.label}>Icon</label>
                    <input style={{ ...S.input, textAlign: 'center', fontSize: 20, padding: '8px' }} value={item.icon}
                      onChange={e => updateTrust(i, 'icon', e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Teks Utama</label>
                    <input style={S.input} value={item.text} onChange={e => updateTrust(i, 'text', e.target.value)} />
                  </div>
                  <div>
                    <label style={S.label}>Subtitle</label>
                    <input style={S.input} value={item.sub} onChange={e => updateTrust(i, 'sub', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && (
        <div style={S.card}>
          <p style={S.sectionTitle}><span style={{ fontSize: 16 }}>⚙️</span> Settings</p>
          <div style={S.row}>
            <div>
              <label style={S.label}>Nomor WhatsApp</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9CA3AF' }}>+</span>
                <input style={{ ...S.input, paddingLeft: 26 }} value={content.whatsapp}
                  onChange={e => setContent(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }))}
                  placeholder="6282146970988" />
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Format internasional tanpa + (contoh: 6282146970988)</p>
            </div>
            <div style={{ background: '#F0F3FD', border: '1.5px solid #C7D0F0', borderRadius: 10, padding: '14px 16px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1B2A6B', margin: '0 0 8px' }}>ℹ️ Cara Pakai</p>
              <ul style={{ fontSize: 12, color: '#6B7280', margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                <li>Edit konten → klik <strong>Simpan Perubahan</strong></li>
                <li>Klik <strong>Preview ↗</strong> untuk lihat hasilnya</li>
                <li>Perubahan aktif tanpa perlu deploy ulang</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
