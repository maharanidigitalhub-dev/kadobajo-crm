'use client';

import { useState, useEffect } from 'react';

interface Pixel {
  id: string;
  platform: string;
  pixel_id: string;
  active: boolean;
  label?: string;
}

const PLATFORMS = [
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    icon: '📘',
    color: '#1877F2',
    bg: '#EBF5FF',
    placeholder: 'e.g. 1234567890123456',
    docs: 'https://www.facebook.com/events/manager',
    help: 'Buka Events Manager → Data Sources → Pixel → Pixel ID',
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    icon: '📊',
    color: '#E37400',
    bg: '#FFF3E0',
    placeholder: 'e.g. G-XXXXXXXXXX',
    docs: 'https://analytics.google.com',
    help: 'Admin → Data Streams → pilih stream → Measurement ID (G-XXXXXXX)',
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    icon: '🎯',
    color: '#4285F4',
    bg: '#EBF5FF',
    placeholder: 'e.g. AW-XXXXXXXXX',
    docs: 'https://ads.google.com',
    help: 'Tools → Linked accounts → Google Analytics → Conversion ID (AW-XXXXXXX)',
  },
  {
    id: 'tiktok',
    name: 'TikTok Pixel',
    icon: '🎵',
    color: '#000000',
    bg: '#F3F4F6',
    placeholder: 'e.g. CXXXXXXXXXXXXXXXX',
    docs: 'https://ads.tiktok.com',
    help: 'TikTok Ads Manager → Assets → Events → Web Events → Pixel ID',
  },
  {
    id: 'snapchat',
    name: 'Snapchat Pixel',
    icon: '👻',
    color: '#FFFC00',
    bg: '#FFFDE7',
    placeholder: 'e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    docs: 'https://ads.snapchat.com',
    help: 'Snap Ads Manager → Assets → Pixels → Pixel ID',
  },
  {
    id: 'twitter',
    name: 'X (Twitter) Pixel',
    icon: '🐦',
    color: '#000000',
    bg: '#F3F4F6',
    placeholder: 'e.g. o1234',
    docs: 'https://ads.twitter.com',
    help: 'Twitter Ads → Tools → Conversion tracking → Website tag → Pixel ID',
  },
  {
    id: 'pinterest',
    name: 'Pinterest Tag',
    icon: '📌',
    color: '#E60023',
    bg: '#FFF0F0',
    placeholder: 'e.g. 1234567890123',
    docs: 'https://ads.pinterest.com',
    help: 'Pinterest Ads → Conversions → Pinterest Tag → Tag ID',
  },
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    icon: '🏷️',
    color: '#4285F4',
    bg: '#EBF5FF',
    placeholder: 'e.g. GTM-XXXXXXX',
    docs: 'https://tagmanager.google.com',
    help: 'GTM Dashboard → Container ID (GTM-XXXXXXX). Prioritaskan GTM jika sudah ada.',
  },
];

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function PixelsPage() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [showAdd, setShowAdd] = useState(false);
  const [newPixel, setNewPixel] = useState({ platform: 'meta', pixel_id: '', label: '' });
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    fetch('/api/admin/pixels')
      .then(r => r.json())
      .then(data => {
        setPixels(data.pixels ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/pixels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pixels }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('saved');
        setTimeout(() => setStatus('idle'), 2500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  function addPixel() {
    if (!newPixel.pixel_id.trim()) return;
    const platform = PLATFORMS.find(p => p.id === newPixel.platform)!;
    setPixels(prev => [...prev, {
      id: `${newPixel.platform}_${Date.now()}`,
      platform: newPixel.platform,
      pixel_id: newPixel.pixel_id.trim(),
      label: newPixel.label || platform.name,
      active: true,
    }]);
    setNewPixel({ platform: 'meta', pixel_id: '', label: '' });
    setShowAdd(false);
  }

  function togglePixel(id: string) {
    setPixels(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function removePixel(id: string) {
    setPixels(prev => prev.filter(p => p.id !== id));
  }

  const activePlatforms = PLATFORMS.filter(p => pixels.some(px => px.platform === p.id && px.active));
  const selectedPlatform = PLATFORMS.find(p => p.id === newPixel.platform)!;

  const S = {
    input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 14, color: '#111827', outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box' as const },
    label: { display: 'block', fontSize: 11, fontWeight: 700 as const, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#9CA3AF', marginBottom: 6 },
  };

  return (
    <div style={{ padding: 32, fontFamily: "'DM Sans',sans-serif", maxWidth: 860 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        input:focus, select:focus { border-color: #2D3F8F !important; box-shadow: 0 0 0 3px rgba(45,63,143,0.1) !important; }
        .pixel-card:hover { box-shadow: 0 4px 16px rgba(45,63,143,0.08) !important; }
        .save-badge { animation: fadeIn 0.2s ease; }
        .platform-card { transition: all 0.15s; cursor: pointer; }
        .platform-card:hover { transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0F172A', margin: 0 }}>Pixel & Tracking</h1>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>Kelola semua tracking pixel untuk analytics dan retargeting</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'saved' && <span className="save-badge" style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>✓ Tersimpan!</span>}
          {status === 'error' && <span className="save-badge" style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>✗ Gagal simpan</span>}
          <a href="https://kadobajo.id" target="_blank" rel="noreferrer"
            style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', padding: '8px 16px', border: '1.5px solid #E5E7EB', borderRadius: 8 }}>
            Preview ↗
          </a>
          <button onClick={handleSave} disabled={status === 'saving'}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', background: status === 'saving' ? '#9CA3AF' : 'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color: 'white', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            {status === 'saving'
              ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Menyimpan…</>
              : '💾 Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Active summary */}
      {activePlatforms.length > 0 && (
        <div style={{ background: '#DCFCE7', border: '1.5px solid #86EFAC', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', margin: 0 }}>
              {activePlatforms.length} pixel aktif: {activePlatforms.map(p => p.name).join(', ')}
            </p>
            <p style={{ fontSize: 12, color: '#15803D', margin: 0 }}>Semua pixel terpasang di landing page kadobajo.id</p>
          </div>
        </div>
      )}

      {/* Test mode banner */}
      {testMode && (
        <div style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A', borderRadius: 14, padding: '14px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#B45309', margin: '0 0 2px' }}>🧪 Test Mode Aktif</p>
          <p style={{ fontSize: 12, color: '#92400E', margin: 0 }}>Pixel hanya akan fire di browser ini. Gunakan browser extension untuk verifikasi.</p>
        </div>
      )}

      {/* Installed Pixels */}
      <div style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Pixel Terpasang ({pixels.length})
          </p>
          <button onClick={() => setShowAdd(true)}
            style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            + Tambah Pixel
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <span style={{ width: 24, height: 24, border: '3px solid #E8ECF8', borderTopColor: '#2D3F8F', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : pixels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📡</div>
            <p style={{ fontSize: 14, margin: 0 }}>Belum ada pixel terpasang.</p>
            <p style={{ fontSize: 12, margin: '4px 0 0' }}>Klik "+ Tambah Pixel" untuk mulai tracking.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pixels.map(pixel => {
              const platform = PLATFORMS.find(p => p.id === pixel.platform) ?? PLATFORMS[0];
              return (
                <div key={pixel.id} className="pixel-card"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: pixel.active ? '#FAFBFF' : '#F9FAFB', border: `1.5px solid ${pixel.active ? '#E0E7FF' : '#E5E7EB'}`, borderRadius: 14, transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  {/* Icon */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: pixel.active ? platform.bg : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: `1.5px solid ${pixel.active ? platform.color + '33' : '#E5E7EB'}` }}>
                    {platform.icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{pixel.label || platform.name}</span>
                      {!pixel.active && <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>NONAKTIF</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <code style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace' }}>{pixel.pixel_id}</code>
                      <span style={{ fontSize: 11, color: '#CBD5E1' }}>{platform.name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {/* Toggle */}
                    <div onClick={() => togglePixel(pixel.id)}
                      style={{ width: 44, height: 24, borderRadius: 99, background: pixel.active ? '#2D3F8F' : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 2, left: pixel.active ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
                    </div>
                    {/* Remove */}
                    <button onClick={() => removePixel(pixel.id)}
                      style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #FECACA', background: 'white', color: '#EF4444', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Platforms */}
      <div style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>Platform Tersedia</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {PLATFORMS.map(p => {
            const isInstalled = pixels.some(px => px.platform === p.id);
            const isActive = pixels.some(px => px.platform === p.id && px.active);
            return (
              <div key={p.id} className="platform-card"
                onClick={() => { if (!isInstalled) { setNewPixel({ platform: p.id, pixel_id: '', label: p.name }); setShowAdd(true); } }}
                style={{ padding: '14px 16px', borderRadius: 12, border: `1.5px solid ${isActive ? p.color + '44' : '#E8ECF8'}`, background: isActive ? p.bg : 'white', cursor: isInstalled ? 'default' : 'pointer', opacity: isInstalled && !isActive ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{p.icon}</span>
                  {isActive && <span style={{ fontSize: 10, fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 20 }}>✓ AKTIF</span>}
                  {isInstalled && !isActive && <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>NONAKTIF</span>}
                  {!isInstalled && <span style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 20 }}>+ PASANG</span>}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{p.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <div style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, padding: 24 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 16px' }}>⚙️ Pengaturan Tracking</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F8F9FF', borderRadius: 12, border: '1.5px solid #E8ECF8' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>Test Mode</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>Fire pixel hanya di browser kamu untuk testing</p>
            </div>
            <div onClick={() => setTestMode(v => !v)}
              style={{ width: 44, height: 24, borderRadius: 99, background: testMode ? '#2D3F8F' : '#E5E7EB', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute', top: 2, left: testMode ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
            </div>
          </div>

          <div style={{ background: '#F0F3FD', border: '1.5px solid #C7D0F0', borderRadius: 12, padding: '14px 18px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1B2A6B', margin: '0 0 8px' }}>📋 Cara Verifikasi Pixel</p>
            <ul style={{ fontSize: 12, color: '#6B7280', margin: 0, paddingLeft: 16, lineHeight: 1.9 }}>
              <li><strong>Meta:</strong> Install <a href="https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc" target="_blank" rel="noreferrer" style={{ color: '#1877F2' }}>Meta Pixel Helper</a> di Chrome</li>
              <li><strong>Google:</strong> Install <a href="https://chrome.google.com/webstore/detail/google-tag-assistant-lega/kejbdjndbnbjgmefkgdddjlbokphdefk" target="_blank" rel="noreferrer" style={{ color: '#E37400' }}>Tag Assistant</a> di Chrome</li>
              <li><strong>TikTok:</strong> Install <a href="https://chrome.google.com/webstore/detail/tiktok-pixel-helper/aelgobmabdmlfmiblddjfnjodalhndlt" target="_blank" rel="noreferrer" style={{ color: '#000' }}>TikTok Pixel Helper</a> di Chrome</li>
              <li>Buka <strong>kadobajo.id</strong> → extension akan menampilkan pixel yang aktif</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Pixel Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, animation: 'fadeIn 0.2s ease', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#0F172A', margin: 0 }}>Tambah Pixel Baru</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94A3B8' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Platform select */}
              <div>
                <label style={S.label}>Platform</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 4 }}>
                  {PLATFORMS.slice(0, 8).map(p => (
                    <div key={p.id} onClick={() => setNewPixel(prev => ({ ...prev, platform: p.id, label: p.name }))}
                      style={{ padding: '10px 8px', borderRadius: 10, border: `1.5px solid ${newPixel.platform === p.id ? p.color : '#E5E7EB'}`, background: newPixel.platform === p.id ? p.bg : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: newPixel.platform === p.id ? p.color : '#6B7280', lineHeight: 1.2 }}>{p.name.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help text */}
              <div style={{ background: '#F8F9FF', border: '1.5px solid #E8ECF8', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
                  💡 <strong>{selectedPlatform.name}:</strong> {selectedPlatform.help}
                </p>
                <a href={selectedPlatform.docs} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: '#2D3F8F', fontWeight: 600, display: 'inline-block', marginTop: 4 }}>
                  Buka {selectedPlatform.name} →
                </a>
              </div>

              {/* Pixel ID */}
              <div>
                <label style={S.label}>Pixel / Measurement ID *</label>
                <input style={S.input} value={newPixel.pixel_id}
                  onChange={e => setNewPixel(prev => ({ ...prev, pixel_id: e.target.value }))}
                  placeholder={selectedPlatform.placeholder} />
              </div>

              {/* Label */}
              <div>
                <label style={S.label}>Label (opsional)</label>
                <input style={S.input} value={newPixel.label}
                  onChange={e => setNewPixel(prev => ({ ...prev, label: e.target.value }))}
                  placeholder={selectedPlatform.name} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={() => setShowAdd(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#374151' }}>
                  Batal
                </button>
                <button onClick={addPixel} disabled={!newPixel.pixel_id.trim()}
                  style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: newPixel.pixel_id.trim() ? 'linear-gradient(135deg,#2D3F8F,#1B2A6B)' : '#9CA3AF', color: 'white', fontSize: 14, fontWeight: 700, cursor: newPixel.pixel_id.trim() ? 'pointer' : 'not-allowed' }}>
                  ✅ Tambah Pixel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
