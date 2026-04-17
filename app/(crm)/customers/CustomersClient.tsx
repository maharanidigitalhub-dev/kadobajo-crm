'use client';

import { useState, useMemo } from 'react';
import { Customer, CustomerStatus } from '@/types/customer';
import StatusDropdown from '@/components/crm/StatusDropdown';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'deal', label: 'Deal' },
  { value: 'lost', label: 'Lost' },
];

function exportCSV(customers: Customer[]) {
  const header = 'Name,Email,Phone,Status\n';
  const rows = customers
    .map((c) => `"${c.name}","${c.email}","${c.phone}","${c.status}"`)
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kadobajo-customers-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchStatus = !filterStatus || c.status === filterStatus;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [customers, filterStatus, search]);

  function handleStatusUpdate(id: string, newStatus: CustomerStatus) {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Customers
          </h1>
          <p className="text-[#8B7355] text-sm mt-0.5">{customers.length} total leads</p>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2C1810] text-white text-sm font-medium rounded-xl hover:bg-[#1A0E08] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, phone, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white border border-[#E8DFD0] rounded-xl text-sm text-[#2C1810] placeholder-[#C4A8A0] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#E8DFD0] rounded-xl text-sm text-[#4A2C1A] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F3EF] border-b border-[#E8DFD0]">
                {['Name', 'Phone', 'Email', 'Source', 'Tag', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#8B7355] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[#A89080] text-sm">
                    {search || filterStatus ? 'No results found.' : 'No customers yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-[#F5F3EF] hover:bg-[#FDFCF9] transition-colors ${
                      i === filtered.length - 1 ? 'border-0' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#2C1810]">{c.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#4A2C1A] font-mono">{c.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-[#6B4C3B] truncate max-w-[180px]">{c.email || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-[#F5F3EF] text-[#8B7355] px-2 py-1 rounded-full">
                        {c.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-[#A89080]">{c.tag ?? '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusDropdown
                        customerId={c.id}
                        currentStatus={c.status}
                        onUpdate={(s) => handleStatusUpdate(c.id, s)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-[#A89080] whitespace-nowrap">{formatDate(c.created_at)}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-[#F5F3EF] text-xs text-[#A89080]">
            Showing {filtered.length} of {customers.length} customers
          </div>
        )}
      </div>
    </div>
  );
}
