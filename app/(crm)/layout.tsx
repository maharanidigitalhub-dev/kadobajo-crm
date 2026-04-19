import Link from 'next/link';
import LogoutButton from '@/components/crm/LogoutButton';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="crm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        .crm-root { min-height: 100vh; display: flex; background: #F8F9FF; font-family: 'DM Sans', sans-serif; }
        .crm-serif { font-family: 'Playfair Display', serif; }

        /* Sidebar */
        .crm-sidebar {
          width: 240px; background: #fff;
          border-right: 1.5px solid #E8ECF8;
          position: fixed; inset-y: 0; left: 0; top: 0; bottom: 0;
          height: 100vh;
          display: flex; flex-direction: column; z-index: 30;
        }
        .crm-sidebar-logo {
          padding: 20px;
          border-bottom: 1.5px solid #E8ECF8;
          display: flex; align-items: center; gap: 12px;
        }
        .crm-logo-img {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
          box-shadow: 0 2px 8px rgba(45,63,143,0.2); flex-shrink: 0;
        }
        .crm-logo-name { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 14px; color: #1B2A6B; line-height: 1; }
        .crm-logo-sub { font-size: 11px; color: #9CA3AF; margin-top: 3px; }

        /* Nav */
        .crm-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
        .crm-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          font-size: 14px; color: #6B7280;
          text-decoration: none; transition: all 0.15s;
        }
        .crm-nav-item:hover { color: #1B2A6B; background: #F0F3FD; }
        .crm-nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }

        /* Footer */
        .crm-sidebar-footer { padding: 12px; border-top: 1.5px solid #E8ECF8; }

        /* Main */
        .crm-main { flex: 1; margin-left: 240px; min-height: 100vh; }
      `}</style>

      <aside className="crm-sidebar">
        {/* Logo */}
        <div className="crm-sidebar-logo">
          <img src="/logo.png" alt="Kado Bajo" className="crm-logo-img" />
          <div>
            <div className="crm-logo-name">Kado Bajo</div>
            <div className="crm-logo-sub">CRM System</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="crm-nav">
          <Link href="/dashboard" className="crm-nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link href="/cms" className="crm-nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V9h14v10zM7 11h5v5H7v-5z" />
            </svg>
            CMS
          </Link>

          <Link href="/customers" className="crm-nav-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Customers
          </Link>
        </nav>

        {/* Logout */}
        <div className="crm-sidebar-footer">
          <LogoutButton />
        </div>
      </aside>

      <main className="crm-main">
        {children}
      </main>
    </div>
  );
}
