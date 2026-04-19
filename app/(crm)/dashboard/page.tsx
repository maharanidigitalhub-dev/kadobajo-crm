import { getAllCustomers, getRecentCustomers } from '@/lib/customers';
import { Customer, CustomerStatus } from '@/types/customer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STATUS_ORDER: CustomerStatus[] = ['new', 'contacted', 'negotiation', 'deal', 'lost'];
const STATUS_LABELS: Record<CustomerStatus, string> = { new: 'New', contacted: 'Contacted', negotiation: 'Negotiation', deal: 'Deal', lost: 'Lost' };
const STATUS_COLORS: Record<CustomerStatus, { bar: string; badge: string; text: string }> = {
  new:         { bar: '#9CA3AF', badge: '#F3F4F6', text: '#374151' },
  contacted:   { bar: '#3B82F6', badge: '#EFF6FF', text: '#1D4ED8' },
  negotiation: { bar: '#F59E0B', badge: '#FFFBEB', text: '#B45309' },
  deal:        { bar: '#10B981', badge: '#ECFDF5', text: '#065F46' },
  lost:        { bar: '#EF4444', badge: '#FEF2F2', text: '#991B1B' },
};

function countByStatus(customers: Customer[]) {
  return STATUS_ORDER.reduce((acc, s) => { acc[s] = customers.filter((c) => c.status === s).length; return acc; }, {} as Record<CustomerStatus, number>);
}

export default async function DashboardPage() {
  const [all, recent] = await Promise.all([getAllCustomers(), getRecentCustomers(5)]);
  const counts = countByStatus(all);
  const revenue = all.reduce((sum, c) => sum + (c.value ?? 0), 0);

  const stats = [
    { label: 'Total Leads', value: all.length, icon: '👥', color: '#2D3F8F', bg: '#F0F3FD' },
    { label: 'Deals Closed', value: counts.deal, icon: '🤝', color: '#065F46', bg: '#ECFDF5' },
    { label: 'Lost', value: counts.lost, icon: '❌', color: '#991B1B', bg: '#FEF2F2' },
    { label: 'Est. Revenue', value: revenue > 0 ? `Rp ${(revenue / 1000).toFixed(0)}k` : 'Rp —', icon: '💰', color: '#1D4ED8', bg: '#EFF6FF' },
  ];

  return (
    <div className="p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500;600&display=swap'); .serif{font-family:'Playfair Display',serif;}`}</style>

      <div className="mb-8">
        <h1 className="serif text-2xl font-semibold" style={{ color: '#111827' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Selamat datang di Kado Bajo CRM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 transition-shadow hover:shadow-md"
            style={{ background: '#fff', border: '1.5px solid #E8ECF8', boxShadow: '0 1px 4px rgba(45,63,143,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg" style={{ background: s.bg }}>{s.icon}</div>
            <p className="text-2xl font-bold" style={{ color: '#111827' }}>{s.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: '#6B7280' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pipeline */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E8ECF8' }}>
          <h2 className="font-semibold text-base mb-4" style={{ color: '#111827' }}>Pipeline Summary</h2>
          <div className="space-y-3">
            {STATUS_ORDER.map((s) => {
              const pct = all.length > 0 ? (counts[s] / all.length) * 100 : 0;
              const c = STATUS_COLORS[s];
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium" style={{ color: '#374151' }}>{STATUS_LABELS[s]}</span>
                    <span style={{ color: '#9CA3AF' }}>{counts[s]}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.bar }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E8ECF8' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-base" style={{ color: '#111827' }}>Recent Customers</h2>
            <Link href="/customers" className="text-xs font-medium" style={{ color: '#2D3F8F' }}>View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#9CA3AF' }}>No customers yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((c) => {
                const col = STATUS_COLORS[c.status];
                return (
                  <div key={c.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#111827' }}>{c.name}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{c.phone}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: col.badge, color: col.text }}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
