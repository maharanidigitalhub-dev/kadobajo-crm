import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

type CmsData = {
  [key: string]: unknown;
};

const cmsFilePath = path.join(process.cwd(), 'data', 'cms.json');

async function readCmsFile(): Promise<CmsData> {
  const raw = await fs.readFile(cmsFilePath, 'utf-8');
  return JSON.parse(raw) as CmsData;
}

async function writeCmsFile(data: CmsData): Promise<void> {
  await fs.writeFile(cmsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Query parameter "key" is required.' }, { status: 400 });
    }

    const cms = await readCmsFile();

    if (!(key in cms)) {
      return NextResponse.json({ error: `Key "${key}" not found.` }, { status: 404 });
    }

    return NextResponse.json({ key, data: cms[key] }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to load CMS data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: string; data?: unknown };
    const key = body.key?.trim();

    if (!key) {
      return NextResponse.json({ error: 'Field "key" is required.' }, { status: 400 });
    }

    if (typeof body.data === 'undefined') {
      return NextResponse.json({ error: 'Field "data" is required.' }, { status: 400 });
    }

    const cms = await readCmsFile();
    cms[key] = body.data;

    await writeCmsFile(cms);

    return NextResponse.json({ success: true, key, data: cms[key] }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to save CMS data.' }, { status: 500 });
  }
}
