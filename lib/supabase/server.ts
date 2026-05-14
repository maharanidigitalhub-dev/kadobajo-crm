const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  ''
).replace(/\/$/, '');

const SUPABASE_KEYS = [
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  process.env.SUPABASE_ANON_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
].filter((v): v is string => Boolean(v?.trim()));

interface SupabaseError {
  message: string;
  code?: string;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
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
    const data = text ? (JSON.parse(text) as T) : null;
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
  let lastError: SupabaseError | null = null;
  for (const key of SUPABASE_KEYS) {
    const response = await requestWithKey<T>(path, key, options);
    if (!response.error) return response;
    lastError = response.error;
    if (
      response.error.code &&
      !['PGRST301', '401', '403'].includes(response.error.code)
    ) break;
    if (
      !/(unauthorized|jwt|invalid api key|permission denied|forbidden)/i.test(
        response.error.message
      )
    ) break;
  }
  return { data: null, error: lastError ?? { message: 'Unknown Supabase error' } };
}

// Simple query builder — supports: select, insert, update, upsert, delete
// Each method returns a Promise<SupabaseResponse<T>> directly (no chaining needed).
// For filtered queries, pass filter params in the path manually or use the
// raw supabaseRequest() function exported below.
export const supabase = {
  from: (table: string) => ({
    select: (columns = '*') =>
      supabaseRequest<unknown[]>(
        `/${table}?select=${encodeURIComponent(columns)}`
      ),

    selectWhere: (
      columns = '*',
      filters: Record<string, string> = {},
      opts: { order?: string; limit?: number } = {}
    ) => {
      const params = new URLSearchParams({ select: columns });
      Object.entries(filters).forEach(([k, v]) => params.set(k, `eq.${v}`));
      if (opts.order) params.set('order', opts.order);
      if (opts.limit) params.set('limit', String(opts.limit));
      return supabaseRequest<unknown[]>(`/${table}?${params.toString()}`);
    },

    insert: (body: Record<string, unknown> | Record<string, unknown>[]) =>
      supabaseRequest<unknown[]>(`/${table}`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    update: (
      body: Record<string, unknown>,
      match: Record<string, string>
    ) => {
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
          Prefer: `return=representation,resolution=merge-duplicates,on_conflict=${onConflict}`,
        } as Record<string, string>,
        body: JSON.stringify(body),
      }),

    delete: (match: Record<string, string>) => {
      const query = Object.entries(match)
        .map(([k, v]) => `${encodeURIComponent(k)}=eq.${encodeURIComponent(v)}`)
        .join('&');
      return supabaseRequest<unknown[]>(`/${table}?${query}`, {
        method: 'DELETE',
      });
    },
  }),
};
