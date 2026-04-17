import { getAllCustomers, getRecentCustomers, getStatusColor } from '@/lib/customers';
import { Customer, CustomerStatus } from '@/types/customer';
import Link from 'next/link';

const STATUS_ORDER: CustomerStatus[] = ['new', 'contacted', 'negotiation', 'deal', 'lost'];
const STATUS_LABELS: Record<CustomerStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  negotiation: 'Negotiation',
  deal: 'Deal',
  lost: 'Lost',
};

function countByStatus(customers: Customer[]) {
  return STATUS_ORDER.reduce((acc, s) => {
    acc[s] = customers.filter((c) => c.status === s).length;
    return acc;
  }, {} as Record<CustomerStatus, number>);
}

export default async function DashboardPage() {
  const [all, recent] = await Promise.all([getAllCustomers(), getRecentCustomers(5)]);
  const counts = countByStatus(all);
  const revenue = all.reduce((sum, c) => sum + (c.value ?? 0), 0);

  const stats = [
    {
      label: 'Total Customers',
      value: all.length,
      icon: '👥',
      color: 'from-[#C4A35A] to-[#8B6914]',
      textColor: 'text-[#8B6914]',
      bg: 'bg-amber-50',
    },
    {
      label: 'Deals Closed',
      value: counts.deal,
      icon: '🤝',
      color: 'from-emerald-500 to-emerald-700',
      textColor: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Lost',
      value: counts.lost,
      icon: '❌',
      color: 'from-red-400 to-red-600',
      textColor: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Est. Revenue',
      value: revenue > 0 ? `Rp ${(revenue / 1000).toFixed(0)}k` : 'Rp —',
      icon: '💰',
      color: 'from-blue-500 to-blue-700',
      textColor: 'text-blue-700',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="serif text-2xl font-semibold text-[#2C1810]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>
        <p className="text-[#8B7355] text-sm mt-1">Selamat datang di Kado Bajo CRM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E8DFD0] shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3 text-lg`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-[#2C1810]">{s.value}</p>
            <p className="text-xs text-[#8B7355] mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pipeline Summary */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm p-6">
          <h2 className="font-semibold text-[#2C1810] text-base mb-4">Pipeline Summary</h2>
          <div className="space-y-3">
            {STATUS_ORDER.map((s) => {
              const pct = all.length > 0 ? (counts[s] / all.length) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4A2C1A] font-medium">{STATUS_LABELS[s]}</span>
                    <span className="text-[#8B7355]">{counts[s]}</span>
                  </div>
                  <div className="h-2 bg-[#F5F3EF] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s === 'new' ? 'bg-stone-400' :
                        s === 'contacted' ? 'bg-blue-500' :
                        s === 'negotiation' ? 'bg-amber-500' :
                        s === 'deal' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-[#2C1810] text-base">Recent Customers</h2>
            <Link href="/customers" className="text-xs text-[#C4A35A] hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-[#A89080] text-center py-8">No customers yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#F5F3EF] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#2C1810]">{c.name}</p>
                    <p className="text-xs text-[#A89080]">{c.phone}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusColor(c.status)}`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
