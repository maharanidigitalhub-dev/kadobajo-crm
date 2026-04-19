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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0E1A', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        .input-field {
          background: rgba(10,14,26,0.8);
          border: 1px solid rgba(27,42,107,0.4);
          color: #E8EAF0;
          transition: all 0.2s;
        }
        .input-field:focus { outline: none; border-color: #2D3F8F; box-shadow: 0 0 0 3px rgba(27,42,107,0.2); }
        .input-field::placeholder { color: rgba(139,147,184,0.4); }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(27,42,107,0.4)} 70%{box-shadow:0 0 0 20px rgba(27,42,107,0)} 100%{box-shadow:0 0 0 0 rgba(27,42,107,0)} }
        .pulse { animation: pulse-ring 2.5s ease infinite; }
      `}</style>

      {/* Background */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(rgba(27,42,107,0.06) 1px, transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />
      <div style={{ position:'fixed', top:'30%', left:'50%', transform:'translateX(-50%)', width:'500px', height:'500px', background:'radial-gradient(circle, rgba(27,42,107,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="pulse inline-block rounded-full mb-4">
            <Image src="/logo.jpg" alt="Kado Bajo" width={80} height={80}
              className="rounded-full object-cover"
              style={{ border: '3px solid rgba(27,42,107,0.7)', filter: 'drop-shadow(0 0 20px rgba(27,42,107,0.6))' }} />
          </div>
          <h1 className="serif font-bold text-2xl" style={{ color: '#E8EAF0' }}>Kado Bajo</h1>
          <p className="text-sm mt-1" style={{ color: '#4A5280' }}>Admin CRM Dashboard</p>
        </div>

        {/* Card */}
        <div style={{ background: '#0F1528', border: '1px solid rgba(27,42,107,0.4)', borderRadius: 20, padding: '32px', boxShadow: '0 0 60px rgba(27,42,107,0.25)' }}>
          <h2 className="serif font-semibold text-lg mb-6" style={{ color: '#8B93B8' }}>Masuk ke Dashboard</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A5280' }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@kadobajo.com" autoComplete="email"
                className="input-field w-full px-4 py-3 rounded-xl text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A5280' }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••" autoComplete="current-password"
                className="input-field w-full px-4 py-3 rounded-xl text-sm" />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px' }}>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #2D3F8F, #1B2A6B)', border: '1px solid rgba(45,63,143,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #3D52B0, #2D3F8F)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #2D3F8F, #1B2A6B)')}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Masuk…</>
              ) : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs transition-colors" style={{ color: '#2D3570' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#8B93B8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#2D3570')}>
            ← Kembali ke Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
