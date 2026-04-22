import Link from 'next/link';
import { getLandingPages } from '@/lib/landing-pages';

export const dynamic = 'force-dynamic';

export default async function CMSLandingListPage() {
  const pages = await getLandingPages();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">CMS / Landing Pages</h1>
          <p className="text-sm text-[#6B7280]">Manage audience-specific landing pages and conversion content.</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E8DFD0] bg-white">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-[#F5F3EF] text-left text-xs uppercase tracking-wider text-[#8B7355]">
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Audience</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.slug} className="border-t border-[#F5F3EF] text-sm">
                <td className="px-4 py-3 font-semibold text-[#2C1810]">/{page.slug}</td>
                <td className="px-4 py-3 text-[#4A2C1A]">{page.audience}</td>
                <td className="px-4 py-3 text-[#4A2C1A]">{page.title}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${page.status === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#8B7355]">{new Date(page.updated_at).toLocaleString('en-GB')}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/cms/${page.slug}`} className="rounded-lg bg-[#2D3F8F] px-3 py-1.5 text-xs font-semibold text-white">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
