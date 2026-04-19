import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

function detectDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|tablet/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, country, flight_date, notes: userNotes, utm_source, utm_medium, utm_campaign, utm_content } = body;

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 9) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Detect device from User-Agent
    const ua = req.headers.get('user-agent') ?? '';
    const device = detectDevice(ua);

    // Determine source: prefer UTM source, fallback to landing_page
    const source = utm_source ? `${utm_source}` : 'landing_page';

    // Check for duplicate phone
    const { data: existing } = await supabase
      .from('customers')
      .select('id', { eq: ['phone', phoneClean] });

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: true, message: 'Already registered', duplicate: true },
        { status: 200 }
      );
    }

    const { data, error } = await supabase.from('customers').insert({
      name: name.trim(),
      email: email?.trim() ?? '',
      phone: phoneClean,
      country: country?.trim() ?? null,
      city: null,
      status: 'new',
      source,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
      utm_content: utm_content ?? null,
      device,
      tag: null,
      notes: userNotes ? `Flight: ${flight_date || "TBD"} | ${userNotes}` : (flight_date ? `Flight: ${flight_date}` : null),
      value: null,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
