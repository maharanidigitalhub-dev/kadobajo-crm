'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'editor' | 'viewer';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

const ROLE_META: Record<UserRole, { label: string; color: string; bg: string; desc: string }> = {
  admin:  { label: '👑 Admin',  color: '#DC2626', bg: '#FEF2F2', desc: 'Akses penuh ke semua fitur' },
  editor: { label: '✏️ Editor', color: '#2D3F8F', bg: '#EEF2FF', desc: 'Edit CMS & kelola customers' },
  viewer: { label: '👁️ Viewer', color: '#6B7280', bg: '#F3F4F6', desc: 'Hanya lihat dashboard & data' },
};

const S = {
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: 14, color: '#111827', outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box' as const },
  label: { display: 'block', fontSize: 11, fontWeight: 700 as const, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#9CA3AF', marginBottom: 6 },
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer' as UserRole });

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.status === 403) { router.replace('/admin/dashboard?error=unauthorized'); return; }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { setError('Gagal memuat data users'); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'viewer' });
    setError('');
    setShowModal(true);
  }

  function openEdit(user: AdminUser) {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      if (editUser) {
        // Update
        const body: any = { name: form.name, role: form.role };
        if (form.password) body.password = form.password;
        const res = await fetch(`/api/admin/users/${editUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? 'Gagal update'); return; }
        setSuccess('User berhasil diupdate!');
      } else {
        // Create
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? 'Gagal membuat user'); return; }
        setSuccess('User berhasil ditambahkan!');
      }
      setShowModal(false);
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Server error'); }
    finally { setSaving(false); }
  }

  async function toggleActive(user: AdminUser) {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Gagal update'); return; }
      loadUsers();
    } catch { setError('Server error'); }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Hapus user ${user.name}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Gagal hapus'); return; }
      setSuccess('User berhasil dihapus!');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Server error'); }
  }

  function formatDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div style={{ padding: 32, fontFamily: "'DM Sans',sans-serif", maxWidth: 1000 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        input:focus, select:focus { border-color:#2D3F8F !important; box-shadow:0 0 0 3px rgba(45,63,143,0.1) !important; }
        .user-row:hover { background:#F8F9FF !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#111827', margin: 0 }}>Manage Users</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Kelola akses dan role tim kamu</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {success && <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600, animation: 'fadeIn 0.2s ease' }}>✓ {success}</span>}
          <button onClick={openAdd} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color: 'white', fontSize: 14, fontWeight: 700 }}>
            + Tambah User
          </button>
        </div>
      </div>

      {/* Role Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {(Object.entries(ROLE_META) as [UserRole, typeof ROLE_META[UserRole]][]).map(([role, meta]) => (
          <div key={role} style={{ background: meta.bg, border: `1.5px solid ${meta.color}20`, borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.label}</span>
            <span style={{ fontSize: 12, color: '#6B7280' }}>— {meta.desc}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: 'white', border: '1.5px solid #E8ECF8', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#9CA3AF' }}>Memuat data...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F9FF', borderBottom: '1.5px solid #E8ECF8' }}>
                {['Nama & Email', 'Role', 'Status', 'Login Terakhir', 'Dibuat', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9CA3AF' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const meta = ROLE_META[user.role];
                return (
                  <tr key={user.id} className="user-row" style={{ borderBottom: i < users.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontWeight: 700, color: '#111827', fontSize: 14, margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{user.email}</p>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: meta.bg, color: meta.color, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => toggleActive(user)}
                        style={{ background: user.is_active ? '#ECFDF5' : '#F3F4F6', color: user.is_active ? '#10B981' : '#9CA3AF', border: 'none', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        {user.is_active ? '● Aktif' : '○ Nonaktif'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(user.last_login)}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(user.created_at)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(user)}
                          style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #E8ECF8', background: 'white', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user)}
                          style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, animation: 'fadeIn 0.2s ease' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#111827', marginBottom: 24 }}>
              {editUser ? 'Edit User' : 'Tambah User Baru'}
            </h2>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Nama Lengkap</label>
              <input style={S.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Contoh: Budi Santoso" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Email</label>
              <input style={S.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@kadobajo.com" disabled={!!editUser} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>{editUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}</label>
              <input style={S.input} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 karakter" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>Role</label>
              <select style={{ ...S.input, cursor: 'pointer' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                <option value="viewer">👁️ Viewer — Hanya lihat dashboard & data</option>
                <option value="editor">✏️ Editor — Edit CMS & kelola customers</option>
                <option value="admin">👑 Admin — Akses penuh ke semua fitur</option>
              </select>
            </div>

            {/* Role preview */}
            <div style={{ background: ROLE_META[form.role].bg, border: `1.5px solid ${ROLE_META[form.role].color}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: ROLE_META[form.role].color, fontWeight: 600, margin: 0 }}>
                {ROLE_META[form.role].label} dapat:
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
                {form.role === 'admin' && '✅ Manage users · ✅ Edit CMS · ✅ Edit customers · ✅ Export CSV · ✅ Lihat semua'}
                {form.role === 'editor' && '❌ Manage users · ✅ Edit CMS · ✅ Edit customers · ✅ Export CSV · ✅ Lihat semua'}
                {form.role === 'viewer' && '❌ Manage users · ❌ Edit CMS · ❌ Edit customers · ❌ Export CSV · ✅ Lihat dashboard'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', color: '#6B7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: saving ? '#9CA3AF' : 'linear-gradient(135deg,#2D3F8F,#1B2A6B)', color: 'white', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Tambah User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
