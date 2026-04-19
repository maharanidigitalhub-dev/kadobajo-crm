'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
      if (res.ok) { router.push('/dashboard'); router.refresh(); }
      else setError('Email atau password salah.');
    } catch { setError('Terjadi kesalahan. Coba lagi.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F8F9FF', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        @keyframes pulse-ring {
          0%{box-shadow:0 0 0 0 rgba(45,63,143,0.25)}
          70%{box-shadow:0 0 0 16px rgba(45,63,143,0)}
          100%{box-shadow:0 0 0 0 rgba(45,63,143,0)}
        }
        .pulse { animation: pulse-ring 2.5s ease infinite; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at top, rgba(45,63,143,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="pulse inline-block rounded-full mb-4">
            <Image src="/logo.png" alt="Kado Bajo" width={80} height={80}
              className="rounded-full object-cover"
              style={{ boxShadow: '0 8px 24px rgba(45,63,143,0.2)' }} />
          </div>
          <h1 className="serif font-bold text-2xl" style={{ color: '#111827' }}>Kado Bajo</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Admin CRM Dashboard</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1.5px solid #E8ECF8', borderRadius: 20, padding: '32px', boxShadow: '0 8px 40px rgba(45,63,143,0.1)' }}>
          <h2 className="serif font-semibold text-lg mb-6" style={{ color: '#374151' }}>Masuk ke Dashboard</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@kadobajo.com" autoComplete="email"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#111827', fontSize: 14, outline: 'none' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#2D3F8F'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#E5E7EB'} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••" autoComplete="current-password"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#111827', fontSize: 14, outline: 'none' }}
                onFocus={e => (e.target as HTMLElement).style.borderColor = '#2D3F8F'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = '#E5E7EB'} />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px' }}>
                <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #2D3F8F, #1B2A6B)', color: '#fff', border: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(45,63,143,0.35)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Masuk…</> : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs transition-colors" style={{ color: '#9CA3AF' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#2D3F8F'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9CA3AF'}>
            ← Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
