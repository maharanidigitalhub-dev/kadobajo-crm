import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, country, city,
      source, source_slug, audience_segment, landing_url,
      utm_source, utm_medium, utm_campaign, utm_content,
      flight_date, notes, device,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Hanya kirim kolom yang ADA di tabel
    const payload: Record<string, unknown> = {
      name,
      phone,
      status: 'new',
      source: source ?? source_slug ?? utm_source ?? 'landing_page',
      source_slug:      source_slug      ?? null,
      audience_segment: audience_segment ?? null,
      landing_url:      landing_url      ?? null,
    };

    if (email)   payload.email   = email;
    if (country) payload.country = country;
    if (city)    payload.city    = city;

    // Simpan UTM & device ke kolom notes karena belum ada kolomnya
    const extraNotes = [
      flight_date  ? `Flight: ${flight_date}`       : null,
      utm_source   ? `utm_source: ${utm_source}`     : null,
      utm_medium   ? `utm_medium: ${utm_medium}`     : null,
      utm_campaign ? `utm_campaign: ${utm_campaign}` : null,
      utm_content  ? `utm_content: ${utm_content}`   : null,
      device       ? `device: ${device}`             : null,
      notes        ? notes                           : null,
    ].filter(Boolean).join(' | ');

    if (extraNotes) payload.notes = extraNotes;

    const { data, error } = await supabase.from('customers').insert(payload);

    if (error) {
      console.error('[leads] Supabase error:', error);
      return NextResponse.json(
        { error: 'Gagal menyimpan data', detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: Array.isArray(data) ? data[0] : data,
    });

  } catch (err) {
    console.error('[leads] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}