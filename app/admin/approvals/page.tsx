'use client';

import { useEffect, useState } from 'react';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type ApprovalType   = 'all' | 'lp_change' | 'status_change' | 'cms_change';

interface Approval {
  id: string;
  type: string;
  requested_by: string;
  requester_name: string;
  payload: Record<string, any>;
  chat_image_url?: string;
  status: ApprovalStatus;
  reviewed_by?: string;
  reviewer_name?: string;
  review_note?: string;
  created_at: string;
  updated_at: string;
}

const TYPE_TABS: { key: ApprovalType; label: string; icon: string; color: string; bg: string }[] = [
  { key:'all',           label:'Semua',     icon:'\u{1F4CB}', color:'#374151', bg:'#F3F4F6' },
  { key:'lp_change',     label:'LP',        icon:'\u{1F310}', color:'#B45309', bg:'#FEF3C7' },
  { key:'cms_change',    label:'CMS',       icon:'\u270F\uFE0F', color:'#7C3AED', bg:'#F5F3FF' },
  { key:'status_change', label:'Customers', icon:'\u{1F464}', color:'#0369A1', bg:'#E0F2FE' },
];

const STATUS_META = {
  pending:  { label:'Pending',  color:'#D97706', bg:'#FEF3C7', dot:'#F59E0B' },
  approved: { label:'Approved', color:'#059669', bg:'#D1FAE5', dot:'#10B981' },
  rejected: { label:'Rejected', color:'#DC2626', bg:'#FEE2E2', dot:'#EF4444' },
};

const LP_LABELS: Record<string, string> = {
  'lp':'\uD83C\uDF0D Universal','lp-2':'\uD83C\uDDFA\uD83C\uDDF8 EU/US','lp-3':'\uD83C\uDDF8\uD83C\uDDEC SEA',
  'lp-4':'\uD83C\uDDE6\uD83C\uDDFA AUS/NZ','lp-5':'\uD83C\uDDEE\uD83C\uDDE9 Indonesia',
};

const FIELD_LABELS: Record<string, string> = {
  hero_eyebrow:'Eyebrow Text', hero_headline:'Headline', hero_headline_em:'Headline Emphasis',
  hero_headline_end:'Headline End', hero_subheadline:'Subheadline', hero_cta:'CTA Button',
  hero_urgency:'Urgency Hook', form_headline:'Form Headline', form_subheadline:'Form Sub-copy',
  form_cta:'Form CTA', final_cta_headline:'Final CTA Headline', final_cta_body:'Final CTA Body',
  hero_bg_type:'Background Type', hero_bg_image_url:'Background Image',
  hero_bg_color:'Background Color', hero_bg_overlay:'Overlay Darkness',
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), day = Math.floor(diff/86400000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m}m lalu`;
  if (h < 24) return `${h}j lalu`;
  return `${day}h lalu`;
}

function PreviewLP({ payload }: { payload: Record<string, any> }) {
  const slug = payload.slug ?? '---';
  const overrides = payload.overrides ?? {};
  const fields = Object.keys(overrides);
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:13, fontWeight:700, color:'#0F172A' }}>{LP_LABELS[slug] ?? slug}</span>
        <span style={{ fontSize:11, color:'#94A3B8' }}>{fields.length} field diubah</span>
      </div>
      {fields.length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {fields.map(key => {
            const val = overrides[key];
            const label = FIELD_LABELS[key] ?? key;
            if (key === 'hero_bg_image_url' && typeof val === 'string' && val.startsWith('http')) {
              return (
                <div key={key} style={{ background:'#F8F9FF', borderRadius:10, padding:'10px 14px', border:'1px solid #E8ECF8' }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</p>
                  <img src={val} alt="Hero BG" style={{ width:'100%', maxHeight:120, objectFit:'cover', borderRadius:8, display:'block' }} />
                </div>
              );
            }
            return (
              <div key={key} style={{ background:'#F8F9FF', borderRadius:10, padding:'10px 14px', border:'1px solid #E8ECF8' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</p>
                <p style={{ fontSize:13, color:'#1E293B', margin:0, lineHeight:1.5, wordBreak:'break-word' }}>
                  {String(val).slice(0,200)}{String(val).length > 200 ? '...' : ''}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>Tidak ada detail override tersimpan.</p>
      )}
    </div>
  );
}

function PreviewStatus({ payload }: { payload: Record<string, any> }) {
  const oldS = payload.old_status ?? payload.from_status ?? '---';
  const newS = payload.new_status ?? payload.to_status ?? '---';
  const SC: Record<string, { color: string; bg: string }> = {
    new:{color:'#6366F1',bg:'#EEF2FF'}, contacted:{color:'#0EA5E9',bg:'#E0F2FE'},
    negotiation:{color:'#F59E0B',bg:'#FEF3C7'}, deal:{color:'#10B981',bg:'#D1FAE5'}, lost:{color:'#EF4444',bg:'#FEE2E2'},
  };
  const oldM = SC[oldS] ?? {color:'#6B7280',bg:'#F3F4F6'};
  const newM = SC[newS] ?? {color:'#6B7280',bg:'#F3F4F6'};
  return (
    <div>
      <div style={{ marginBottom:14 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', margin:'0 0 3px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Customer</p>
        <p style={{ fontSize:14, fontWeight:600, color:'#0F172A', margin:0 }}>{payload.customer_name ?? '---'}</p>
        {payload.customer_phone && <p style={{ fontSize:12, color:'#94A3B8', margin:'2px 0 0' }}>{payload.customer_phone}</p>}
      </div>
      <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Perubahan Status</p>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:13, fontWeight:700, padding:'6px 14px', borderRadius:20, background:oldM.bg, color:oldM.color, display:'block' }}>{oldS}</span>
          <p style={{ fontSize:10, color:'#94A3B8', margin:'4px 0 0' }}>Sebelum</p>
        </div>
        <span style={{ fontSize:20, color:'#CBD5E1' }}>&#8594;</span>
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:13, fontWeight:700, padding:'6px 14px', borderRadius:20, background:newM.bg, color:newM.color, display:'block' }}>{newS}</span>
          <p style={{ fontSize:10, color:'#94A3B8', margin:'4px 0 0' }}>Setelah</p>
        </div>
      </div>
    </div>
  );
}

function PreviewCMS({ payload }: { payload: Record<string, any> }) {
  const content = payload.full_content ?? payload.content ?? {};
  const hero = content.hero ?? {};
  const fields = [
    { label:'Headline', val: hero.headline },
    { label:'Subheadline', val: hero.subheadline },
    { label:'CTA Text', val: hero.ctaText },
    { label:'Eyebrow', val: hero.eyebrow },
  ].filter(f => f.val);
  return (
    <div>
      <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', margin:'0 0 12px' }}>Edit Homepage CMS</p>
      {fields.length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {fields.map(f => (
            <div key={f.label} style={{ background:'#F8F9FF', borderRadius:10, padding:'10px 14px', border:'1px solid #E8ECF8' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{f.label}</p>
              <p style={{ fontSize:13, color:'#1E293B', margin:0, lineHeight:1.5 }}>{f.val}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>Perubahan CMS dari Admin.</p>
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  const [typeTab, setTypeTab]   = useState<ApprovalType>('all');
  const [statusTab, setStatusTab] = useState<ApprovalStatus | 'all'>('pending');
  const [allData, setAllData]   = useState<Approval[]>([]);
  const [counts, setCounts]     = useState<Record<string, number>>({});
  const [loading, setLoading]   = useState(true);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [note, setNote]         = useState('');
  const [submitting, setSubmit] = useState(false);
  const [imageModal, setImgModal] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, []);

  const filtered = allData.filter(a => {
    const matchType   = typeTab === 'all' || a.type === typeTab;
    const matchStatus = statusTab === 'all' || a.status === statusTab;
    return matchType && matchStatus;
  });

  async function loadAll() {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/approvals?status=all');
      const json = await res.json();
      const arr: Approval[] = Array.isArray(json) ? json : (json.data ?? []);
      setAllData(arr);
      const c: Record<string, number> = { all:0, lp_change:0, cms_change:0, status_change:0 };
      arr.filter(a => a.status === 'pending').forEach(a => {
        c.all++;
        if (a.type in c) c[a.type]++;
      });
      setCounts(c);
    } finally { setLoading(false); }
  }

  async function review(id: string, action: 'approved' | 'rejected') {
    setSubmit(true);
    try {
      const res = await fetch(`/api/admin/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, review_note: note }),
      });
      if (res.ok) { setReviewId(null); setNote(''); loadAll(); }
    } finally { setSubmit(false); }
  }

  return (
    <div style={{ padding:32, fontFamily:"'DM Sans',sans-serif", maxWidth:960 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        textarea:focus{border-color:#2D3F8F!important;outline:none}
        .card-anim{transition:box-shadow 0.15s}
        .card-anim:hover{box-shadow:0 4px 20px rgba(45,63,143,0.09)!important}
      `}</style>

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#0F172A', margin:0 }}>Approvals</h1>
        {(counts.all ?? 0) > 0 && (
          <span style={{ fontSize:12, fontWeight:700, color:'white', background:'#EF4444', padding:'2px 10px', borderRadius:20, animation:'fadeIn 0.3s ease' }}>
            {counts.all} pending
          </span>
        )}
      </div>
      <p style={{ fontSize:13, color:'#94A3B8', margin:'0 0 24px' }}>Review dan setujui perubahan dari tim Admin</p>

      {/* Type tabs */}
      <div style={{ marginBottom:14 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'1px', margin:'0 0 8px' }}>Kategori</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {TYPE_TABS.map(t => {
            const count = counts[t.key] ?? 0;
            const active = typeTab === t.key;
            return (
              <button key={t.key} onClick={() => setTypeTab(t.key)}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:12, border:`1.5px solid ${active?t.color:'#E8ECF8'}`, cursor:'pointer', background:active?t.bg:'white', fontFamily:"'DM Sans',sans-serif", transition:'all 0.15s' }}>
                <span style={{ fontSize:15 }}>{t.icon}</span>
                <span style={{ fontSize:13, fontWeight:700, color:active?t.color:'#374151' }}>{t.label}</span>
                {count > 0 && (
                  <span style={{ fontSize:10, fontWeight:800, color:'white', background:t.color, padding:'1px 7px', borderRadius:20 }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#F3F4F6', padding:4, borderRadius:10, width:'fit-content' }}>
        {([['all','Semua'],['pending','\u23F3 Pending'],['approved','\u2705 Approved'],['rejected','\u274C Rejected']] as const).map(([key,label]) => (
          <button key={key} onClick={() => setStatusTab(key as any)}
            style={{ padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', background:statusTab===key?'#2D3F8F':'transparent', color:statusTab===key?'white':'#6B7280', fontFamily:"'DM Sans',sans-serif" }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:48 }}>
          <span style={{ width:28, height:28, border:'3px solid #E8ECF8', borderTopColor:'#2D3F8F', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 0', color:'#94A3B8' }}>
          <div style={{ fontSize:44, marginBottom:10 }}>\uD83D\uDCED</div>
          <p style={{ fontSize:14, fontWeight:500, margin:0 }}>Tidak ada request ditemukan</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(item => {
            const typeMeta   = TYPE_TABS.find(t => t.key === item.type) ?? TYPE_TABS[0];
            const statusMeta = STATUS_META[item.status as ApprovalStatus] ?? STATUS_META.pending;
            return (
              <div key={item.id} className="card-anim"
                style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid #F1F5F9', flexWrap:'wrap', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, background:typeMeta.bg, color:typeMeta.color }}>
                      {typeMeta.icon} {typeMeta.label}
                    </span>
                    <span style={{ fontSize:13, color:'#374151' }}>oleh <strong>{item.requester_name}</strong></span>
                    <span style={{ fontSize:12, color:'#CBD5E1' }}>&#183;</span>
                    <span style={{ fontSize:12, color:'#94A3B8' }}>{timeAgo(item.created_at)}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:statusMeta.dot, display:'inline-block' }} />
                    <span style={{ fontSize:11, fontWeight:700, color:statusMeta.color }}>{statusMeta.label}</span>
                  </div>
                </div>

                <div style={{ padding:'16px 20px', display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
                  <div style={{ flex:1, minWidth:240 }}>
                    {item.type === 'lp_change'    && <PreviewLP     payload={item.payload} />}
                    {item.type === 'status_change' && <PreviewStatus payload={item.payload} />}
                    {item.type === 'cms_change'    && <PreviewCMS    payload={item.payload} />}
                    {item.review_note && (
                      <div style={{ marginTop:12, background:'#F8F9FF', borderRadius:8, padding:'8px 12px' }}>
                        <p style={{ fontSize:11, color:'#9CA3AF', margin:'0 0 2px' }}>Catatan reviewer</p>
                        <p style={{ fontSize:12, color:'#374151', margin:0 }}>
                          &ldquo;{item.review_note}&rdquo; &mdash; <span style={{ color:'#9CA3AF' }}>{item.reviewer_name}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  {item.chat_image_url && (
                    <div style={{ flexShrink:0 }}>
                      <p style={{ fontSize:11, color:'#9CA3AF', margin:'0 0 6px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Foto Chat</p>
                      <img src={item.chat_image_url} alt="Chat" onClick={() => setImgModal(item.chat_image_url!)}
                        style={{ width:80, height:80, objectFit:'cover', borderRadius:10, border:'1.5px solid #E8ECF8', cursor:'zoom-in', display:'block' }} />
                    </div>
                  )}
                </div>

                {item.status === 'pending' && (
                  <div style={{ padding:'0 20px 16px' }}>
                    {reviewId === item.id ? (
                      <div style={{ background:'#F8F9FF', borderRadius:12, padding:14, border:'1.5px solid #E8ECF8' }}>
                        <textarea value={note} onChange={e => setNote(e.target.value)}
                          placeholder="Catatan (opsional)..." rows={2}
                          style={{ width:'100%', fontSize:13, border:'1.5px solid #E8ECF8', borderRadius:8, padding:'8px 10px', resize:'vertical', fontFamily:"'DM Sans',sans-serif", background:'white', boxSizing:'border-box', marginBottom:10 }} />
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={() => review(item.id, 'approved')} disabled={submitting}
                            style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'#059669', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', opacity:submitting?0.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                            {submitting ? <span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }} /> : '\u2705'} Approve
                          </button>
                          <button onClick={() => review(item.id, 'rejected')} disabled={submitting}
                            style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'#DC2626', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', opacity:submitting?0.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                            {submitting ? <span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite' }} /> : '\u274C'} Reject
                          </button>
                          <button onClick={() => { setReviewId(null); setNote(''); }}
                            style={{ padding:'10px 16px', borderRadius:10, border:'1.5px solid #E8ECF8', background:'white', fontSize:13, color:'#6B7280', cursor:'pointer' }}>
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => { setReviewId(item.id); setNote(''); }}
                        style={{ padding:'8px 20px', borderRadius:10, border:'1.5px solid #2D3F8F', background:'white', color:'#2D3F8F', fontSize:13, fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                        \uD83D\uDC41\uFE0F Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {imageModal && (
        <div onClick={() => setImgModal(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20, cursor:'zoom-out' }}>
          <img src={imageModal} alt="Full" style={{ maxWidth:'90vw', maxHeight:'90vh', borderRadius:16, boxShadow:'0 8px 40px rgba(0,0,0,0.4)' }} />
        </div>
      )}
    </div>
  );
}
