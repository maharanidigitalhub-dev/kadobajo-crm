'use client';
import { useState, useEffect, useRef } from 'react';

interface UserProfile {
  id: string; email: string; name: string;
  role: string; avatar_url?: string; created_at: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profile'|'password'|'avatar'>('profile');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{type:'ok'|'err', text:string}|null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({ name: '' });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', confirm: '' });

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => {
      if (!data.error) {
        setUser(data);
        setProfileForm({ name: data.name });
      }
      setLoading(false);
    });
  }, []);

  function flash(type: 'ok'|'err', text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function saveProfile() {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profileForm.name }),
    });
    const data = await res.json();
    if (res.ok) { setUser(u => u ? { ...u, name: data.user?.name ?? profileForm.name } : u); flash('ok', 'Profil berhasil diupdate!'); }
    else flash('err', data.error ?? 'Gagal update profil');
    setSaving(false);
  }

  async function savePassword() {
    if (pwForm.new_password !== pwForm.confirm) { flash('err', 'Konfirmasi password tidak sesuai'); return; }
    if (pwForm.new_password.length < 6) { flash('err', 'Password minimal 6 karakter'); return; }
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: pwForm.old_password, new_password: pwForm.new_password }),
    });
    const data = await res.json();
    if (res.ok) { setPwForm({ old_password:'', new_password:'', confirm:'' }); flash('ok', 'Password berhasil diubah!'); }
    else flash('err', data.error ?? 'Gagal ubah password');
    setSaving(false);
  }

  async function handleAvatarUpload(file: File) {
    if (file.size > 2 * 1024 * 1024) { flash('err', 'Foto max 2MB'); return; }
    if (!file.type.startsWith('image/')) { flash('err', 'Hanya file gambar'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) { flash('err', data.error ?? 'Upload gagal'); return; }

      const patchRes = await fetch('/api/admin/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: data.url }),
      });
      if (patchRes.ok) { setUser(u => u ? { ...u, avatar_url: data.url } : u); flash('ok', 'Foto profil berhasil diupdate!'); }
      else flash('err', 'Gagal simpan foto');
    } finally { setUploading(false); }
  }

  const ROLE_COLOR: Record<string, string> = { admin:'#7C3AED', manager:'#2D3F8F', sales:'#0369A1', viewer:'#6B7280' };
  const ROLE_BG:    Record<string, string> = { admin:'#F5F3FF', manager:'#EEF2FF', sales:'#E0F2FE', viewer:'#F3F4F6' };
  const ROLE_ICON:  Record<string, string> = { admin:'👑', manager:'🎯', sales:'💼', viewer:'👁️' };

  const S = {
    input: { width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', fontSize:14, color:'#111827', outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' as const, transition:'border-color 0.2s' },
    label: { display:'block', fontSize:11, fontWeight:700 as const, textTransform:'uppercase' as const, letterSpacing:'1px', color:'#9CA3AF', marginBottom:6 },
    field: { marginBottom:18 },
    card: { background:'white', border:'1.5px solid #E8ECF8', borderRadius:16, padding:28 },
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ width:28, height:28, border:'3px solid #E8ECF8', borderTopColor:'#2D3F8F', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const role = user?.role ?? 'viewer';
  const initials = (user?.name ?? 'U').split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();

  return (
    <div style={{ padding:32, maxWidth:680, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        input:focus{border-color:#2D3F8F!important;box-shadow:0 0 0 3px rgba(45,63,143,0.1)!important;background:white!important}
        .tab-btn{padding:9px 20px;border-radius:9px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif}
        .save-btn{padding:11px 28px;borderRadius:10px;border:none;cursor:pointer;background:linear-gradient(135deg,#2D3F8F,#1B2A6B);color:white;font-size:14px;font-weight:700;display:flex;align-items:center;gap:8px;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .save-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(45,63,143,0.3)}
        .save-btn:disabled{opacity:0.55;cursor:not-allowed}
        .avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);borderRadius:50%;display:flex;align-items:center;justifyContent:center;opacity:0;transition:opacity 0.2s;cursor:pointer}
        .avatar-wrap:hover .avatar-overlay{opacity:1}
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#0F172A', margin:0 }}>Settings</h1>
        <p style={{ fontSize:13, color:'#94A3B8', marginTop:4 }}>Kelola akun dan preferensi kamu</p>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{ animation:'fadeIn 0.2s ease', background: msg.type==='ok' ? '#DCFCE7' : '#FEF2F2', border:`1px solid ${msg.type==='ok'?'#86EFAC':'#FECACA'}`, borderRadius:10, padding:'10px 16px', marginBottom:20, fontSize:13, fontWeight:600, color: msg.type==='ok'?'#16A34A':'#DC2626' }}>
          {msg.type==='ok'?'✓':'✗'} {msg.text}
        </div>
      )}

      {/* Profile card */}
      <div style={{ ...S.card, marginBottom:20, display:'flex', alignItems:'center', gap:20 }}>
        {/* Avatar */}
        <div className="avatar-wrap" style={{ position:'relative', flexShrink:0 }} onClick={() => fileRef.current?.click()}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover', border:'3px solid #E8ECF8' }} />
          ) : (
            <div style={{ width:72, height:72, borderRadius:'50%', background:ROLE_BG[role], display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:ROLE_COLOR[role], border:'3px solid #E8ECF8' }}>
              {initials}
            </div>
          )}
          <div className="avatar-overlay">
            {uploading ? <span style={{ width:20, height:20, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
              : <span style={{ fontSize:18 }}>📷</span>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if(e.target.files?.[0]) handleAvatarUpload(e.target.files[0]); }} />
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:18, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>{user?.name}</p>
          <p style={{ fontSize:13, color:'#94A3B8', margin:'0 0 8px' }}>{user?.email}</p>
          <span style={{ fontSize:11, fontWeight:700, color:ROLE_COLOR[role], background:ROLE_BG[role], padding:'3px 10px', borderRadius:20 }}>
            {ROLE_ICON[role]} {role.charAt(0).toUpperCase()+role.slice(1)}
          </span>
        </div>

        <div style={{ textAlign:'right' }}>
          <p style={{ fontSize:11, color:'#CBD5E1', margin:0 }}>Member since</p>
          <p style={{ fontSize:12, fontWeight:600, color:'#94A3B8', margin:0 }}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : '—'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#F3F4F6', padding:4, borderRadius:10, width:'fit-content' }}>
        {[['profile','👤 Profil'],['password','🔒 Password'],['avatar','🖼️ Foto Profil']] .map(([key,label]) => (
          <button key={key} className="tab-btn" onClick={() => setTab(key as any)}
            style={{ background: tab===key ? '#2D3F8F' : 'transparent', color: tab===key ? 'white' : '#6B7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div style={S.card}>
          <p style={{ fontSize:14, fontWeight:700, color:'#374151', marginBottom:20 }}>Informasi Profil</p>
          <div style={S.field}>
            <label style={S.label}>Nama Lengkap</label>
            <input style={S.input} value={profileForm.name} onChange={e => setProfileForm({name:e.target.value})} placeholder="Nama lengkap" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input style={{ ...S.input, background:'#F3F4F6', color:'#9CA3AF', cursor:'not-allowed' }} value={user?.email ?? ''} disabled />
            <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>Email tidak bisa diubah</p>
          </div>
          <div style={S.field}>
            <label style={S.label}>Role</label>
            <div style={{ padding:'11px 14px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F3F4F6', display:'flex', alignItems:'center', gap:8 }}>
              <span>{ROLE_ICON[role]}</span>
              <span style={{ fontSize:14, color:'#6B7280' }}>{role.charAt(0).toUpperCase()+role.slice(1)}</span>
            </div>
            <p style={{ fontSize:11, color:'#9CA3AF', marginTop:4 }}>Role hanya bisa diubah oleh Admin</p>
          </div>
          <button className="save-btn" disabled={saving} onClick={saveProfile}
            style={{ padding:'11px 28px', borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8, transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif" }}>
            {saving ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />Menyimpan…</> : '💾 Simpan Perubahan'}
          </button>
        </div>
      )}

      {/* Password tab */}
      {tab === 'password' && (
        <div style={S.card}>
          <p style={{ fontSize:14, fontWeight:700, color:'#374151', marginBottom:20 }}>Ubah Password</p>
          <div style={S.field}>
            <label style={S.label}>Password Lama *</label>
            <input style={S.input} type="password" value={pwForm.old_password} onChange={e => setPwForm({...pwForm, old_password:e.target.value})} placeholder="Password saat ini" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password Baru *</label>
            <input style={S.input} type="password" value={pwForm.new_password} onChange={e => setPwForm({...pwForm, new_password:e.target.value})} placeholder="Minimal 6 karakter" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Konfirmasi Password Baru *</label>
            <input style={{ ...S.input, borderColor: pwForm.confirm && pwForm.confirm !== pwForm.new_password ? '#EF4444' : '#E5E7EB' }} type="password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm:e.target.value})} placeholder="Ulangi password baru" />
            {pwForm.confirm && pwForm.confirm !== pwForm.new_password && <p style={{ fontSize:12, color:'#EF4444', marginTop:4 }}>Password tidak cocok</p>}
          </div>
          <button className="save-btn" disabled={saving || !pwForm.old_password || !pwForm.new_password} onClick={savePassword}
            style={{ padding:'11px 28px', borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color:'white', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8, transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif" }}>
            {saving ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />Menyimpan…</> : '🔒 Ubah Password'}
          </button>
        </div>
      )}

      {/* Avatar tab */}
      {tab === 'avatar' && (
        <div style={S.card}>
          <p style={{ fontSize:14, fontWeight:700, color:'#374151', marginBottom:20 }}>Foto Profil</p>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
            {/* Current avatar */}
            <div style={{ position:'relative' }}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} style={{ width:120, height:120, borderRadius:'50%', objectFit:'cover', border:'4px solid #E8ECF8', boxShadow:'0 4px 16px rgba(45,63,143,0.15)' }} />
              ) : (
                <div style={{ width:120, height:120, borderRadius:'50%', background:ROLE_BG[role], display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, fontWeight:700, color:ROLE_COLOR[role], border:'4px solid #E8ECF8' }}>
                  {initials}
                </div>
              )}
            </div>

            <div style={{ width:'100%', border:'2px dashed #C7D0F0', borderRadius:14, padding:28, textAlign:'center', cursor:'pointer', background:'#F8F9FF' }} onClick={() => fileRef.current?.click()}>
              {uploading ? (
                <div><span style={{ width:24, height:24, border:'3px solid #C7D0F0', borderTopColor:'#2D3F8F', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite', marginBottom:8 }} /><p style={{ color:'#6B7280', fontSize:14, margin:0 }}>Mengupload…</p></div>
              ) : (
                <div><div style={{ fontSize:32, marginBottom:8 }}>📸</div><p style={{ fontWeight:600, color:'#374151', margin:'0 0 4px' }}>Klik untuk upload foto baru</p><p style={{ fontSize:12, color:'#9CA3AF', margin:0 }}>JPG, PNG, WebP — max 2MB</p></div>
              )}
            </div>

            {user?.avatar_url && (
              <button onClick={async () => {
                const res = await fetch('/api/admin/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ avatar_url: null }) });
                if (res.ok) { setUser(u => u ? {...u, avatar_url:undefined} : u); flash('ok', 'Foto profil dihapus'); }
              }} style={{ padding:'8px 20px', borderRadius:8, border:'1.5px solid #FECACA', background:'white', color:'#DC2626', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                🗑️ Hapus Foto Profil
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
