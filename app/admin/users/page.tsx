'use client';

import { useState, useEffect } from 'react';
import { ROLE_META, type Role, type CRMUser } from '@/lib/roles';

const ROLES: Role[] = ['admin', 'manager', 'sales', 'viewer'];
const BLANK = { name: '', email: '', password: '', role: 'sales' as Role };

export default function UsersPage() {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<CRMUser | null>(null);
  const [editing, setEditing] = useState<CRMUser | null>(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  function flash(msg: string) { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); }
  function openAdd() { setEditing(null); setForm(BLANK); setError(''); setShowModal(true); }
  function openEdit(u: CRMUser) { setEditing(u); setForm({ name:u.name, email:u.email, password:'', role:u.role }); setError(''); setShowModal(true); }

  async function handleSave() {
    setError('');
    if (!form.name || !form.email || (!editing && !form.password)) { setError('Nama, email, dan password wajib diisi.'); return; }
    setSaving(true);
    try {
      if (editing) {
        const body: any = { name: form.name, role: form.role };
        if (form.password) body.password = form.password;
        const res = await fetch(`/api/admin/users/${editing.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
        if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return; }
        flash('User berhasil diupdate.');
      } else {
        const res = await fetch('/api/admin/users', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
        if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return; }
        flash('User baru berhasil dibuat.');
      }
      setShowModal(false); loadUsers();
    } finally { setSaving(false); }
  }

  async function handleDelete(u: CRMUser) {
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${u.id}`, { method:'DELETE' });
    if (res.ok) { flash(`User "${u.name}" berhasil dihapus.`); setShowDeleteConfirm(null); loadUsers(); }
    setDeleting(false);
  }

  async function toggleActive(u: CRMUser) {
    await fetch(`/api/admin/users/${u.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ active: !u.active }) });
    loadUsers();
  }

  const S = {
    input: { width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, color:'#111827', outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' as const },
    label: { display:'block', fontSize:11, fontWeight:700 as const, textTransform:'uppercase' as const, letterSpacing:'1px', color:'#9CA3AF', marginBottom:6 },
  };

  return (
    <div style={{ padding:32, fontFamily:"'DM Sans',sans-serif", maxWidth:960 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus,select:focus{border-color:#2D3F8F!important;box-shadow:0 0 0 3px rgba(45,63,143,0.1)!important}
        .user-row:hover{background:#FAFBFF!important}
        .btn-ghost:hover{background:#F0F3FD!important}
        .btn-del:hover{background:#FEF2F2!important}
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#0F172A', margin:0 }}>User Management</h1>
          <p style={{ fontSize:13, color:'#94A3B8', marginTop:4 }}>{users.filter(u=>u.active).length} user aktif</p>
        </div>
        <button onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 20px', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          + Tambah User
        </button>
      </div>

      {success && <div style={{ animation:'fadeIn 0.2s ease', background:'#DCFCE7', border:'1px solid #86EFAC', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:13, color:'#16A34A', fontWeight:600 }}>✓ {success}</div>}

      {/* Role summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
        {ROLES.map(role => {
          const m = ROLE_META[role];
          const count = users.filter(u => u.role===role && u.active).length;
          return (
            <div key={role} style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:22 }}>{m.icon}</span>
              <div><p style={{ fontSize:22, fontWeight:800, color:m.color, margin:0 }}>{count}</p><p style={{ fontSize:11, fontWeight:700, color:m.color, margin:0 }}>{m.label}</p></div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background:'white', border:'1.5px solid #E8ECF8', borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:48, textAlign:'center' }}>
            <span style={{ width:24, height:24, border:'3px solid #E8ECF8', borderTopColor:'#2D3F8F', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8F9FF', borderBottom:'1.5px solid #E8ECF8' }}>
                {['User','Email','Role','Status','Bergabung','Aksi'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'12px 16px', fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.8px', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const m = ROLE_META[u.role];
                const initials = u.name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
                return (
                  <tr key={u.id} className="user-row" style={{ borderBottom:'1px solid #F9FAFB', transition:'background 0.1s', opacity:u.active?1:0.55 }}>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:m.color, flexShrink:0 }}>{initials}</div>
                        <span style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'#6B7280' }}>{u.email}</td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, background:m.bg, color:m.color }}>{m.icon} {m.label}</span>
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, background:u.active?'#DCFCE7':'#FEE2E2', color:u.active?'#16A34A':'#DC2626' }}>
                        {u.active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding:'14px 16px', fontSize:12, color:'#94A3B8' }}>
                      {new Date(u.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                    </td>
                    <td style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn-ghost" onClick={() => openEdit(u)} style={{ padding:'6px 10px', borderRadius:8, border:'1.5px solid #E8ECF8', background:'white', fontSize:12, fontWeight:600, color:'#374151', cursor:'pointer' }}>✏️ Edit</button>
                        <button className="btn-ghost" onClick={() => toggleActive(u)} style={{ padding:'6px 10px', borderRadius:8, border:'1.5px solid #E8ECF8', background:'white', fontSize:12, fontWeight:600, color:u.active?'#F59E0B':'#16A34A', cursor:'pointer' }}>{u.active?'⏸':'▶'}</button>
                        <button className="btn-del" onClick={() => setShowDeleteConfirm(u)} style={{ padding:'6px 10px', borderRadius:8, border:'1.5px solid #FECACA', background:'white', fontSize:12, fontWeight:600, color:'#DC2626', cursor:'pointer' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
          onClick={e => { if(e.target===e.currentTarget) setShowModal(false); }}>
          <div style={{ background:'white', borderRadius:20, padding:32, width:'100%', maxWidth:480, animation:'fadeIn 0.2s ease', boxShadow:'0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#0F172A', margin:0 }}>{editing?'Edit User':'Tambah User Baru'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94A3B8' }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={S.label}>Nama Lengkap *</label><input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama lengkap" /></div>
              <div><label style={S.label}>Email *</label><input style={{ ...S.input, ...(editing?{background:'#F3F4F6',color:'#9CA3AF'}:{}) }} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} disabled={!!editing} placeholder="email@kadobajo.com" /></div>
              <div><label style={S.label}>{editing?'Password Baru (kosongkan jika tidak berubah)':'Password *'}</label><input style={S.input} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder={editing?'Kosongkan jika tidak berubah':'Min 6 karakter'} /></div>
              <div>
                <label style={S.label}>Role *</label>
                <select style={{ ...S.input, appearance:'none' }} value={form.role} onChange={e=>setForm({...form,role:e.target.value as Role})}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].icon} {ROLE_META[r].label}</option>)}
                </select>
              </div>
              <div style={{ background:ROLE_META[form.role].bg, border:`1.5px solid ${ROLE_META[form.role].color}33`, borderRadius:10, padding:'10px 14px', fontSize:12, color:'#6B7280' }}>
                {ROLE_META[form.role].icon} <strong style={{color:ROLE_META[form.role].color}}>{ROLE_META[form.role].label}</strong> — {ROLE_META[form.role].desc}
              </div>
              {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#DC2626' }}>{error}</div>}
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button onClick={() => setShowModal(false)} style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'white', fontSize:14, fontWeight:600, cursor:'pointer', color:'#374151' }}>Batal</button>
                <button onClick={handleSave} disabled={saving} style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {saving?<><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}}/>Menyimpan…</>:(editing?'💾 Simpan':'✨ Buat User')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'white', borderRadius:20, padding:32, width:'100%', maxWidth:400, animation:'fadeIn 0.2s ease', textAlign:'center', boxShadow:'0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#0F172A', margin:'0 0 8px' }}>Hapus User?</h2>
            <p style={{ fontSize:14, color:'#6B7280', marginBottom:24 }}>Kamu akan menghapus <strong>{showDeleteConfirm.name}</strong>. Tindakan ini tidak bisa dibatalkan.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex:1, padding:'12px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>Batal</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} disabled={deleting} style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:'#DC2626', color:'white', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {deleting?<><span style={{width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}}/>Menghapus…</>:'🗑️ Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
