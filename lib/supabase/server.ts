const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVER_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

async function supabaseRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<SupabaseResponse<T>> {
  if (!SUPABASE_URL || !SUPABASE_SERVER_KEY) {
    return { data: null, error: { message: 'Supabase env vars not configured' } };
  }

  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const headers: Record<string, string> = {
    apikey: SUPABASE_SERVER_KEY,
    Authorization: `Bearer ${SUPABASE_SERVER_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...(options.headers as Record<string, string>),
  };

  try {
    const res = await fetch(url, { ...options, headers, cache: 'no-store' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      return { data: null, error: { message: err.message || res.statusText, code: err.code } };
    }
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    return { data, error: null };
  } catch (e: unknown) {
    return { data: null, error: { message: e instanceof Error ? e.message : 'Unknown error' } };
  }
}

export const supabase = {
  from: (table: string) => ({
    select: (columns = '*', opts: { order?: string; limit?: number; eq?: [string, string] } = {}) => {
      const params = new URLSearchParams({ select: columns });
      if (opts.order) params.set('order', opts.order);
      if (opts.limit) params.set('limit', String(opts.limit));
      if (opts.eq) params.set(opts.eq[0], `eq.${opts.eq[1]}`);
      return supabaseRequest<unknown[]>(`/${table}?${params.toString()}`);
    },

    insert: (body: Record<string, unknown>) =>
      supabaseRequest<unknown[]>(`/${table}`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: (body: Record<string, unknown>, match: Record<string, string>) => {
      const query = Object.entries(match)
        .map(([k, v]) => `${encodeURIComponent(k)}=eq.${encodeURIComponent(v)}`)
        .join('&');
      return supabaseRequest<unknown[]>(`/${table}?${query}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    },

    upsert: (body: Record<string, unknown>, onConflict: string) =>
      supabaseRequest<unknown[]>(`/${table}`, {
        method: 'POST',
        headers: {
          Prefer: `return=representation,resolution=ignore-duplicates,on_conflict=${onConflict}`,
        },
        body: JSON.stringify(body),
      }),
  }),
};
