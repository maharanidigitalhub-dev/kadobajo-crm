'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function CRMError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CRM error:', error?.message, error?.digest);
  }, [error]);

  const isSupabaseError =
    error?.message?.includes('supabase') ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('network');

  return (
    <div style={{
      padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 14, margin: 0 }}>
            ⚠️ {isSupabaseError ? 'Gagal terhubung ke database' : 'Terjadi kesalahan pada halaman ini'}
          </p>
          {error?.digest && (
            <p style={{ color: '#9CA3AF', fontSize: 11, marginTop: 6, fontFamily: 'monospace', margin: '6px 0 0' }}>
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 16, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ color: '#B45309', fontSize: 13, fontWeight: 600, margin: '0 0 8px' }}>Cara memperbaiki:</p>
          <ol style={{ color: '#6B7280', fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            <li>Buka <strong>Vercel → Project → Settings → Environment Variables</strong></li>
            <li>Pastikan <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_URL</code> sudah diisi</li>
            <li>Pastikan <code style={{ background: '#F3F4F6', padding: '1px 4px', borderRadius: 4 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> sudah diisi</li>
            <li>Klik <strong>Redeploy</strong> di Vercel</li>
          </ol>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={reset}
            style={{ background: 'linear-gradient(135deg, #2D3F8F, #1B2A6B)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            Coba Lagi
          </button>
          <Link href="/dashboard"
            style={{ background: '#F3F4F6', color: '#374151', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Refresh
          </Link>
        </div>
      </div>
    </div>
  );
}
