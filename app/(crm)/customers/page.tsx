import { getAllCustomers } from '@/lib/customers';
import CustomersClient from './CustomersClient';
import { Customer } from '@/types/customer';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  let customers: Customer[] = [];
  try {
    customers = await getAllCustomers();
  } catch {
    // fail silently — client shows empty state
  }
  return <CustomersClient initialCustomers={customers} />;
}
