import { cookies, headers } from 'next/headers';
import AdminSidebar from '@/components/crm/AdminSidebar';
import { type Role } from '@/lib/roles';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('auth')?.value;
  const role = (cookieStore.get('auth_role')?.value ?? 'viewer') as Role;
  const name = cookieStore.get('auth_name')?.value ?? 'Admin';

  if (auth !== 'true') {
    return <>{children}</>;
  }

  return (
    <div className="crm-root">
      <AdminSidebar role={role} name={name} />
      <main className="crm-main">{children}</main>
    </div>
  );
}
