import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UsersPageClient from './users-page';

export default async function UsersPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  if (role !== 'superadmin') {
    redirect('/admin/dashboard');
  }
  return <UsersPageClient />;
}
