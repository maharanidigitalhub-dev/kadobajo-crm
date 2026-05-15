// Sesudah
export type UserRole = 'superadmin' | 'admin' | 'manager' | 'management';

export type ApprovalType = 'cms' | 'lp' | 'customer';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  requested_by: string;
  reviewed_by?: string;
  payload: Record<string, unknown>;
  note?: string;
  created_at: string;
  reviewed_at?: string;
}

// BUGFIX: Customer interface duplikat dihapus — gunakan import dari @/types/customer
// (dua definisi berbeda menyebabkan TypeScript error & runtime mismatch)
export type { Customer } from '@/types/customer';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

// Helper: cek apakah role bisa bypass approval
export function canBypassApproval(role: UserRole): boolean {
  return role === 'superadmin';
}

// Helper: cek apakah role bisa kelola user
export function canManageUsers(role: UserRole): boolean {
  return role === 'superadmin';
}
