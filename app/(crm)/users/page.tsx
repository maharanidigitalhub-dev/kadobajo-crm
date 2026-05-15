'use client';
import { useState, useEffect } from 'react';
import type { AppUser, UserRole } from '@/types';

const ROLES: UserRole[] = ['superadmin', 'manager', 'admin', 'management'];

const ROLE_BADGE: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-800',
  manager:    'bg-blue-100 text-blue-800',
  admin:      'bg-teal-100 text-teal-800',
  management: 'bg-gray-100 text-gray-700',
};

export default function UsersPage() {
  const [users, setUsers]       = useState<AppUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'admin' as UserRole });

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  async function handleCreate() {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    // BUGFIX: Cek res.ok dulu sebelum update state — sebelumnya error object ikut di-push ke array users
    if (!res.ok) {
      const err = await res.json();
      alert(err?.error ?? 'Gagal membuat user');
      return;
    }
    const newUser = await res.json();
    setUsers(prev => [newUser, ...prev]);
    setShowForm(false);
    setForm({ name: '', email: '', password: '', role: 'admin' });
  }

  async function handleRoleChange(userId: string, role: UserRole) {
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }

  async function handleToggleActive(userId: string, is_active: boolean) {
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active }),
    });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active } : u));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Kelola User</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          + Tambah User
        </button>
      </div>

      {/* Form tambah user */}
      {showForm && (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50 space-y-3">
          <h2 className="text-sm font-medium">User Baru</h2>
          <input
            placeholder="Nama"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            placeholder="Email"
            type="email"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleCreate}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
              Simpan
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 border text-sm rounded hover:bg-gray-100">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Tabel user */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 pr-4">Nama</th>
              <th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4">Role</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id} className="py-3">
                <td className="py-3 pr-4 font-medium">{user.name}</td>
                <td className="py-3 pr-4 text-gray-500">{user.email}</td>
                <td className="py-3 pr-4">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${ROLE_BADGE[user.role]}`}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => handleToggleActive(user.id, !user.is_active)}
                    className="text-xs text-gray-500 hover:text-gray-800 underline"
                  >
                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
