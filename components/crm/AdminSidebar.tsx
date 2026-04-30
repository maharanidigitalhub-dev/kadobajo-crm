import Link from 'next/link';
import AdminLogoutButton from './AdminLogoutButton';
import { can, ROLE_META, type Role } from '@/lib/roles';

export default function AdminSidebar({ role, name }: { role: Role; name: string }) {
  const meta = ROLE_META[role];
  const initials = name.split(' ').slice(0,2).map((n: string) => n[0]).join('').toUpperCase();

  const navItems = [
    {
      href: '/admin/dashboard', label: 'Dashboard', show: can(role, 'viewDashboard'),
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      href: '/admin/customers', label: 'Customers', show: can(role, 'viewCustomers'),
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
      href: '/admin/cms', label: 'Landing Page CMS', show: can(role, 'editCMS'),
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    },
    {
      href: '/admin/users', label: 'User Management', show: can(role, 'manageUsers'),
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
  ];

  return (
    <aside className="crm-sidebar">
      <div className="crm-sidebar-logo">
        <img src="/logo.png" alt="Kado Bajo" className="crm-logo-img" />
        <div>
          <div className="crm-logo-name">Kado Bajo</div>
          <div className="crm-logo-sub">CRM System</div>
        </div>
      </div>

      <nav className="crm-nav">
        {navItems.filter(i => i.show).map(item => (
          <Link key={item.href} href={item.href} className="crm-nav-item">
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="crm-sidebar-footer">
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:4, background:'#F8F9FF', borderRadius:12 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:meta.color, flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</p>
            <span style={{ fontSize:10, fontWeight:700, color:meta.color, background:meta.bg, padding:'1px 6px', borderRadius:20 }}>
              {meta.icon} {meta.label}
            </span>
          </div>
        </div>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
