import { Customer, CustomerStatus } from '@/types/customer';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

export async function getAllCustomers(): Promise<Customer[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.desc`,
    { headers: H, cache: 'no-store' }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getRecentCustomers(limit = 5): Promise<Customer[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/customers?select=*&order=created_at.desc&limit=${limit}`,
    { headers: H, cache: 'no-store' }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function updateCustomerStatus(id: string, status: CustomerStatus): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/customers?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify({ status }),
    cache: 'no-store',
  });
}

export function getStatusColor(status: CustomerStatus): string {
  const colors: Record<CustomerStatus, string> = {
    new:         '#6366F1',
    contacted:   '#0EA5E9',
    negotiation: '#F59E0B',
    deal:        '#10B981',
    lost:        '#EF4444',
  };
  return colors[status] ?? '#6B7280';
}
