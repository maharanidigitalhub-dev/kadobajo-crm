const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';

const SUPABASE_KEYS = [
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  process.env.SUPABASE_ANON_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
].filter((v): v is string => Boolean(v && v.trim()));

interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

async function requestWithKey<T>(
  path: string,
  key: string,
  options: RequestInit = {}
): Promise<SupabaseResponse<T>> {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
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

async function supabaseRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<SupabaseResponse<T>> {
  if (!SUPABASE_URL || SUPABASE_KEYS.length === 0) {
    return { data: null, error: { message: 'Supabase env vars not configured' } };
  }

  let lastError: SupabaseResponse<T>['error'] = null;

  for (const key of SUPABASE_KEYS) {
    const response = await requestWithKey<T>(path, key, options);
    if (!response.error) {
      return response;
    }
    lastError = response.error;

    // Stop retrying on non-auth errors.
    if (response.error.code && !['PGRST301', '401', '403'].includes(response.error.code)) {
      break;
    }
    if (!/(unauthorized|jwt|invalid api key|permission denied|forbidden)/i.test(response.error.message)) {
      break;
    }
  }

  return { data: null, error: lastError ?? { message: 'Unknown Supabase error' } };
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
