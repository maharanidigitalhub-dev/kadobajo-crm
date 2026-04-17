import { supabase } from './supabase/server';
import { Customer, CustomerStatus } from '../types/customer';

export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*', { order: 'created_at.desc' });

  if (error || !data) return [];
  return data as Customer[];
}

export async function getRecentCustomers(limit = 5): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*', { order: 'created_at.desc', limit });

  if (error || !data) return [];
  return data as Customer[];
}

export async function updateCustomerStatus(id: string, status: CustomerStatus) {
  return supabase.from('customers').update({ status }, { id });
}

export function getStatusColor(status: CustomerStatus): string {
  const colors: Record<CustomerStatus, string> = {
    new: 'bg-stone-100 text-stone-700 border-stone-200',
    contacted: 'bg-blue-50 text-blue-700 border-blue-200',
    negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
    deal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lost: 'bg-red-50 text-red-700 border-red-200',
  };
  return colors[status] ?? colors.new;
}

export function getStatusDot(status: CustomerStatus): string {
  const dots: Record<CustomerStatus, string> = {
    new: 'bg-stone-400',
    contacted: 'bg-blue-500',
    negotiation: 'bg-amber-500',
    deal: 'bg-emerald-500',
    lost: 'bg-red-500',
  };
  return dots[status] ?? dots.new;
}
