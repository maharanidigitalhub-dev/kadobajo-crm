import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const H = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

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
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      name,
      phone,
      status: 'new',
      source:           source ?? source_slug ?? utm_source ?? 'landing_page',
      source_slug:      source_slug ?? null,
      audience_segment: audience_segment ?? null,
      landing_url:      landing_url ?? null,
      device:           device ?? null,
    };

    if (email)        payload.email        = email;
    if (country)      payload.country      = country;
    if (city)         payload.city         = city;
    if (utm_source)   payload.utm_source   = utm_source;
    if (utm_medium)   payload.utm_medium   = utm_medium;
    if (utm_campaign) payload.utm_campaign = utm_campaign;
    if (utm_content)  payload.utm_content  = utm_content;
    if (flight_date)  payload.notes        = `Flight: ${flight_date}${notes ? '. ' + notes : ''}`;
    else if (notes)   payload.notes        = notes;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/customers`, {
      method: 'POST',
      headers: H,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[leads] Supabase error:', data);
      // Still return success — redirect to WhatsApp even if DB fails
      return NextResponse.json({ success: true, warning: 'DB save failed' });
    }

    return NextResponse.json({ success: true, customer: Array.isArray(data) ? data[0] : data });
  } catch (err) {
    console.error('[leads] Error:', err);
    return NextResponse.json({ success: true, warning: 'Server error' });
  }
}
