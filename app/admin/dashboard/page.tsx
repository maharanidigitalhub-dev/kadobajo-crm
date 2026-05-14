import { getAllCustomers, getRecentCustomers } from '@/lib/customers';
import { Customer, CustomerStatus } from '@/types/customer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_ORDER: CustomerStatus[] = ['new', 'contacted', 'negotiation', 'deal', 'lost'];

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  new:         { label: 'New Lead',    color: '#6366F1', bg: '#EEF2FF', dot: '#6366F1' },
  contacted:   { label: 'Contacted',   color: '#0EA5E9', bg: '#E0F2FE', dot: '#0EA5E9' },
  negotiation: { label: 'Negotiation', color: '#F59E0B', bg: '#FEF3C7', dot: '#F59E0B' },
  deal:        { label: 'Deal',        color: '#10B981', bg: '#D1FAE5', dot: '#10B981' },
  lost:        { label: 'Lost',        color: '#F43F5E', bg: '#FFE4E6', dot: '#F43F5E' },
};

// ✅ SAFE FALLBACK — tidak akan crash walau status dari DB tidak dikenal
const DEFAULT_META = { label: 'Unknown', color: '#9CA3AF', bg: '#F3F4F6', dot: '#9CA3AF' };
function getStatusMeta(status: string | null | undefined) {
  return STATUS_META[status ?? ''] ?? DEFAULT_META;
}

const LP_META: Record<string, { label: string; flag: string; audience: string }> = {
  'lp':   { label: 'LP 1', flag: '🌍', audience: 'Universal / Global' },
  'lp-2': { label: 'LP 2', flag: '🇺🇸', audience: 'EU / US' },
  'lp-3': { label: 'LP 3', flag: '🇸🇬', audience: 'SEA' },
  'lp-4': { label: 'LP 4', flag: '🇦🇺', audience: 'AUS / NZ' },
  'lp-5': { label: 'LP 5', flag: '🇮🇩', audience: 'Indonesia' },
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function getLastStage(customers: Customer[]): CustomerStatus {
  for (const s of ['deal', 'negotiation', 'contacted', 'new', 'lost'] as CustomerStatus[]) {
    if (customers.some(c => c.status === s)) return s;
  }
  return 'new';
}

export default async function DashboardPage() {
  let all: Customer[] = [];
  let recent: Customer[] = [];
  let fetchError = false;

  try {
    [all, recent] = await Promise.all([getAllCustomers(), getRecentCustomers(6)]);
  } catch { fetchError = true; }

  const totalCustomers = all.length;
  const totalDeals     = all.filter(c => c.status === 'deal').length;
  const totalActive    = all.filter(c => c.status !== 'lost').length;
  const convRate       = totalCustomers > 0 ? ((totalDeals / totalCustomers) * 100).toFixed(1) : '0.0';

  const onlineSources = ['landing_page', 'lp', 'lp-2', 'lp-3', 'lp-4', 'lp-5', 'meta_ads', 'google_ads', 'tiktok'];
  const totalOnline   = all.filter(c => onlineSources.some(s => c.source?.includes(s) || c.source_slug));
  const totalOffline  = all.filter(c => !totalOnline.includes(c));

  const lpSlugs = ['lp', 'lp-2', 'lp-3', 'lp-4', 'lp-5'] as const;
  const lpStats = lpSlugs.map(slug => {
    const lpCustomers = all.filter(c => c.source_slug === slug || c.utm_source === slug || c.source === slug);
    const deals     = lpCustomers.filter(c => c.status === 'deal').length;
    const convRate  = lpCustomers.length > 0 ? ((deals / lpCustomers.length) * 100).toFixed(0) : '0';
    const lastStage = getLastStage(lpCustomers);
    return { slug, meta: LP_META[slug], total: lpCustomers.length, deals, convRate, lastStage };
  });

  const statusCounts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = all.filter(c => c.status === s).length;
    return acc;
  }, {} as Record<CustomerStatus, number>);

  const sourceGroups: Record<string, number> = {};
  all.forEach(c => {
    const src = c.source_slug ?? c.utm_source ?? c.source ?? 'direct';
    sourceGroups[src] = (sourceGroups[src] ?? 0) + 1;
  });
  const topSources = Object.entries(sourceGroups).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const avatarColors = [
    ['#EEF2FF', '#2D3F8F'], ['#D1FAE5', '#065F46'], ['#FEF3C7', '#B45309'],
    ['#FFE4E6', '#BE123C'], ['#E0F2FE', '#0369A1'], ['#F3E8FF', '#7E22CE'],
  ];

  return (
    <div style={{ padding: 28, fontFamily: "'DM Sans', sans-serif", background: '#F8F9FF', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .card { animation: fadeUp 0.4s ease forwards; opacity: 0; }
        .card:nth-child(1){animation-delay:0.05s} .card:nth-child(2){animation-delay:0.1s}
        .card:nth-child(3){animation-delay:0.15s} .card:nth-child(4){animation-delay:0.2s}
        .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(45,63,143,0.1)!important; }
        .row-hover:hover { background:#F0F3FD!important; }
        .live-dot { animation: pulse 2s ease-in-out infinite; }
        .serif { font-family:'Playfair Display',serif; }
        .progress { transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      {/* HEADER */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:2 }}>
            <h1 className="serif" style={{ fontSize:24, fontWeight:700, color:'#0F172A', margin:0 }}>Dashboard</h1>
            <div style={{ display:'flex', alignItems:'center', gap:5, background:'#DCFCE7', borderRadius:20, padding:'3px 10px' }}>
              <span className="live-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#16A34A', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'#16A34A', letterSpacing:'0.5px' }}>LIVE</span>
            </div>
          </div>
          <p style={{ fontSize:12, color:'#94A3B8', margin:0 }}>
            {new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <Link href="/admin/customers"
          style={{ display:'flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', textDecoration:'none', padding:'9px 18px', borderRadius:12, fontSize:13, fontWeight:600 }}>
          All Customers →
        </Link>
      </div>

      {fetchError && (
        <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:14, padding:'14px 18px', marginBottom:20 }}>
          <p style={{ fontSize:13, fontWeight:700, color:'#DC2626', margin:'0 0 2px' }}>⚠️ Database connection failed</p>
          <p style={{ fontSize:12, color:'#9CA3AF', margin:0 }}>Periksa SUPABASE_URL dan SUPABASE_ANON_KEY di Vercel settings.</p>
        </div>
      )}

      {/* KPI CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        <div className="card stat-card" style={{ background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', borderRadius:18, padding:'20px', boxShadow:'0 4px 20px rgba(45,63,143,0.25)', position:'relative', overflow:'hidden', transition:'all 0.2s' }}>
          <div style={{ position:'absolute', top:-16, right:-16, width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
          <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'1px', margin:'0 0 10px' }}>Total Customers</p>
          <p style={{ fontSize:34, fontWeight:700, color:'white', margin:'0 0 2px', lineHeight:1 }}>{totalCustomers}</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', margin:0 }}>{totalActive} aktif</p>
        </div>
        <div className="card stat-card" style={{ background:'white', borderRadius:18, padding:'20px', border:'1.5px solid #E8ECF8', boxShadow:'0 2px 8px rgba(45,63,143,0.05)', transition:'all 0.2s' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', margin:0 }}>Online</p>
            <span style={{ fontSize:18 }}>🌐</span>
          </div>
          <p style={{ fontSize:34, fontWeight:700, color:'#0F172A', margin:'0 0 2px', lineHeight:1 }}>{totalOnline.length}</p>
          <p style={{ fontSize:12, color:'#10B981', fontWeight:600, margin:0 }}>{totalCustomers > 0 ? ((totalOnline.length/totalCustomers)*100).toFixed(0) : 0}% dari total</p>
        </div>
        <div className="card stat-card" style={{ background:'white', borderRadius:18, padding:'20px', border:'1.5px solid #E8ECF8', boxShadow:'0 2px 8px rgba(45,63,143,0.05)', transition:'all 0.2s' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', margin:0 }}>Offline</p>
            <span style={{ fontSize:18 }}>🏪</span>
          </div>
          <p style={{ fontSize:34, fontWeight:700, color:'#0F172A', margin:'0 0 2px', lineHeight:1 }}>{totalOffline.length}</p>
          <p style={{ fontSize:12, color:'#F59E0B', fontWeight:600, margin:0 }}>{totalCustomers > 0 ? ((totalOffline.length/totalCustomers)*100).toFixed(0) : 0}% dari total</p>
        </div>
        <div className="card stat-card" style={{ background:'white', borderRadius:18, padding:'20px', border:'1.5px solid #E8ECF8', boxShadow:'0 2px 8px rgba(45,63,143,0.05)', transition:'all 0.2s' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'1px', margin:0 }}>Conv. Rate</p>
            <span style={{ fontSize:18 }}>📈</span>
          </div>
          <p style={{ fontSize:34, fontWeight:700, color:'#0F172A', margin:'0 0 2px', lineHeight:1 }}>{convRate}%</p>
          <p style={{ fontSize:12, color:'#10B981', fontWeight:600, margin:0 }}>{totalDeals} deals closed</p>
        </div>
      </div>

      {/* LP STATS */}
      <div style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:18, padding:'22px 24px', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <h2 className="serif" style={{ fontSize:17, fontWeight:700, color:'#0F172A', margin:0 }}>Leads per Landing Page</h2>
            <p style={{ fontSize:12, color:'#94A3B8', margin:'2px 0 0' }}>Traffic → Leads → Conversion per audience</p>
          </div>
          <span style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', background:'#F3F4F6', padding:'4px 12px', borderRadius:20 }}>
            Total: {lpStats.reduce((sum, l) => sum + l.total, 0)}
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
          {lpStats.map(lp => {
            const lastMeta = getStatusMeta(lp.lastStage);
            const widthPct = totalCustomers > 0 ? (lp.total / totalCustomers) * 100 : 0;
            return (
              <div key={lp.slug} style={{ background:'#F8F9FF', border:'1.5px solid #E8ECF8', borderRadius:14, padding:'16px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                  <span style={{ fontSize:18 }}>{lp.meta.flag}</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:'#0F172A', margin:0 }}>{lp.meta.label}</p>
                    <p style={{ fontSize:10, color:'#94A3B8', margin:0 }}>{lp.meta.audience}</p>
                  </div>
                </div>
                <p style={{ fontSize:28, fontWeight:800, color:'#2D3F8F', margin:'0 0 4px', lineHeight:1 }}>{lp.total}</p>
                <p style={{ fontSize:11, color:'#94A3B8', margin:'0 0 10px' }}>leads</p>
                <div style={{ height:5, background:'#E8ECF8', borderRadius:99, marginBottom:10, overflow:'hidden' }}>
                  <div className="progress" style={{ height:'100%', borderRadius:99, width:`${widthPct}%`, background:'linear-gradient(90deg,#2D3F8F,#6366F1)' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'#94A3B8' }}>Conv.</span>
                  <span style={{ fontSize:12, fontWeight:700, color:'#10B981' }}>{lp.convRate}%</span>
                </div>
                <div style={{ borderTop:'1px solid #E8ECF8', paddingTop:8 }}>
                  <p style={{ fontSize:10, color:'#9CA3AF', margin:'0 0 3px' }}>Last detected</p>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:lastMeta.bg, color:lastMeta.color }}>
                    {lp.total > 0 ? lastMeta.label : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      

     {/* ── ROW 3: SOURCE ── */}
<div style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:18, padding:'22px 24px', marginBottom:20 }}>
  <h2 className="serif" style={{ fontSize:17, fontWeight:700, color:'#0F172A', margin:'0 0 18px' }}>Traffic & Source</h2>
  {topSources.length === 0 ? (
    <div style={{ textAlign:'center', padding:'32px 0', color:'#CBD5E1' }}>
      <div style={{ fontSize:32, marginBottom:8 }}>📊</div>
      <p style={{ fontSize:13, margin:0 }}>Belum ada data source</p>
    </div>
  ) : (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {topSources.map(([src, count]) => {
        const pct = totalCustomers > 0 ? (count / totalCustomers) * 100 : 0;
        const lpM = LP_META[src];
        const icon = lpM ? lpM.flag : src.includes('meta') ? '📘' : src.includes('google') ? '🔍' : src.includes('tiktok') ? '🎵' : '🌐';
        const label = lpM ? `${lpM.label} — ${lpM.audience}` : src;
        return (
          <div key={src}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ fontSize:14 }}>{icon}</span>
                <span style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{label}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'#2D3F8F' }}>{count}</span>
                <span style={{ fontSize:11, color:'#CBD5E1', minWidth:32, textAlign:'right' }}>{pct.toFixed(0)}%</span>
              </div>
            </div>
            <div style={{ height:5, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:99, width:`${pct}%`, background:'linear-gradient(90deg,#2D3F8F88,#2D3F8F)' }} />
            </div>
          </div>
        );
      })}
    </div>
  )}

  <div style={{ marginTop:18, paddingTop:14, borderTop:'1px solid #F1F5F9', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
    <div style={{ background:'#EEF2FF', borderRadius:12, padding:'12px 14px' }}>
      <p style={{ fontSize:11, fontWeight:700, color:'#6366F1', textTransform:'uppercase', margin:'0 0 4px' }}>🌐 Online</p>
      <p style={{ fontSize:22, fontWeight:800, color:'#2D3F8F', margin:'0 0 2px' }}>{totalOnline.length}</p>
      <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{totalCustomers > 0 ? ((totalOnline.length/totalCustomers)*100).toFixed(0) : 0}%</p>
    </div>
    <div style={{ background:'#FEF3C7', borderRadius:12, padding:'12px 14px' }}>
      <p style={{ fontSize:11, fontWeight:700, color:'#B45309', textTransform:'uppercase', margin:'0 0 4px' }}>🏪 Offline</p>
      <p style={{ fontSize:22, fontWeight:800, color:'#B45309', margin:'0 0 2px' }}>{totalOffline.length}</p>
      <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{totalCustomers > 0 ? ((totalOffline.length/totalCustomers)*100).toFixed(0) : 0}%</p>
    </div>
  </div>
</div>

      {/* RECENT CUSTOMERS */}
      <div style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:18, padding:'22px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <h2 className="serif" style={{ fontSize:17, fontWeight:700, color:'#0F172A', margin:0 }}>Recent Customers</h2>
            <p style={{ fontSize:12, color:'#94A3B8', margin:'2px 0 0' }}>Lead terbaru yang masuk</p>
          </div>
          <Link href="/admin/customers"
            style={{ fontSize:12, fontWeight:600, color:'#2D3F8F', textDecoration:'none', background:'#F0F3FD', padding:'6px 14px', borderRadius:8 }}>
            Lihat semua →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px 0', color:'#CBD5E1' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🌊</div>
            <p style={{ fontSize:14, margin:0 }}>{fetchError ? 'Gagal memuat data.' : 'Belum ada customer.'}</p>
          </div>
        ) : (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 1fr', gap:8, padding:'0 12px 10px', borderBottom:'1px solid #F1F5F9' }}>
              {['Nama','WhatsApp','Negara','Source','Status','Masuk'].map(h => (
                <span key={h} style={{ fontSize:10, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.8px' }}>{h}</span>
              ))}
            </div>
            {recent.map((c, i) => {
              const statusMeta = getStatusMeta(c.status); // ✅ safe, tidak crash
              const [avatarBg, avatarText] = avatarColors[i % avatarColors.length];
              const lpMeta = LP_META[c.source_slug ?? c.utm_source ?? ''];
              return (
                <div key={c.id} className="row-hover"
                  style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 1fr', gap:8, padding:'12px', borderRadius:12, transition:'background 0.15s', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:avatarBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:avatarText, flexShrink:0 }}>
                      {getInitials(c.name)}
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</p>
                      <p style={{ fontSize:11, color:'#94A3B8', margin:0 }}>{c.email || '—'}</p>
                    </div>
                  </div>
                  <span style={{ fontSize:12, color:'#6B7280' }}>{c.phone}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:'#1B2A6B' }}>{c.country || '—'}</span>
                  <span style={{ fontSize:11 }}>
                    {lpMeta ? `${lpMeta.flag} ${lpMeta.label}` : <span style={{ color:'#94A3B8' }}>{c.source ?? '—'}</span>}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:statusMeta.bg, color:statusMeta.color, whiteSpace:'nowrap' }}>
                    {statusMeta.label}
                  </span>
                  <span style={{ fontSize:11, color:'#CBD5E1' }}>
                    {c.created_at ? timeAgo(c.created_at) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
