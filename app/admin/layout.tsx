import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CRMLayout from '../(crm)/layout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = (await cookies()).get('auth')?.value;

  if (auth !== 'true') {
    redirect('/login');
  }

  return <CRMLayout>{children}</CRMLayout>;
}
