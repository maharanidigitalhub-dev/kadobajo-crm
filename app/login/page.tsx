'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
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
        const { protocol, hostname } = window.location;
        const baseHost = hostname.startsWith('admin.') ? hostname.slice(6) : hostname;
        const targetHost = baseHost.includes('localhost') ? hostname : `admin.${baseHost}`;
        window.location.href = `${protocol}//${targetHost}/admin`;
        return;
      }
      else setError('Email atau password salah.');
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .login-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 24px; background: #F8F9FF; font-family: 'DM Sans', sans-serif;
        }
        .login-bg {
          position: fixed; inset: 0;
          background: radial-gradient(ellipse at top, rgba(45,63,143,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .login-wrap { position: relative; width: 100%; max-width: 360px; }

        /* Logo area */
        .login-logo-wrap { text-align: center; margin-bottom: 32px; }
        .login-logo {
          width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
          box-shadow: 0 8px 24px rgba(45,63,143,0.2);
          animation: pulse-ring 2.5s ease infinite;
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(45,63,143,0.25); }
          70%  { box-shadow: 0 0 0 14px rgba(45,63,143,0);   }
          100% { box-shadow: 0 0 0 0   rgba(45,63,143,0);    }
        }
        .login-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #111827; margin-top: 14px; }
        .login-sub { font-size: 13px; color: #6B7280; margin-top: 4px; }

        /* Card */
        .login-card {
          background: #fff; border: 1.5px solid #E8ECF8; border-radius: 20px;
          padding: 32px; box-shadow: 0 8px 40px rgba(45,63,143,0.1);
        }
        .login-card-title { font-family: 'Playfair Display', serif; font-size: 17px; color: #374151; margin-bottom: 24px; }

        /* Form */
        .login-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280; margin-bottom: 6px; }
        .login-input {
          width: 100%; padding: 12px 16px; border-radius: 12px;
          border: 1.5px solid #E5E7EB; background: #F9FAFB;
          color: #111827; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .login-input:focus { border-color: #2D3F8F; box-shadow: 0 0 0 3px rgba(45,63,143,0.1); }
        .login-input::placeholder { color: #9CA3AF; }
        .login-field { margin-bottom: 16px; }

        /* Error */
        .login-error { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; }
        .login-error p { color: #DC2626; font-size: 13px; }

        /* Button */
        .login-btn {
          width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #2D3F8F, #1B2A6B);
          color: #fff; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s; margin-top: 8px;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,63,143,0.35); }
        .login-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Spinner */
        .spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Back link */
        .login-back { display: block; text-align: center; margin-top: 20px; font-size: 12px; color: #9CA3AF; text-decoration: none; transition: color 0.15s; }
        .login-back:hover { color: #2D3F8F; }
      `}</style>

      <div className="login-bg" />

      <div className="login-wrap">
        {/* Logo */}
        <div className="login-logo-wrap">
          <img src="/logo.png" alt="Kado Bajo" className="login-logo" />
          <div className="login-title">Kado Bajo</div>
          <div className="login-sub">Admin CRM Dashboard</div>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-title">Masuk ke Dashboard</div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email</label>
              <input type="email" className="login-input" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@kadobajo.com" autoComplete="email" />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <input type="password" className="login-input" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••" autoComplete="current-password" />
            </div>

            {error && (
              <div className="login-error"><p>{error}</p></div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <><span className="spin" />Masuk…</> : 'Masuk'}
            </button>
          </form>
        </div>

        <Link href="/" className="login-back">← Kembali ke Landing Page</Link>
      </div>
    </div>
  );
}
