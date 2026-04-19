import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

type CmsData = {
  [key: string]: unknown;
};

const cmsFilePath = path.join(process.cwd(), 'data', 'cms.json');
const uploadDirPath = path.join(process.cwd(), 'public', 'uploads', 'cms');

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
    const formData = await request.formData();
    const key = String(formData.get('key') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const subtitle = String(formData.get('subtitle') ?? '').trim();
    const currentImage = String(formData.get('currentImage') ?? '').trim();
    const imageFile = formData.get('image');

    if (!key) {
      return NextResponse.json({ error: 'Field "key" is required.' }, { status: 400 });
    }

    if (!title || !subtitle) {
      return NextResponse.json({ error: 'Field "title" and "subtitle" are required.' }, { status: 400 });
    }

    let imagePath = currentImage;

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Uploaded file must be an image.' }, { status: 400 });
      }

      await fs.mkdir(uploadDirPath, { recursive: true });

      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
      const fileName = `${Date.now()}-${safeName}`;
      const targetPath = path.join(uploadDirPath, fileName);
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

      await fs.writeFile(targetPath, fileBuffer);
      imagePath = `/uploads/cms/${fileName}`;
    }

    if (!imagePath) {
      return NextResponse.json({ error: 'Image is required.' }, { status: 400 });
    }

    const cms = await readCmsFile();
    cms[key] = {
      hero: {
        title,
        subtitle,
        image: imagePath,
      },
    };

    await writeCmsFile(cms);

    return NextResponse.json({ success: true, key, data: cms[key] }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to save CMS data.' }, { status: 500 });
  }
}
