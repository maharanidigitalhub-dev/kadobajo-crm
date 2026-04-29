'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/crm/AdminLogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // ── Login page: no sidebar, just render the page ──
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ── All other admin pages: full sidebar layout ──
  return (
    <div className="crm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

        .crm-root { display:flex; min-height:100vh; background:#F8F9FF; font-family:'DM Sans',sans-serif; }

        .crm-sidebar {
          width:240px; min-height:100vh; background:white;
          border-right:1.5px solid #E8ECF8;
          display:flex; flex-direction:column;
          position:fixed; top:0; left:0; bottom:0; z-index:50;
          box-shadow:2px 0 12px rgba(45,63,143,0.04);
        }
        .crm-sidebar-logo {
          display:flex; align-items:center; gap:10px;
          padding:20px 20px 16px;
          border-bottom:1.5px solid #E8ECF8;
        }
        .crm-logo-name { font-family:'Playfair Display',serif; font-size:14px; font-weight:700; color:#1B2A6B; line-height:1.2; }
        .crm-logo-sub  { font-size:10px; color:#9CA3AF; letter-spacing:0.5px; text-transform:uppercase; margin-top:1px; }

        .crm-nav { flex:1; padding:12px 10px; overflow-y:auto; }
        .crm-nav-item {
          display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:8px;
          font-size:13px; font-weight:500; color:#6B7280;
          text-decoration:none; transition:all 0.15s; margin-bottom:2px;
        }
        .crm-nav-item:hover { background:#F0F3FD; color:#2D3F8F; }

        .crm-nav-group-label {
          font-size:10px; font-weight:700; text-transform:uppercase;
          letter-spacing:1px; color:#C4C9D4; padding:12px 12px 4px;
        }

        .crm-submenu { padding-left:8px; }
        .crm-submenu-item {
          display:flex; align-items:center; gap:8px;
          padding:7px 12px 7px 16px; border-radius:8px;
          font-size:12px; font-weight:500; color:#9CA3AF;
          text-decoration:none; transition:all 0.15s;
          position:relative; margin-bottom:1px;
        }
        .crm-submenu-item::before {
          content:''; position:absolute; left:4px; top:50%; transform:translateY(-50%);
          width:4px; height:4px; border-radius:50%; background:#C4C9D4; transition:background 0.15s;
        }
        .crm-submenu-item:hover { background:#F0F3FD; color:#2D3F8F; }
        .crm-submenu-item:hover::before { background:#2D3F8F; }

        .crm-sidebar-footer { padding:12px 10px; border-top:1.5px solid #E8ECF8; }
        .crm-main { flex:1; margin-left:240px; min-height:100vh; background:#F8F9FF; }

        @media (max-width:768px) {
          .crm-sidebar { width:200px; }
          .crm-main    { margin-left:200px; }
        }
      `}</style>

      <aside className="crm-sidebar">
        <div className="crm-sidebar-logo">
          <Image src="/logo.png" alt="Kado Bajo" width={36} height={36}
            style={{ borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
          <div>
            <div className="crm-logo-name">Kado Bajo</div>
            <div className="crm-logo-sub">CRM System</div>
          </div>
        </div>

        <nav className="crm-nav">
          <Link href="/admin/dashboard" className="crm-nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link href="/admin/customers" className="crm-nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Customers
          </Link>

          <div className="crm-nav-group-label" style={{marginTop:8}}>Content</div>

          <Link href="/admin/cms" className="crm-nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Landing Pages CMS
          </Link>

          <div className="crm-submenu">
            {[
              { slug:'lp',   flag:'🌍', label:'Universal' },
              { slug:'lp-2', flag:'🇺🇸', label:'EU / US'  },
              { slug:'lp-3', flag:'🇸🇬', label:'SEA'       },
              { slug:'lp-4', flag:'🇦🇺', label:'AUS / NZ'  },
              { slug:'lp-5', flag:'🇮🇩', label:'Indonesia' },
            ].map(({ slug, flag, label }) => (
              <Link key={slug} href={`/admin/cms?slug=${slug}`} className="crm-submenu-item">
                <span style={{fontSize:11}}>{flag}</span>
                <span>{label}</span>
                <span style={{fontSize:10, color:'#C4C9D4', marginLeft:'auto'}}>/{slug}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="crm-sidebar-footer">
          <LogoutButton />
        </div>
      </aside>

      <main className="crm-main">{children}</main>
    </div>
  );
}
