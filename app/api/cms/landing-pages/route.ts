import { NextResponse } from 'next/server';
import { getLandingPages } from '@/lib/landing-pages';

export async function GET() {
  try {
    const pages = await getLandingPages();
    return NextResponse.json({ data: pages });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load landing pages' },
      { status: 500 }
    );
  }
}
