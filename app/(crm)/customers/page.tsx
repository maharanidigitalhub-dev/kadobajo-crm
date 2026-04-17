import { getAllCustomers } from '@/lib/customers';
import CustomersClient from './CustomersClient';

// Always render at request time — never statically at build
export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await getAllCustomers();
  return <CustomersClient initialCustomers={customers} />;
}
