import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

function detectDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|tablet/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, country,
      flight_date, notes: userNotes,
      utm_source, utm_medium, utm_campaign, utm_content,
      source_slug, audience_segment, landing_url,
    } = body;

    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 9) return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });

    const ua = req.headers.get('user-agent') ?? '';
    const device = detectDevice(ua);
    const source = source_slug ?? utm_source ?? 'landing_page';

    const notesParts = [];
    if (flight_date) notesParts.push(`Flight: ${flight_date}`);
    if (userNotes?.trim()) notesParts.push(userNotes.trim());
    const notes = notesParts.length > 0 ? notesParts.join(' | ') : null;

    const { data: existing } = await supabase
      .from('customers')
      .select('id', { eq: ['phone', phoneClean] });

    if (existing && existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Already registered', duplicate: true }, { status: 200 });
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      email: email?.trim() ?? '',
      phone: phoneClean,
      status: 'new',
      source,
      device,
      source_slug: source_slug ?? 'lp',
      audience_segment: audience_segment ?? 'primary / premium / global',
      landing_url: landing_url ?? req.headers.get('referer') ?? '',
    };

    if (country) payload.country = country.trim();
    if (notes) payload.notes = notes;
    if (utm_source) payload.utm_source = utm_source;
    if (utm_medium) payload.utm_medium = utm_medium;
    if (utm_campaign) payload.utm_campaign = utm_campaign;
    if (utm_content) payload.utm_content = utm_content;

    const { data, error } = await supabase.from('customers').insert(payload);

    if (error) {
      return NextResponse.json({ error: 'Failed to save lead', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
