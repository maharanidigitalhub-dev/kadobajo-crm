'use client'

// components/crm/AddUserModal.tsx
// Taruh di: components/crm/AddUserModal.tsx

import { useState } from 'react'

type Role = 'superadmin' | 'admin' | 'viewer'

const ROLES: { value: Role; label: string; emoji: string; description: string }[] = [
  {
    value: 'superadmin',
    label: 'Super Admin',
    emoji: '👑',
    description: 'Akses penuh termasuk manajemen user',
  },
  {
    value: 'admin',
    label: 'Admin',
    emoji: '🧳',
    description: 'Tambah customer, bulk import, edit CMS/LP (pending approval), ubah status (perlu foto chat)',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    emoji: '👁️',
    description: 'Hanya bisa melihat data, tidak bisa mengubah',
  },
]

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function AddUserModal({ onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedRole = ROLES.find((r) => r.value === role)!

  async function handleSubmit() {
    setError('')

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Semua field wajib diisi')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal membuat user')
        return
      }

      onSuccess()
      onClose()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-gray-800">
            Tambah User Baru
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              NAMA LENGKAP *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              EMAIL *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@kadobajo.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              PASSWORD *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 karakter"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              ROLE *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.emoji} {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role description */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-gray-700">
            <span className="font-semibold text-blue-700">
              {selectedRole.emoji} {selectedRole.label}
            </span>{' '}
            — {selectedRole.description}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] py-3 rounded-xl bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : '✨ Buat User'}
          </button>
        </div>
      </div>
    </div>
  )
}
