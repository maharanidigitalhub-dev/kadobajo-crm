import LandingPageRenderer from '@/components/landing/LandingPageRenderer';
import { buildDefaultLandingContent, getLandingPageBySlug } from '@/lib/landing-pages';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const page = await getLandingPageBySlug('lp');
  return <LandingPageRenderer content={page?.content ?? buildDefaultLandingContent('lp')} />;
}
