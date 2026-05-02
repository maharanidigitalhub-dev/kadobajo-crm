import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };

async function requireAuth() {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;
  return ['admin', 'manager'].includes(role ?? '');
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, '_').replace(/\s+/g, '_'));

  return lines.slice(1).map(line => {
    // Handle quoted fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuotes = !inQuotes; continue; }
      if (line[i] === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += line[i];
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  }).filter(row => Object.values(row).some(v => v));
}

// Map CSV column names to DB column names
const FIELD_MAP: Record<string, string> = {
  'name': 'name', 'full_name': 'name', 'nama': 'name',
  'email': 'email',
  'phone': 'phone', 'whatsapp': 'phone', 'wa': 'phone', 'nomor_wa': 'phone', 'phone_number': 'phone',
  'country': 'country', 'negara': 'country',
  'city': 'city', 'kota': 'city',
  'source': 'source', 'sumber': 'source',
  'status': 'status',
  'notes': 'notes', 'catatan': 'notes',
  'utm_source': 'utm_source',
  'utm_medium': 'utm_medium',
  'utm_campaign': 'utm_campaign',
};

export async function POST(req: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  if (!file.name.endsWith('.csv')) return NextResponse.json({ error: 'Only CSV files accepted' }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'File too large. Max 2MB' }, { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);
  if (!rows.length) return NextResponse.json({ error: 'CSV is empty or invalid' }, { status: 400 });

  const results = { inserted: 0, skipped: 0, errors: [] as string[] };

  // Process in batches of 50
  const BATCH = 50;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const records = batch.map(row => {
      const record: Record<string, string> = { status: 'new', source: 'csv_import' };
      Object.entries(row).forEach(([key, val]) => {
        const dbField = FIELD_MAP[key];
        if (dbField && val) record[dbField] = val;
      });
      return record;
    }).filter(r => r.name && r.phone);

    if (!records.length) { results.skipped += batch.length; continue; }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
      method: 'POST',
      headers: { ...H, Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify(records),
    });

    if (res.ok) {
      const inserted = await res.json();
      results.inserted += Array.isArray(inserted) ? inserted.length : records.length;
      results.skipped += records.length - (Array.isArray(inserted) ? inserted.length : 0);
    } else {
      const err = await res.text();
      results.errors.push(`Batch ${i/BATCH + 1}: ${err.slice(0, 100)}`);
      results.skipped += records.length;
    }
  }

  return NextResponse.json({
    success: true,
    total: rows.length,
    ...results,
    message: `${results.inserted} berhasil diimport, ${results.skipped} dilewati`
  });
}
