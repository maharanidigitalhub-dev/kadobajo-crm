import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const headers: Record<string, string> = {};
  req.headers.forEach((val, key) => { headers[key] = val; });

  return NextResponse.json({
    url: req.url,
    hostname: req.nextUrl.hostname,
    host_header: req.headers.get('host'),
    x_forwarded_host: req.headers.get('x-forwarded-host'),
    x_forwarded_for: req.headers.get('x-forwarded-for'),
    all_headers: headers,
  }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
