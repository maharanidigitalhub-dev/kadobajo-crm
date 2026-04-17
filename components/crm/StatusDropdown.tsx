'use client';

import { useState } from 'react';
import { CustomerStatus } from '@/types/customer';

const STATUSES: { value: CustomerStatus; label: string; bg: string; text: string; dot: string }[] = [
  { value: 'new', label: 'New', bg: 'bg-stone-100', text: 'text-stone-700', dot: 'bg-stone-400' },
  { value: 'contacted', label: 'Contacted', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  { value: 'negotiation', label: 'Negotiation', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  { value: 'deal', label: 'Deal', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { value: 'lost', label: 'Lost', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
];

interface StatusDropdownProps {
  customerId: string;
  currentStatus: CustomerStatus;
  onUpdate?: (newStatus: CustomerStatus) => void;
}

export default function StatusDropdown({ customerId, currentStatus, onUpdate }: StatusDropdownProps) {
  const [status, setStatus] = useState<CustomerStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const current = STATUSES.find((s) => s.value === status) ?? STATUSES[0];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as CustomerStatus;
    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        onUpdate?.(newStatus);
      }
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <span className={`absolute left-2 w-2 h-2 rounded-full ${current.dot} pointer-events-none z-10`} />
      <select
        value={status}
        onChange={handleChange}
        disabled={loading}
        className={`pl-6 pr-3 py-1 text-xs font-medium rounded-full border appearance-none cursor-pointer transition-all
          ${current.bg} ${current.text} border-current/20
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current/30
          disabled:opacity-60 disabled:cursor-wait`}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {loading && (
        <span className="ml-2 w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
      )}
    </div>
  );
}
