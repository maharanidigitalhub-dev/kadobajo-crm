export type Role = 'superadmin' | 'manager' | 'admin' | 'management' | 'viewer';

export interface CRMUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  created_at: string;
}

export const ROLE_META: Record<Role, {
  label: string;
  color: string;
  bg: string;
  icon: string;
  desc: string;
}> = {
  superadmin: { label: 'Super Admin', color: '#7C3AED', bg: '#F5F3FF', icon: '👑', desc: 'Full access — no restrictions, manage semua fitur' },
  manager:    { label: 'Manager',     color: '#2D3F8F', bg: '#EEF2FF', icon: '🎯', desc: 'Semua akses + approve perubahan CMS/LP/status' },
  admin:      { label: 'Admin',       color: '#0369A1', bg: '#E0F2FE', icon: '💼', desc: 'Tambah customer, bulk import, edit CMS/LP (pending approval), ubah status (perlu foto chat)' },
  management: { label: 'Management',  color: '#6B7280', bg: '#F3F4F6', icon: '📊', desc: 'View only — dashboard, customers, landing page' },
  viewer:     { label: 'Viewer',      color: '#9CA3AF', bg: '#F9FAFB', icon: '👁',  desc: 'View only' },
};

export const PERMISSIONS = {
  viewDashboard:   ['superadmin', 'manager', 'admin', 'management', 'viewer'],
  viewCustomers:   ['superadmin', 'manager', 'admin', 'management', 'viewer'],
  editCustomers:   ['superadmin', 'manager', 'admin'],
  exportCustomers: ['superadmin', 'manager'],
  deleteCustomers: ['superadmin'],
  viewCMS:         ['superadmin', 'manager', 'admin'],
  editCMS:         ['superadmin', 'manager', 'admin'],
  viewUsers:       ['superadmin'],
  manageUsers:     ['superadmin'],
  viewApprovals:   ['superadmin', 'manager'],
  manageApprovals: ['superadmin', 'manager'],
  changeStatus:    ['superadmin', 'manager', 'admin'],
} as const;

export function can(role: Role, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

export function canChangeStatusDirect(role: Role): boolean {
  return role === 'superadmin' || role === 'manager';
}
