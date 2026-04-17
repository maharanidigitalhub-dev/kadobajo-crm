'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Email atau password salah.');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1A0E08] flex items-center justify-center px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C4A35A]/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C4A35A] to-[#8B6914] flex items-center justify-center shadow-2xl shadow-[#C4A35A]/30">
            <span className="text-2xl">🎁</span>
          </div>
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kado Bajo
          </h1>
          <p className="text-[#8B7355] text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Admin CRM Dashboard
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#261610] border border-[#3D2515] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-[#E8C88A] text-lg font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Masuk ke Dashboard
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#8B7355] uppercase tracking-wider mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@kadobajo.com"
                autoComplete="email"
                className="w-full px-4 py-3 bg-[#1A0E08] border border-[#3D2515] rounded-xl text-[#E8DFD0] placeholder-[#5A4030] text-sm focus:outline-none focus:border-[#C4A35A] focus:ring-1 focus:ring-[#C4A35A]/30 transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8B7355] uppercase tracking-wider mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-[#1A0E08] border border-[#3D2515] rounded-xl text-[#E8DFD0] placeholder-[#5A4030] text-sm focus:outline-none focus:border-[#C4A35A] focus:ring-1 focus:ring-[#C4A35A]/30 transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C4A35A] to-[#8B6914] text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-[#C4A35A]/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 mt-2 flex items-center justify-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Masuk…</>
              ) : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-[#5A4030] text-xs hover:text-[#8B7355] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ← Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
