import { getAllCustomers } from '@/lib/customers';
import CustomersClient from './CustomersClient';

export default async function CustomersPage() {
  const customers = await getAllCustomers();
  return <CustomersClient initialCustomers={customers} />;
}
