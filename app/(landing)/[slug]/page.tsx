import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPageRenderer from '@/components/landing/LandingPageRenderer';
import { LANDING_SLUGS, type LandingSlug, getLandingPageBySlug } from '@/lib/landing-pages';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return LANDING_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page) {
    return {};
  }

  return {
    title: page.content.seo.metaTitle,
    description: page.content.seo.metaDescription,
    openGraph: {
      title: page.content.seo.metaTitle,
      description: page.content.seo.metaDescription,
      images: page.content.seo.ogImage ? [page.content.seo.ogImage] : undefined,
    },
  };
}

export default async function DynamicLandingPage({ params }: Props) {
  const { slug } = await params;
  if (!LANDING_SLUGS.includes(slug as LandingSlug)) {
    notFound();
  }

  const page = await getLandingPageBySlug(slug);
  if (!page) {
    notFound();
  }

  return <LandingPageRenderer content={page.content} />;
}
