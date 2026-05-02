// Tambah state:
const [showImport, setShowImport] = useState(false);
const [importFile, setImportFile] = useState<File | null>(null);
const [importing, setImporting] = useState(false);
const [importResult, setImportResult] = useState<any>(null);
const importRef = useRef<HTMLInputElement>(null);

// Tambah function:
async function handleImport() {
  if (!importFile) return;
  setImporting(true); setImportResult(null);
  const fd = new FormData(); fd.append('file', importFile);
  const res = await fetch('/api/admin/import', { method: 'POST', body: fd });
  const data = await res.json();
  setImportResult(data);
  if (data.success) window.location.reload();
  setImporting(false);
}

// Tambah tombol di sejajar Export:
<button onClick={() => { setShowImport(true); setImportResult(null); setImportFile(null); }}
  style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 18px', background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer', color:'#374151' }}>
  📥 Import CSV
</button>

// Tambah input ref:
<input ref={importRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e => setImportFile(e.target.files?.[0] ?? null)} />

// Tambah modal di akhir sebelum </div> penutup:
{showImport && (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
    onClick={e => { if(e.target===e.currentTarget) setShowImport(false); }}>
    <div style={{ background:'white', borderRadius:20, padding:32, width:'100%', maxWidth:520, boxShadow:'0 24px 64px rgba(0,0,0,0.15)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#0F172A', margin:0 }}>📥 Import Customers CSV</h2>
        <button onClick={() => setShowImport(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>✕</button>
      </div>
      <div style={{ background:'#F0F3FD', border:'1.5px solid #C7D0F0', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
        <p style={{ fontSize:12, fontWeight:700, color:'#1B2A6B', margin:'0 0 4px' }}>Kolom yang diterima:</p>
        <code style={{ fontSize:11, color:'#6B7280' }}>name, email, phone, country, city, source, status, notes</code>
      </div>
      <div onClick={() => importRef.current?.click()}
        style={{ border:`2px dashed ${importFile?'#2D3F8F':'#C7D0F0'}`, borderRadius:12, padding:28, textAlign:'center' as const, cursor:'pointer', background:importFile?'#F0F3FD':'#F8F9FF', marginBottom:16 }}>
        {importFile
          ? <div><div style={{fontSize:32,marginBottom:6}}>📄</div><p style={{fontWeight:600,color:'#2D3F8F',margin:'0 0 2px'}}>{importFile.name}</p><p style={{fontSize:12,color:'#9CA3AF',margin:0}}>{(importFile.size/1024).toFixed(1)} KB</p></div>
          : <div><div style={{fontSize:32,marginBottom:6}}>📁</div><p style={{fontWeight:600,color:'#374151',margin:'0 0 4px'}}>Klik untuk pilih file CSV</p><p style={{fontSize:12,color:'#9CA3AF',margin:0}}>Max 2MB</p></div>
        }
      </div>
      {importResult && (
        <div style={{ background:importResult.success?'#F0FDF4':'#FEF2F2', border:`1px solid ${importResult.success?'#86EFAC':'#FECACA'}`, borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
          <p style={{ fontSize:13, fontWeight:700, color:importResult.success?'#16A34A':'#DC2626', margin:'0 0 4px' }}>{importResult.success?'✓':'✗'} {importResult.message??importResult.error}</p>
          {importResult.success && <p style={{fontSize:12,color:'#6B7280',margin:0}}>Total: {importResult.total} · Berhasil: {importResult.inserted} · Dilewati: {importResult.skipped}</p>}
        </div>
      )}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => setShowImport(false)} style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>Tutup</button>
        <button onClick={handleImport} disabled={!importFile||importing}
          style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:(!importFile||importing)?'#9CA3AF':'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, cursor:(!importFile||importing)?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {importing
            ? <><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}}/>Importing…</>
            : '📥 Import'}
        </button>
      </div>
    </div>
  </div>
)}
