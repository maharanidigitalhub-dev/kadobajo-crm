'use client';

import { useState, useEffect } from 'react';

interface CMSContent {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    urgency: string;
    cta: string;
  };
  trust: { icon: string; text: string; sub: string }[];
  whatsapp: string;
}

const DEFAULT: CMSContent = {
  hero: {
    eyebrow: 'Komodo Airport · Labuan Bajo · NTT',
    headline: 'The Best of East Nusa Tenggara — Ready at Komodo Airport Before You Fly Home',
    subheadline: 'Order online. Your personal shopper prepares everything. Pick up right before check-in — zero stress, zero luggage hassle.',
    urgency: '⏰ Order before your flight. We\'ll have everything packed and ready at the airport.',
    cta: 'Reserve My Gifts Now →',
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

  useEffect(() => {
    fetch('/api/cms')
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) setContent({ ...DEFAULT, ...data });
      })
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
      if (res.ok && data.success) {
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2500);
      } else {
        console.error('Save error:', data);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  function updateHero(key: keyof CMSContent['hero'], val: string) {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, [key]: val } }));
  }

  function updateTrust(idx: number, key: string, val: string) {
    setContent(prev => {
      const trust = [...prev.trust];
      trust[idx] = { ...trust[idx], [key]: val };
      return { ...prev, trust };
    });
  }

  const tabStyle = (active: boolean) => ({
    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'all 0.15s',
    background: active ? '#2D3F8F' : 'transparent',
    color: active ? 'white' : '#6B7280',
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #E5E7EB', background: '#F9FAFB',
    fontSize: 14, color: '#111827', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700 as const,
    textTransform: 'uppercase' as const, letterSpacing: '1px',
    color: '#9CA3AF', marginBottom: 6,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #E8ECF8', borderTopColor: '#2D3F8F', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Loading content…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: 800, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        textarea { resize: vertical; }
        input:focus, textarea:focus, select:focus { border-color: #2D3F8F !important; box-shadow: 0 0 0 3px rgba(45,63,143,0.1); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        .save-badge { animation: fadeIn 0.2s ease; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#111827', margin: 0 }}>
            Mini CMS
          </h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Edit konten landing page kadobajo.id</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'saved' && (
            <span className="save-badge" style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>✓ Tersimpan!</span>
          )}
          {status === 'error' && (
            <span className="save-badge" style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>✗ Gagal simpan</span>
          )}
          <a href="https://kadobajo.id" target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', padding: '8px 16px', border: '1.5px solid #E5E7EB', borderRadius: 8 }}>
            Preview ↗
          </a>
          <button onClick={handleSave} disabled={status === 'saving'}
            style={{
              padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: status === 'saving' ? '#9CA3AF' : 'linear-gradient(135deg, #2D3F8F, #1B2A6B)',
              color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
            }}>
            {status === 'saving' ? (
              <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Menyimpan…</>
            ) : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#F3F4F6', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {(['hero', 'trust', 'settings'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
            {tab === 'hero' ? '🎯 Hero' : tab === 'trust' ? '⭐ Trust Bar' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(45,63,143,0.06)' }}>

        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Eyebrow Text</label>
              <input style={inputStyle} value={content.hero.eyebrow}
                onChange={e => updateHero('eyebrow', e.target.value)}
                placeholder="Komodo Airport · Labuan Bajo · NTT" />
            </div>
            <div>
              <label style={labelStyle}>Headline Utama *</label>
              <textarea style={{ ...inputStyle, minHeight: 80 }} value={content.hero.headline}
                onChange={e => updateHero('headline', e.target.value)}
                placeholder="The Best of East Nusa Tenggara..." />
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Gunakan em dash (—) untuk line break visual</p>
            </div>
            <div>
              <label style={labelStyle}>Subheadline</label>
              <textarea style={{ ...inputStyle, minHeight: 64 }} value={content.hero.subheadline}
                onChange={e => updateHero('subheadline', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Urgency Hook</label>
              <input style={inputStyle} value={content.hero.urgency}
                onChange={e => updateHero('urgency', e.target.value)}
                placeholder="⏰ Order before your flight..." />
            </div>
            <div>
              <label style={labelStyle}>CTA Button Text</label>
              <input style={inputStyle} value={content.hero.cta}
                onChange={e => updateHero('cta', e.target.value)}
                placeholder="Reserve My Gifts Now →" />
            </div>
          </div>
        )}

        {/* TRUST TAB */}
        {activeTab === 'trust' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>4 badge kepercayaan yang tampil di bawah hero section.</p>
            {content.trust.map((item, i) => (
              <div key={i} style={{ background: '#F8F9FF', border: '1.5px solid #E8ECF8', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
                  Badge {i + 1}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Icon</label>
                    <input style={{ ...inputStyle, textAlign: 'center', fontSize: 20 }} value={item.icon}
                      onChange={e => updateTrust(i, 'icon', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Teks Utama</label>
                    <input style={inputStyle} value={item.text}
                      onChange={e => updateTrust(i, 'text', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Subtitle</label>
                    <input style={inputStyle} value={item.sub}
                      onChange={e => updateTrust(i, 'sub', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Nomor WhatsApp</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#9CA3AF' }}>+</span>
                <input style={{ ...inputStyle, paddingLeft: 26 }} value={content.whatsapp}
                  onChange={e => setContent(prev => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, '') }))}
                  placeholder="6282146970988" />
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Format internasional tanpa + (contoh: 6282146970988)</p>
            </div>

            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 10, padding: '14px 16px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#DC2626', margin: '0 0 4px' }}>⚠️ Perhatian</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                Perubahan di CMS ini akan langsung terlihat di landing page setelah disimpan.
                Pastikan konten sudah benar sebelum klik Simpan.
              </p>
            </div>

            <div style={{ background: '#F0F3FD', border: '1.5px solid #C7D0F0', borderRadius: 10, padding: '14px 16px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1B2A6B', margin: '0 0 8px' }}>ℹ️ Cara Pakai</p>
              <ul style={{ fontSize: 12, color: '#6B7280', margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                <li>Edit konten di tab <strong>Hero</strong> atau <strong>Trust Bar</strong></li>
                <li>Klik <strong>Simpan Perubahan</strong></li>
                <li>Klik <strong>Preview ↗</strong> untuk lihat hasilnya di kadobajo.id</li>
                <li>Perubahan langsung aktif tanpa perlu deploy ulang</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
