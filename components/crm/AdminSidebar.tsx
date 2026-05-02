import Link from 'next/link';
import AdminLogoutButton from './AdminLogoutButton';
import { can, ROLE_META, type Role } from '@/lib/roles';

export default function AdminSidebar({ role, name }: { role: Role; name: string }) {
  const meta = ROLE_META[role];
  const initials = name.split(' ').slice(0,2).map((n: string) => n[0]).join('').toUpperCase();

  const navItems = [
    { href:'/admin/dashboard', label:'Dashboard', show:can(role,'viewDashboard'),
      icon:<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { href:'/admin/customers', label:'Customers', show:can(role,'viewCustomers'),
      icon:<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { href:'/admin/cms', label:'Landing Page CMS', show:can(role,'editCMS'),
      icon:<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { href:'/admin/users', label:'User Management', show:can(role,'manageUsers'),
      icon:<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { href:'/admin/settings', label:'Settings', show:true,
      icon:<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={16} height={16}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .crm-root{min-height:100vh;display:flex;background:#F8F9FF;}
        .crm-sidebar{width:240px;background:white;border-right:1.5px solid #E8ECF8;position:fixed;top:0;bottom:0;left:0;height:100vh;display:flex;flex-direction:column;z-index:30;font-family:'DM Sans',sans-serif;}
        .crm-sidebar-logo{padding:20px;border-bottom:1.5px solid #E8ECF8;display:flex;align-items:center;gap:12px;}
        .crm-logo-img{width:40px;height:40px;border-radius:50%;object-fit:cover;box-shadow:0 2px 8px rgba(45,63,143,0.2);flex-shrink:0;}
        .crm-logo-name{font-family:'Playfair Display',serif;font-weight:700;font-size:14px;color:#1B2A6B;line-height:1;}
        .crm-logo-sub{font-size:11px;color:#9CA3AF;margin-top:3px;}
        .crm-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;}
        .crm-nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;font-size:14px;color:#6B7280;text-decoration:none;transition:all 0.15s;font-family:'DM Sans',sans-serif;font-weight:500;}
        .crm-nav-item:hover{color:#1B2A6B;background:#F0F3FD;}
        .crm-nav-item svg{flex-shrink:0;}
        .crm-sidebar-footer{padding:12px;border-top:1.5px solid #E8ECF8;}
        .crm-main{flex:1;margin-left:240px;min-height:100vh;}
        .logout-btn{display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border-radius:10px;font-size:14px;color:#9CA3AF;background:none;border:none;cursor:pointer;transition:all 0.15s;font-family:'DM Sans',sans-serif;font-weight:500;}
        .logout-btn:hover{color:#DC2626;background:#FEF2F2;}
        @media(max-width:768px){.crm-sidebar{width:200px;}.crm-main{margin-left:200px;}}
        @media(max-width:640px){.crm-sidebar{display:none;}.crm-main{margin-left:0;}}
      `}</style>

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
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:8, background:'#F8F9FF', borderRadius:12, border:'1.5px solid #E8ECF8' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:meta.color, flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#0F172A', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</p>
              <span style={{ fontSize:10, fontWeight:700, color:meta.color, background:meta.bg, padding:'2px 7px', borderRadius:20, display:'inline-block', marginTop:2 }}>
                {meta.icon} {meta.label}
              </span>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>
    </>
  );
}
