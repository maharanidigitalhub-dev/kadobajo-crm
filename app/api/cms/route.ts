import { NextResponse } from 'next/server';

type HomeContent = {
  title: string;
  description: string;
  updatedAt: string;
};

type CmsRepository = {
  getHomepage: () => HomeContent;
  saveHomepage: (input: Pick<HomeContent, 'title' | 'description'>) => HomeContent;
};

const memoryStore: { homepage: HomeContent } = {
  homepage: {
    title: 'Welcome to Kado Bajo',
    description: 'Your one-stop destination for authentic gifts from Labuan Bajo.',
    updatedAt: new Date().toISOString(),
  },
};

const cmsRepository: CmsRepository = {
  getHomepage() {
    return memoryStore.homepage;
  },
  saveHomepage(input) {
    memoryStore.homepage = {
      ...memoryStore.homepage,
      title: input.title,
      description: input.description,
      updatedAt: new Date().toISOString(),
    };

    return memoryStore.homepage;
  },
};

export async function GET() {
  return NextResponse.json({ data: cmsRepository.getHomepage() }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Pick<HomeContent, 'title' | 'description'>>;

    const title = body.title?.trim() ?? '';
    const description = body.description?.trim() ?? '';

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required.' },
        { status: 400 }
      );
    }

    const saved = cmsRepository.saveHomepage({ title, description });
    return NextResponse.json({ data: saved }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }
}
