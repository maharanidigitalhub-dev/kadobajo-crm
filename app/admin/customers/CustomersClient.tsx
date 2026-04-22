'use client';

import { useState, useMemo } from 'react';
import { Customer, CustomerStatus } from '@/types/customer';
import StatusDropdown from '@/components/crm/StatusDropdown';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'deal', label: 'Deal' },
  { value: 'lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'lp', label: 'lp' },
  { value: 'lp-2', label: 'lp-2' },
  { value: 'lp-3', label: 'lp-3' },
  { value: 'lp-4', label: 'lp-4' },
  { value: 'lp-5', label: 'lp-5' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'landing_page', label: 'Direct / Organic' },
];

// Meta Custom Audience format
// https://www.facebook.com/business/help/2082575038703844
function exportMetaAudience(customers: Customer[]) {
  const header = 'email,phone,fn,country\n';
  const rows = customers
    .filter((c) => c.email || c.phone)
    .map((c) => {
      const email = c.email?.toLowerCase().trim() ?? '';
      // Meta requires E.164 format: +628xxx
      const phone = c.phone ? `+${c.phone.replace(/\D/g, '')}` : '';
      const fn = c.name.split(' ')[0].toLowerCase();
      const country = c.country?.toLowerCase() ?? '';
      return `"${email}","${phone}","${fn}","${country}"`;
    })
    .join('\n');
  downloadCSV(header + rows, `meta-audience-${date()}.csv`);
}

// Lookalike / retargeting: all data for segmentation
function exportFullCSV(customers: Customer[]) {
  const header = 'Name,Email,Phone,Country,Device,Status,Source,UTM_Source,UTM_Medium,UTM_Campaign,UTM_Content,Date\n';
  const rows = customers
    .map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"+${c.phone}"`,
      `"${c.country ?? ''}"`,
      `"${c.device ?? ''}"`,
      `"${c.status}"`,
      `"${c.source}"`,
      `"${c.utm_source ?? ''}"`,
      `"${c.utm_medium ?? ''}"`,
      `"${c.utm_campaign ?? ''}"`,
      `"${c.utm_content ?? ''}"`,
      `"${c.created_at.split('T')[0]}"`,
    ].join(','))
    .join('\n');
  downloadCSV(header + rows, `kadobajo-leads-${date()}.csv`);
}

// Per-country segment export for Lookalike Audience
function exportByCountry(customers: Customer[], country: string) {
  const filtered = customers.filter((c) => c.country === country);
  const header = 'email,phone,fn,country\n';
  const rows = filtered.map((c) => {
    const email = c.email?.toLowerCase().trim() ?? '';
    const phone = c.phone ? `+${c.phone.replace(/\D/g, '')}` : '';
    const fn = c.name.split(' ')[0].toLowerCase();
    return `"${email}","${phone}","${fn}","${country.toLowerCase()}"`;
  }).join('\n');
  downloadCSV(header + rows, `meta-lookalike-${country.toLowerCase()}-${date()}.csv`);
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function date() { return new Date().toISOString().split('T')[0]; }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [search, setSearch] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Unique countries from data
  const countries = useMemo(() => {
    const set = new Set(customers.map((c) => c.country).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchStatus = !filterStatus || c.status === filterStatus;
      const matchCountry = !filterCountry || c.country === filterCountry;
      const matchSource = !filterSource || c.source_slug === filterSource || c.utm_source === filterSource || c.source === filterSource;
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
      return matchStatus && matchCountry && matchSource && matchSearch;
    });
  }, [customers, filterStatus, filterSource, filterCountry, search]);

  function handleStatusUpdate(id: string, newStatus: CustomerStatus) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  }

  // Stats
  const statsByCountry = useMemo(() => {
    const map: Record<string, number> = {};
    customers.forEach((c) => { if (c.country) map[c.country] = (map[c.country] ?? 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [customers]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>Customers</h1>
          <p className="text-[#8B7355] text-sm mt-0.5">{customers.length} total leads · {filtered.length} shown</p>
        </div>

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2C1810] text-white text-sm font-medium rounded-xl hover:bg-[#1A0E08] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export ▾
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-[#E8DFD0] rounded-2xl shadow-xl z-20 overflow-hidden">
              <div className="px-4 py-2 bg-[#F5F3EF] border-b border-[#E8DFD0]">
                <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Export Format</p>
              </div>

              <button onClick={() => { exportMetaAudience(filtered); setShowExportMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#FDF8F0] transition-colors border-b border-[#F5F3EF]">
                <p className="text-sm font-medium text-[#2C1810]">📘 Meta Custom Audience</p>
                <p className="text-xs text-[#8B7355] mt-0.5">email, phone, name, country — upload to Meta Ads Manager</p>
              </button>

              <button onClick={() => { exportFullCSV(filtered); setShowExportMenu(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#FDF8F0] transition-colors border-b border-[#F5F3EF]">
                <p className="text-sm font-medium text-[#2C1810]">📊 Full Data Export</p>
                <p className="text-xs text-[#8B7355] mt-0.5">All fields incl. UTM, device, country — for analysis</p>
              </button>

              {countries.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-[#F5F3EF] border-b border-[#E8DFD0]">
                    <p className="text-xs font-semibold text-[#8B7355] uppercase tracking-wider">Lookalike by Country</p>
                  </div>
                  {countries.map((country) => (
                    <button key={country} onClick={() => { exportByCountry(customers, country); setShowExportMenu(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#FDF8F0] transition-colors border-b border-[#F5F3EF] last:border-0 flex justify-between items-center">
                      <span className="text-sm text-[#2C1810]">🌍 {country}</span>
                      <span className="text-xs text-[#A89080]">{customers.filter(c => c.country === country).length} leads</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Country breakdown mini-stats */}
      {statsByCountry.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {statsByCountry.map(([country, count]) => (
            <button key={country} onClick={() => setFilterCountry(filterCountry === country ? '' : country)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filterCountry === country ? 'bg-[#2C1810] text-white border-[#2C1810]' : 'bg-white text-[#4A2C1A] border-[#E8DFD0] hover:border-[#C4A35A]'}`}>
              🌍 {country} · {count}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Search name, phone, email…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-[#E8DFD0] rounded-xl text-sm text-[#2C1810] placeholder-[#C4A8A0] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all" />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#E8DFD0] rounded-xl text-sm text-[#4A2C1A] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all appearance-none cursor-pointer">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#E8DFD0] rounded-xl text-sm text-[#4A2C1A] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/30 focus:border-[#C4A35A] transition-all appearance-none cursor-pointer">
          {SOURCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {(filterStatus || filterSource || filterCountry || search) && (
          <button onClick={() => { setFilterStatus(''); setFilterSource(''); setFilterCountry(''); setSearch(''); }}
            className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm hover:bg-red-100 transition-colors">
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F3EF] border-b border-[#E8DFD0]">
                {['Name', 'Phone', 'Email', 'Source Slug', 'Audience', 'Country', 'Device', 'Source / UTM', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-[#8B7355] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-[#A89080] text-sm">
                    {search || filterStatus || filterCountry || filterSource ? 'No results found.' : 'No customers yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-[#F5F3EF] hover:bg-[#FDFCF9] transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-[#2C1810]">{c.name}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#4A2C1A] font-mono">+{c.phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#6B4C3B] truncate max-w-[150px]">{c.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium text-[#4A2C1A]">{c.source_slug ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-[#6B4C3B]">{c.audience_segment ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium text-[#4A2C1A]">{c.country ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.device === 'mobile' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-600'}`}>
                        {c.device ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-[#4A2C1A]">{c.utm_source ?? c.source}</p>
                      {c.utm_campaign && <p className="text-xs text-[#A89080] truncate max-w-[120px]">{c.utm_campaign}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusDropdown customerId={c.id} currentStatus={c.status} onUpdate={(s) => handleStatusUpdate(c.id, s)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-[#A89080] whitespace-nowrap">{formatDate(c.created_at)}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-[#F5F3EF] flex justify-between items-center">
            <p className="text-xs text-[#A89080]">Showing {filtered.length} of {customers.length} leads</p>
            <p className="text-xs text-[#C4A35A] font-medium cursor-pointer" onClick={() => setShowExportMenu(true)}>
              Export {filtered.length} records →
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
