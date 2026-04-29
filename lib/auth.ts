import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

// Headers pakai service role key (bypass RLS)
const serviceHeaders = () => ({
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
});

// Get current logged-in user dari cookie session
export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;
    if (!userId) return null;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users?id=eq.${userId}&is_active=eq.true&select=id,email,name,role,is_active,created_at,last_login`,
      { headers: serviceHeaders(), cache: 'no-store' }
    );
    const data = await res.json();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

// Get user by email (untuk login)
export async function getUserByEmail(email: string): Promise<(AdminUser & { password_hash: string }) | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&is_active=eq.true&select=*`,
      { headers: serviceHeaders(), cache: 'no-store' }
    );
    const data = await res.json();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

// Update last_login
export async function updateLastLogin(userId: string) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/admin_users?id=eq.${userId}`,
    {
      method: 'PATCH',
      headers: serviceHeaders(),
      body: JSON.stringify({ last_login: new Date().toISOString() }),
    }
  );
}

// Get semua users (admin only)
export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users?select=id,email,name,role,is_active,created_at,last_login&order=created_at.asc`,
      { headers: serviceHeaders(), cache: 'no-store' }
    );
    return await res.json();
  } catch {
    return [];
  }
}

// Permission checks
export const PERMISSIONS = {
  canManageUsers: (role: UserRole) => role === 'admin',
  canEditCMS:     (role: UserRole) => role === 'admin' || role === 'editor',
  canEditCustomers: (role: UserRole) => role === 'admin' || role === 'editor',
  canExportCSV:   (role: UserRole) => role === 'admin' || role === 'editor',
  canViewDashboard: (role: UserRole) => true,
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: '👑 Admin',
  editor: '✏️ Editor',
  viewer: '👁️ Viewer',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: '#DC2626',
  editor: '#2D3F8F',
  viewer: '#6B7280',
};
