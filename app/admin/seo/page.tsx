'use client';

import { useState, useEffect } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const DEFAULT = {
  site: { name:'Kado Bajo', tagline:'Authentic NTT Souvenirs at Komodo Airport', url:'https://kadobajo.id', locale:'en_US', themeColor:'#2D3F8F' },
  homepage: { title:'Kado Bajo – Authentic NTT Souvenirs at Komodo Airport', description:'Order curated East Nusa Tenggara gifts online. Personal shopper included. Pick up before your flight at Komodo Airport — zero stress.', keywords:'kado bajo, souvenir labuan bajo, souvenir komodo, NTT souvenirs, komodo airport gifts', ogImage:'/logo.png', twitterCard:'summary_large_image' },
  social: { instagram:'', tiktok:'', facebook:'', twitter:'' },
  structured: { businessName:'Kado Bajo', businessType:'Store', address:'Jl. Yohanes Sehadun, Labuan Bajo, NTT, Indonesia', phone:'+6282146970988', priceRange:'$$', openingHours:'Mo-Su 06:00-22:00', geo:{ lat:'-8.4897', lng:'119.8869' } },
  robots: { index:true, follow:true },
  verification: { google:'' },
};

export default function SEOPage() {
  const [data, setData] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [tab, setTab] = useState<'meta'|'social'|'structured'|'robots'>('meta');

  useEffect(() => {
    fetch('/api/admin/seo').then(r => r.json()).then(d => {
      if (d && !d.error) setData({ ...DEFAULT, ...d });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/seo', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
      const d = await res.json();
      if (res.ok && d.success) { setStatus('saved'); setTimeout(() => setStatus('idle'), 2500); }
      else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  }

  const S = {
    input: { width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, color:'#111827', outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' as const },
    label: { display:'block', fontSize:11, fontWeight:700 as const, textTransform:'uppercase' as const, letterSpacing:'1px', color:'#9CA3AF', marginBottom:6 },
    field: { marginBottom:18 },
    card: { background:'white', border:'1.5px solid #E8ECF8', borderRadius:16, padding:28, marginBottom:16 },
    section: { fontSize:13, fontWeight:700 as const, color:'#374151', marginBottom:18 },
    hint: { fontSize:11, color:'#9CA3AF', marginTop:4 },
  };

  const charCount = (str: string, max: number) => (
    <span style={{ fontSize:11, color: str.length > max ? '#EF4444' : '#9CA3AF', marginTop:4, display:'block' }}>
      {str.length}/{max} {str.length > max ? '⚠️ Terlalu panjang' : ''}
    </span>
  );

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <span style={{ width:28, height:28, border:'3px solid #E8ECF8', borderTopColor:'#2D3F8F', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ padding:32, maxWidth:800, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        input:focus,textarea:focus,select:focus{border-color:#2D3F8F!important;box-shadow:0 0 0 3px rgba(45,63,143,0.1)!important;background:white!important}
        textarea{resize:vertical;}
        .save-badge{animation:fadeIn 0.2s ease}
        .tab-btn{padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif}
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#0F172A', margin:0 }}>SEO Settings</h1>
          <p style={{ fontSize:13, color:'#94A3B8', marginTop:4 }}>Kelola metadata, sitemap, dan structured data untuk kadobajo.id</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {status === 'saved' && <span className="save-badge" style={{ fontSize:13, color:'#10B981', fontWeight:600 }}>✓ Tersimpan!</span>}
          {status === 'error' && <span className="save-badge" style={{ fontSize:13, color:'#EF4444', fontWeight:600 }}>✗ Gagal simpan</span>}
          <a href={`${data.site.url}/sitemap.xml`} target="_blank" rel="noreferrer"
            style={{ fontSize:13, color:'#6B7280', textDecoration:'none', padding:'8px 14px', border:'1.5px solid #E5E7EB', borderRadius:8 }}>
            Sitemap ↗
          </a>
          <button onClick={handleSave} disabled={status==='saving'}
            style={{ padding:'10px 24px', borderRadius:10, border:'none', cursor:'pointer', background:status==='saving'?'#9CA3AF':'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
            {status==='saving' ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }}/>Menyimpan…</> : '💾 Simpan'}
          </button>
        </div>
      </div>

      {/* SEO Score preview */}
      <div style={{ background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', borderRadius:16, padding:'20px 24px', marginBottom:24, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200 }}>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 4px' }}>Judul halaman</p>
          <p style={{ fontSize:14, fontWeight:600, color:'white', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{data.homepage.title || '—'}</p>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)', margin:'0 0 4px' }}>Deskripsi</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.75)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{data.homepage.description || '—'}</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {[
            { label:'Title', ok: data.homepage.title.length >= 30 && data.homepage.title.length <= 60 },
            { label:'Desc', ok: data.homepage.description.length >= 120 && data.homepage.description.length <= 160 },
            { label:'Keywords', ok: data.homepage.keywords.length > 0 },
            { label:'OG Image', ok: !!data.homepage.ogImage },
          ].map(item => (
            <div key={item.label} style={{ textAlign:'center' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:item.ok?'#10B981':'#F59E0B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, marginBottom:2 }}>
                {item.ok ? '✓' : '!'}
              </div>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', margin:0 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#F3F4F6', padding:4, borderRadius:10, width:'fit-content' }}>
        {[['meta','🔍 Meta Tags'],['social','📱 Social'],['structured','🏢 Bisnis'],['robots','🤖 Robots']] .map(([key,label]) => (
          <button key={key} className="tab-btn" onClick={() => setTab(key as any)}
            style={{ background:tab===key?'#2D3F8F':'transparent', color:tab===key?'white':'#6B7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* META TAB */}
      {tab === 'meta' && (
        <div>
          <div style={S.card}>
            <p style={S.section}>🌐 Informasi Situs</p>
            <div style={S.field}>
              <label style={S.label}>Site URL</label>
              <input style={S.input} value={data.site.url} onChange={e => setData(d => ({...d, site:{...d.site, url:e.target.value}}))} placeholder="https://kadobajo.id" />
            </div>
            <div style={S.field}>
              <label style={S.label}>Nama Situs</label>
              <input style={S.input} value={data.site.name} onChange={e => setData(d => ({...d, site:{...d.site, name:e.target.value}}))} placeholder="Kado Bajo" />
            </div>
          </div>

          <div style={S.card}>
            <p style={S.section}>📄 Homepage Meta Tags</p>

            <div style={S.field}>
              <label style={S.label}>Title Tag *</label>
              <input style={{ ...S.input, borderColor: data.homepage.title.length > 60 ? '#EF4444' : '#E5E7EB' }}
                value={data.homepage.title}
                onChange={e => setData(d => ({...d, homepage:{...d.homepage, title:e.target.value}}))}
                placeholder="Kado Bajo – Authentic NTT Souvenirs at Komodo Airport" />
              {charCount(data.homepage.title, 60)}
              <p style={S.hint}>Ideal: 50–60 karakter. Tampil di tab browser dan hasil Google.</p>
            </div>

            <div style={S.field}>
              <label style={S.label}>Meta Description *</label>
              <textarea style={{ ...S.input, minHeight:80, borderColor: data.homepage.description.length > 160 ? '#EF4444' : '#E5E7EB' }}
                value={data.homepage.description}
                onChange={e => setData(d => ({...d, homepage:{...d.homepage, description:e.target.value}}))}
                placeholder="Order curated East Nusa Tenggara gifts online..." />
              {charCount(data.homepage.description, 160)}
              <p style={S.hint}>Ideal: 120–160 karakter. Tampil di bawah judul di hasil Google.</p>
            </div>

            <div style={S.field}>
              <label style={S.label}>Keywords</label>
              <input style={S.input} value={data.homepage.keywords}
                onChange={e => setData(d => ({...d, homepage:{...d.homepage, keywords:e.target.value}}))}
                placeholder="kado bajo, souvenir labuan bajo, NTT souvenirs, komodo airport" />
              <p style={S.hint}>Pisahkan dengan koma. Gunakan kata kunci yang relevan dengan bisnis.</p>
            </div>

            <div style={S.field}>
              <label style={S.label}>OG Image URL</label>
              <input style={S.input} value={data.homepage.ogImage}
                onChange={e => setData(d => ({...d, homepage:{...d.homepage, ogImage:e.target.value}}))}
                placeholder="/logo.png atau https://..." />
              <p style={S.hint}>Gambar yang muncul saat link dibagikan di WhatsApp, Facebook, dll. Rekomendasi: 1200×630px.</p>
            </div>

            <div style={S.field}>
              <label style={S.label}>Google Site Verification</label>
              <input style={S.input} value={data.verification?.google ?? ''}
                onChange={e => setData(d => ({...d, verification:{...d.verification, google:e.target.value}}))}
                placeholder="Paste verification code dari Google Search Console" />
              <p style={S.hint}>Dapatkan dari <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color:'#2D3F8F' }}>Google Search Console</a> → Add Property → HTML tag method.</p>
            </div>
          </div>

          {/* Preview Google SERP */}
          <div style={{ ...S.card, background:'#F8F9FF' }}>
            <p style={S.section}>🔍 Preview Google Search Result</p>
            <div style={{ background:'white', border:'1px solid #E8ECF8', borderRadius:10, padding:'16px 20px' }}>
              <p style={{ fontSize:12, color:'#006621', margin:'0 0 2px' }}>{data.site.url}/</p>
              <p style={{ fontSize:18, color:'#1a0dab', margin:'0 0 4px', fontWeight:400, cursor:'pointer' }}>
                {data.homepage.title || 'Page Title'}
              </p>
              <p style={{ fontSize:14, color:'#545454', margin:0, lineHeight:1.5 }}>
                {data.homepage.description || 'Page description will appear here...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL TAB */}
      {tab === 'social' && (
        <div style={S.card}>
          <p style={S.section}>📱 Social Media Handles</p>
          <p style={{ fontSize:13, color:'#94A3B8', marginBottom:20 }}>Digunakan untuk structured data dan social cards.</p>
          {[
            { key:'instagram', label:'Instagram', placeholder:'kadobajo', prefix:'instagram.com/' },
            { key:'tiktok',    label:'TikTok',    placeholder:'kadobajo', prefix:'tiktok.com/@' },
            { key:'facebook',  label:'Facebook',  placeholder:'kadobajo', prefix:'facebook.com/' },
            { key:'twitter',   label:'X (Twitter)',placeholder:'kadobajo', prefix:'x.com/' },
          ].map(s => (
            <div key={s.key} style={S.field}>
              <label style={S.label}>{s.label}</label>
              <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #E5E7EB', borderRadius:10, overflow:'hidden', background:'#F9FAFB' }}>
                <span style={{ padding:'10px 14px', color:'#9CA3AF', fontSize:13, borderRight:'1px solid #E5E7EB', background:'#F3F4F6', whiteSpace:'nowrap' }}>{s.prefix}</span>
                <input style={{ ...S.input, border:'none', borderRadius:0, background:'transparent' }}
                  value={(data.social as any)[s.key]}
                  onChange={e => setData(d => ({...d, social:{...d.social, [s.key]:e.target.value}}))}
                  placeholder={s.placeholder} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STRUCTURED DATA TAB */}
      {tab === 'structured' && (
        <div style={S.card}>
          <p style={S.section}>🏢 Business Structured Data (JSON-LD)</p>
          <p style={{ fontSize:13, color:'#94A3B8', marginBottom:20 }}>Membantu Google memahami bisnis kamu. Muncul di Knowledge Panel.</p>
          <div style={S.field}>
            <label style={S.label}>Nama Bisnis</label>
            <input style={S.input} value={data.structured.businessName}
              onChange={e => setData(d => ({...d, structured:{...d.structured, businessName:e.target.value}}))} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Tipe Bisnis</label>
            <select style={{ ...S.input, appearance:'none' }} value={data.structured.businessType}
              onChange={e => setData(d => ({...d, structured:{...d.structured, businessType:e.target.value}}))}>
              {['Store','LocalBusiness','TouristAttraction','ShoppingCenter','GiftShop'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Alamat Lengkap</label>
            <input style={S.input} value={data.structured.address}
              onChange={e => setData(d => ({...d, structured:{...d.structured, address:e.target.value}}))} />
          </div>
          <div style={S.field}>
            <label style={S.label}>Nomor Telepon</label>
            <input style={S.input} value={data.structured.phone}
              onChange={e => setData(d => ({...d, structured:{...d.structured, phone:e.target.value}}))}
              placeholder="+6282146970988" />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={S.field}>
              <label style={S.label}>Jam Buka</label>
              <input style={S.input} value={data.structured.openingHours}
                onChange={e => setData(d => ({...d, structured:{...d.structured, openingHours:e.target.value}}))}
                placeholder="Mo-Su 06:00-22:00" />
            </div>
            <div style={S.field}>
              <label style={S.label}>Price Range</label>
              <select style={{ ...S.input, appearance:'none' }} value={data.structured.priceRange}
                onChange={e => setData(d => ({...d, structured:{...d.structured, priceRange:e.target.value}}))}>
                {['$','$$','$$$','$$$$'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={S.field}>
              <label style={S.label}>Latitude</label>
              <input style={S.input} value={data.structured.geo.lat}
                onChange={e => setData(d => ({...d, structured:{...d.structured, geo:{...d.structured.geo, lat:e.target.value}}}))}
                placeholder="-8.4897" />
            </div>
            <div style={S.field}>
              <label style={S.label}>Longitude</label>
              <input style={S.input} value={data.structured.geo.lng}
                onChange={e => setData(d => ({...d, structured:{...d.structured, geo:{...d.structured.geo, lng:e.target.value}}}))}
                placeholder="119.8869" />
            </div>
          </div>
          <div style={{ background:'#F0F3FD', borderRadius:10, padding:'12px 16px', marginTop:8 }}>
            <p style={{ fontSize:12, fontWeight:700, color:'#1B2A6B', margin:'0 0 6px' }}>JSON-LD Preview:</p>
            <pre style={{ fontSize:11, color:'#374151', margin:0, overflow:'auto' }}>{JSON.stringify({
              '@context': 'https://schema.org',
              '@type': data.structured.businessType,
              name: data.structured.businessName,
              address: data.structured.address,
              telephone: data.structured.phone,
              openingHours: data.structured.openingHours,
              priceRange: data.structured.priceRange,
              geo: { '@type': 'GeoCoordinates', latitude: data.structured.geo.lat, longitude: data.structured.geo.lng },
            }, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* ROBOTS TAB */}
      {tab === 'robots' && (
        <div>
          <div style={S.card}>
            <p style={S.section}>🤖 Robots & Indexing</p>
            {[
              { key:'index', label:'Allow Indexing', desc:'Izinkan Google mengindex halaman ini' },
              { key:'follow', label:'Follow Links', desc:'Izinkan Google mengikuti link di halaman ini' },
            ].map(item => (
              <div key={item.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', background:'#F8F9FF', borderRadius:12, border:'1.5px solid #E8ECF8', marginBottom:10 }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#0F172A', margin:0 }}>{item.label}</p>
                  <p style={{ fontSize:12, color:'#94A3B8', margin:'2px 0 0' }}>{item.desc}</p>
                </div>
                <div onClick={() => setData(d => ({...d, robots:{...d.robots, [item.key]:!(d.robots as any)[item.key]}}))}
                  style={{ width:44, height:24, borderRadius:99, background:(data.robots as any)[item.key]?'#2D3F8F':'#E5E7EB', position:'relative', cursor:'pointer', transition:'background 0.2s' }}>
                  <div style={{ position:'absolute', top:2, left:(data.robots as any)[item.key]?22:2, width:20, height:20, borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <p style={S.section}>📄 Sitemap</p>
            <div style={{ background:'#F8F9FF', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
              <p style={{ fontSize:13, color:'#374151', margin:'0 0 8px' }}>
                Sitemap tersedia di: <a href={`${data.site.url}/sitemap.xml`} target="_blank" rel="noreferrer" style={{ color:'#2D3F8F', fontWeight:600 }}>{data.site.url}/sitemap.xml</a>
              </p>
              <p style={{ fontSize:12, color:'#9CA3AF', margin:0 }}>Sitemap otomatis include semua landing pages (/, /lp, /lp-2, /lp-3, /lp-4, /lp-5)</p>
            </div>
            <div style={{ background:'#F0F3FD', border:'1.5px solid #C7D0F0', borderRadius:12, padding:'14px 18px' }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#1B2A6B', margin:'0 0 8px' }}>📋 Submit ke Search Console</p>
              <ol style={{ fontSize:12, color:'#6B7280', margin:0, paddingLeft:16, lineHeight:2 }}>
                <li>Buka <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color:'#2D3F8F' }}>Google Search Console</a></li>
                <li>Pilih property <strong>kadobajo.id</strong></li>
                <li>Klik <strong>Sitemaps</strong> di menu kiri</li>
                <li>Paste: <code style={{ background:'#E8ECF8', padding:'1px 6px', borderRadius:4 }}>{data.site.url}/sitemap.xml</code></li>
                <li>Klik <strong>Submit</strong></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
