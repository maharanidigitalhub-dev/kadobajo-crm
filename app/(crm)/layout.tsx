import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/components/crm/LogoutButton';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#F8F9FF', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Sidebar */}
      <aside className="w-60 fixed inset-y-0 left-0 z-30 flex flex-col"
        style={{ background: '#fff', borderRight: '1.5px solid #E8ECF8' }}>

        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1.5px solid #E8ECF8' }}>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Kado Bajo" width={38} height={38}
              className="rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 2px 8px rgba(45,63,143,0.2)' }} />
            <div>
              <p className="serif font-semibold text-sm leading-none" style={{ color: '#1B2A6B' }}>Kado Bajo</p>
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>CRM System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem href="/dashboard" icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }>Dashboard</NavItem>

          <NavItem href="/customers" icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }>Customers</NavItem>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4" style={{ borderTop: '1.5px solid #E8ECF8' }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
      style={{ color: '#6B7280' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1B2A6B'; (e.currentTarget as HTMLElement).style.background = '#F0F3FD'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
      {icon}
      {children}
    </Link>
  );
}
