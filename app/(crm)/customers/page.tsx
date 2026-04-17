import { getAllCustomers } from '@/lib/customers';
import CustomersClient from './CustomersClient';

// app/(crm)/dashboard/page.tsx
// app/(crm)/customers/page.tsx
export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await getAllCustomers();
  return <CustomersClient initialCustomers={customers} />;
}
