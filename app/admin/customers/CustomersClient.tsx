'use client';

import { useState, useRef } from 'react';
import { Customer, CustomerStatus } from '@/types/customer';

const STATUS_OPTIONS: { value: CustomerStatus; label: string; color: string; bg: string }[] = [
  { value: 'new',         label: 'New',         color: '#6366F1', bg: '#EEF2FF' },
  { value: 'contacted',   label: 'Contacted',   color: '#0EA5E9', bg: '#E0F2FE' },
  { value: 'negotiation', label: 'Negotiation', color: '#F59E0B', bg: '#FEF3C7' },
  { value: 'deal',        label: 'Deal',        color: '#10B981', bg: '#D1FAE5' },
  { value: 'lost',        label: 'Lost',        color: '#F43F5E', bg: '#FFE4E6' },
];

function StatusBadge({ status, id }: { status: CustomerStatus; id: string }) {
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);
  const opt = STATUS_OPTIONS.find(s => s.value === current)!;

  async function handleChange(val: CustomerStatus) {
    setSaving(true);
    await fetch(`/api/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: val }),
    });
    setCurrent(val);
    setSaving(false);
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={current}
        onChange={e => handleChange(e.target.value as CustomerStatus)}
        disabled={saving}
        style={{
          padding: '4px 10px 4px 22px', fontSize: 11, fontWeight: 700,
          borderRadius: 20, border: `1.5px solid ${opt.color}44`,
          background: opt.bg, color: opt.color,
          appearance: 'none', cursor: 'pointer', outline: 'none',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: opt.color, pointerEvents: 'none' }} />
    </div>
  );
}

function exportMetaCSV(customers: Customer[]) {
  const headers = ['email', 'phone', 'fn', 'country'];
  const rows = customers.map(c => [
    c.email ?? '', c.phone ?? '', c.name ?? '', c.country ?? ''
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  download(csv, 'meta-custom-audience.csv');
}

function exportFullCSV(customers: Customer[]) {
  const headers = ['id','name','email','phone','country','city','status','source','device','utm_source','utm_medium','utm_campaign','tag','notes','value','created_at'];
  const rows = customers.map(c => headers.map(h => (c as any)[h] ?? ''));
  const csv = [headers, ...rows].map(r => r.map((v: string) => `"${v}"`).join(',')).join('\n');
  download(csv, 'customers-full.csv');
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers] = useState(initialCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const countries = [...new Set(customers.map(c => c.country).filter(Boolean))].sort();

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q) || c.country?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchCountry = !countryFilter || c.country === countryFilter;
    return matchSearch && matchStatus && matchCountry;
  });

  async function handleImport() {
    if (!importFile) return;
    setImporting(true); setImportResult(null);
    const fd = new FormData(); fd.append('file', importFile);
    const res = await fetch('/api/admin/import', { method: 'POST', body: fd });
    const data = await res.json();
    setImportResult(data);
    if (data.success) setTimeout(() => window.location.reload(), 2000);
    setImporting(false);
  }

  return (
    <div style={{ padding: 32, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .row-hover:hover { background: #FAFBFF !important; }
        .btn-hover:hover { background: #F0F3FD !important; }
        input:focus, select:focus { border-color: #2D3F8F !important; outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#0F172A', margin:0 }}>Customers</h1>
          <p style={{ fontSize:13, color:'#94A3B8', marginTop:4 }}>{filtered.length} dari {customers.length} customer</p>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {/* Import CSV */}
          <button onClick={() => { setShowImport(true); setImportResult(null); setImportFile(null); }}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151' }}>
            📥 Import CSV
          </button>
          {/* Export dropdown */}
          <div style={{ position:'relative' }}>
            <button onClick={() => setShowExport(v => !v)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', border:'none', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              📤 Export ▾
            </button>
            {showExport && (
              <div style={{ position:'absolute', right:0, top:'calc(100% + 8px)', background:'white', border:'1.5px solid #E8ECF8', borderRadius:14, boxShadow:'0 8px 32px rgba(45,63,143,0.12)', zIndex:20, overflow:'hidden', width:240 }}>
                <button onClick={() => { exportMetaCSV(filtered); setShowExport(false); }}
                  style={{ width:'100%', textAlign:'left', padding:'12px 16px', background:'none', border:'none', borderBottom:'1px solid #F9FAFB', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>Meta Custom Audience</div>
                  <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>email, phone, name, country</div>
                </button>
                <button onClick={() => { exportFullCSV(filtered); setShowExport(false); }}
                  style={{ width:'100%', textAlign:'left', padding:'12px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>Full Export</div>
                  <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>Semua kolom dengan UTM data</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, email, nomor..."
          style={{ flex:1, minWidth:200, padding:'10px 16px', border:'1.5px solid #E8ECF8', borderRadius:10, fontSize:13, color:'#111827', background:'white', fontFamily:"'DM Sans',sans-serif" }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding:'10px 16px', border:'1.5px solid #E8ECF8', borderRadius:10, fontSize:13, color:'#374151', background:'white', cursor:'pointer', appearance:'none', fontFamily:"'DM Sans',sans-serif" }}>
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
          style={{ padding:'10px 16px', border:'1.5px solid #E8ECF8', borderRadius:10, fontSize:13, color:'#374151', background:'white', cursor:'pointer', appearance:'none', fontFamily:"'DM Sans',sans-serif" }}>
          <option value="">Semua Negara</option>
          {countries.map(c => <option key={c} value={c!}>{c}</option>)}
        </select>
        {(search || statusFilter || countryFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setCountryFilter(''); }}
            style={{ padding:'10px 16px', background:'#FEF2F2', color:'#DC2626', border:'1px solid #FECACA', borderRadius:10, fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
            ✕ Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:16, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8F9FF', borderBottom:'1.5px solid #E8ECF8' }}>
                {['Nama','Email','WhatsApp','Negara','Status','Source','Dibuat'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.8px', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:48, textAlign:'center', color:'#9CA3AF', fontSize:14 }}>Tidak ada data customer.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="row-hover" style={{ borderBottom:'1px solid #F9FAFB', transition:'background 0.1s' }}>
                  <td style={{ padding:'14px 16px', fontSize:13, fontWeight:600, color:'#111827', whiteSpace:'nowrap' }}>{c.name}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#6B7280' }}>{c.email || '—'}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#6B7280' }}>{c.phone}</td>
                  <td style={{ padding:'14px 16px', fontSize:13, fontWeight:600, color:'#1B2A6B' }}>{c.country || '—'}</td>
                  <td style={{ padding:'14px 16px' }}><StatusBadge status={c.status} id={c.id} /></td>
                  <td style={{ padding:'14px 16px', fontSize:12, color:'#94A3B8' }}>{c.source || '—'}</td>
                  <td style={{ padding:'14px 16px', fontSize:12, color:'#94A3B8', whiteSpace:'nowrap' }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid #F9FAFB', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, color:'#9CA3AF' }}>Menampilkan {filtered.length} dari {customers.length} customer</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={importRef} type="file" accept=".csv" style={{ display:'none' }}
        onChange={e => setImportFile(e.target.files?.[0] ?? null)} />

      {/* Import CSV Modal */}
      {showImport && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={e => { if(e.target===e.currentTarget) setShowImport(false); }}>
          <div style={{ background:'white', borderRadius:20, padding:32, width:'100%', maxWidth:520, animation:'fadeIn 0.2s ease', boxShadow:'0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#0F172A', margin:0 }}>📥 Import Customers CSV</h2>
              <button onClick={() => setShowImport(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>✕</button>
            </div>

            <div style={{ background:'#F0F3FD', border:'1.5px solid #C7D0F0', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#1B2A6B', margin:'0 0 4px' }}>Kolom yang diterima:</p>
              <code style={{ fontSize:11, color:'#6B7280' }}>name, email, phone, country, city, source, status, notes</code>
            </div>

            <div onClick={() => importRef.current?.click()}
              style={{ border:`2px dashed ${importFile?'#2D3F8F':'#C7D0F0'}`, borderRadius:12, padding:28, textAlign:'center', cursor:'pointer', background:importFile?'#F0F3FD':'#F8F9FF', marginBottom:16, transition:'all 0.2s' }}>
              {importFile
                ? <div><div style={{fontSize:32,marginBottom:6}}>📄</div><p style={{fontWeight:600,color:'#2D3F8F',margin:'0 0 2px'}}>{importFile.name}</p><p style={{fontSize:12,color:'#9CA3AF',margin:0}}>{(importFile.size/1024).toFixed(1)} KB</p></div>
                : <div><div style={{fontSize:32,marginBottom:6}}>📁</div><p style={{fontWeight:600,color:'#374151',margin:'0 0 4px'}}>Klik untuk pilih file CSV</p><p style={{fontSize:12,color:'#9CA3AF',margin:0}}>Max 2MB · Format: UTF-8</p></div>
              }
            </div>

            {importResult && (
              <div style={{ animation:'fadeIn 0.2s ease', background:importResult.success?'#F0FDF4':'#FEF2F2', border:`1px solid ${importResult.success?'#86EFAC':'#FECACA'}`, borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
                <p style={{ fontSize:13, fontWeight:700, color:importResult.success?'#16A34A':'#DC2626', margin:'0 0 4px' }}>
                  {importResult.success?'✓':'✗'} {importResult.message ?? importResult.error}
                </p>
                {importResult.success && (
                  <p style={{fontSize:12,color:'#6B7280',margin:0}}>
                    Total: {importResult.total} · Berhasil: {importResult.inserted} · Dilewati: {importResult.skipped}
                  </p>
                )}
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowImport(false)}
                style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'white', fontSize:14, fontWeight:600, cursor:'pointer', color:'#374151', fontFamily:"'DM Sans',sans-serif" }}>
                Tutup
              </button>
              <button onClick={handleImport} disabled={!importFile || importing}
                style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:(!importFile||importing)?'#9CA3AF':'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, cursor:(!importFile||importing)?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:"'DM Sans',sans-serif" }}>
                {importing
                  ? <><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}}/>Importing…</>
                  : '📥 Import Sekarang'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
