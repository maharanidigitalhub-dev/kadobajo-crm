'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import type { LandingPageContent } from '@/lib/landing-pages';

export default function EditLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = use(params);
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const routeSlug = resolved.slug;
    setSlug(routeSlug);
    fetch(`/api/cms/landing-pages/${routeSlug}`)
      .then((res) => res.json())
      .then((json) => setContent(json.data.content));
  }, [resolved.slug]);

  if (!content) {
    return <div className="p-8">Loading...</div>;
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/cms/landing-pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/cms" className="text-sm text-[#2D3F8F]">← Back to Landing Pages</Link>
          <h1 className="text-2xl font-semibold text-[#111827] mt-2">Edit /{slug}</h1>
        </div>
        <button onClick={save} disabled={saving} className="rounded-lg bg-[#2D3F8F] px-4 py-2 text-white">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">General</h2>
        <input className="form-input" value={content.slug} onChange={(e) => setContent({ ...content, slug: e.target.value as LandingPageContent['slug'] })} />
        <input className="form-input" value={content.audience} onChange={(e) => setContent({ ...content, audience: e.target.value })} placeholder="Audience" />
        <input className="form-input" value={content.title} onChange={(e) => setContent({ ...content, title: e.target.value })} placeholder="Title" />
        <select className="form-input" value={content.status} onChange={(e) => setContent({ ...content, status: e.target.value as LandingPageContent['status'] })}>
          <option value="draft">draft</option>
          <option value="live">live</option>
        </select>
      </section>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">SEO</h2>
        <input className="form-input" value={content.seo.metaTitle} onChange={(e) => setContent({ ...content, seo: { ...content.seo, metaTitle: e.target.value } })} placeholder="Meta title" />
        <textarea className="form-input" value={content.seo.metaDescription} onChange={(e) => setContent({ ...content, seo: { ...content.seo, metaDescription: e.target.value } })} placeholder="Meta description" />
        <input className="form-input" value={content.seo.ogImage} onChange={(e) => setContent({ ...content, seo: { ...content.seo, ogImage: e.target.value } })} placeholder="OG image URL" />
      </section>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">Hero</h2>
        <input className="form-input" value={content.hero.headline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })} placeholder="Headline" />
        <textarea className="form-input" value={content.hero.subheadline} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })} placeholder="Subheadline" />
        <input className="form-input" value={content.hero.ctaText} onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })} placeholder="CTA text" />
        <input className="form-input" value={content.hero.ctaUrl} onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaUrl: e.target.value } })} placeholder="CTA URL" />
        <input className="form-input" value={content.hero.heroImage} onChange={(e) => setContent({ ...content, hero: { ...content.hero, heroImage: e.target.value } })} placeholder="Hero image" />
      </section>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">Repeatable Sections</h2>
        <textarea className="form-input min-h-40" value={JSON.stringify(content.benefits, null, 2)} onChange={(e) => setContent({ ...content, benefits: JSON.parse(e.target.value) })} />
        <textarea className="form-input min-h-40" value={JSON.stringify(content.testimonials, null, 2)} onChange={(e) => setContent({ ...content, testimonials: JSON.parse(e.target.value) })} />
        <textarea className="form-input min-h-40" value={JSON.stringify(content.faq, null, 2)} onChange={(e) => setContent({ ...content, faq: JSON.parse(e.target.value) })} />
      </section>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">Final CTA</h2>
        <input className="form-input" value={content.finalCta.title} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, title: e.target.value } })} />
        <textarea className="form-input" value={content.finalCta.description} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, description: e.target.value } })} />
        <input className="form-input" value={content.finalCta.ctaText} onChange={(e) => setContent({ ...content, finalCta: { ...content.finalCta, ctaText: e.target.value } })} />
      </section>
    </div>
  );
}
