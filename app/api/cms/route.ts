import { NextRequest, NextResponse } from 'next/server';
import { getLandingPageBySlug, upsertLandingPage } from '@/lib/landing-pages';

export async function GET() {
  try {
    const page = await getLandingPageBySlug('lp');
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(page.content, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await getLandingPageBySlug('lp');
    if (!current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await upsertLandingPage({
      ...current.content,
      ...body,
      slug: 'lp',
      audience: current.content.audience,
      status: current.content.status,
      title: current.content.title,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
