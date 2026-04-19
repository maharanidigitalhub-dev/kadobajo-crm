'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
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
        router.push('/admin/dashboard');
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, #F0F3FD 0%, #F8F9FF 50%, #EEF1FB 100%)',
      fontFamily: "'DM Sans', sans-serif",
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0   rgba(45,63,143,0.3); }
          70%  { box-shadow: 0 0 0 18px rgba(45,63,143,0);   }
          100% { box-shadow: 0 0 0 0   rgba(45,63,143,0);    }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .logo-pulse { animation: pulseRing 2.5s ease infinite; border-radius: 50%; display: inline-block; }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .spin { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
        .login-input:focus { border-color: #2D3F8F !important; box-shadow: 0 0 0 3px rgba(45,63,143,0.12) !important; background: white !important; }
        .login-input::placeholder { color: #9CA3AF; }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(45,63,143,0.35) !important; }
        .login-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .back-link:hover { color: #2D3F8F !important; }
      `}</style>

      <div className="fade-up" style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div className="logo-pulse" style={{ display: 'inline-block' }}>
            <img
              src="/logo.png"
              alt="Kado Bajo"
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
                boxShadow: '0 16px 48px rgba(45,63,143,0.25)',
              }}
            />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#111827', marginTop: 20, marginBottom: 4 }}>
            Kado Bajo
          </h1>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>Admin CRM Dashboard</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          border: '1.5px solid #E8ECF8',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 8px 48px rgba(45,63,143,0.1)',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#374151', marginBottom: 24, textAlign: 'left' }}>
            Masuk ke Dashboard
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9CA3AF', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                className="login-input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@kadobajo.com"
                autoComplete="email"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1.5px solid #E5E7EB', background: '#F9FAFB',
                  color: '#111827', fontSize: 14, outline: 'none',
                  transition: 'all 0.2s', boxSizing: 'border-box',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9CA3AF', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                className="login-input"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1.5px solid #E5E7EB', background: '#F9FAFB',
                  color: '#111827', fontSize: 14, outline: 'none',
                  transition: 'all 0.2s', boxSizing: 'border-box',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626', textAlign: 'left' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #2D3F8F, #1B2A6B)',
                color: 'white', fontSize: 15, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {loading ? <><span className="spin" /> Masuk…</> : 'Masuk'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <a
          href="https://kadobajo.id"
          className="back-link"
          style={{ display: 'block', marginTop: 20, fontSize: 12, color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.15s' }}
        >
          ← Kembali ke kadobajo.id
        </a>
      </div>
    </div>
  );
}
