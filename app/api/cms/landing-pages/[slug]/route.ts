import { NextRequest, NextResponse } from 'next/server';
import { getLandingPageBySlug, upsertLandingPage, type LandingPageContent } from '@/lib/landing-pages';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const page = await getLandingPageBySlug(slug);
    if (!page) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ data: page });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load page' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as LandingPageContent;
    const saved = await upsertLandingPage(body);
    return NextResponse.json({ data: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save page' },
      { status: 500 }
    );
  }
}
