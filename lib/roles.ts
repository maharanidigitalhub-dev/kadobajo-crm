export type Role = 'admin' | 'manager' | 'sales' | 'viewer';

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
  admin:   { label: 'Admin',   color: '#7C3AED', bg: '#F5F3FF', icon: '👑', desc: 'Full access — manage users, edit CMS, export data' },
  manager: { label: 'Manager', color: '#2D3F8F', bg: '#EEF2FF', icon: '🎯', desc: 'View dashboard, manage customers, cannot manage users or CMS' },
  sales:   { label: 'Sales',   color: '#0369A1', bg: '#E0F2FE', icon: '💼', desc: 'View and update customer status only' },
  viewer:  { label: 'Viewer',  color: '#6B7280', bg: '#F3F4F6', icon: '👁️', desc: 'Read-only access to dashboard and customers' },
};

export const PERMISSIONS = {
  // Dashboard
  viewDashboard:  ['admin', 'manager', 'sales', 'viewer'],
  // Customers
  viewCustomers:  ['admin', 'manager', 'sales', 'viewer'],
  editCustomers:  ['admin', 'manager', 'sales'],
  exportCustomers:['admin', 'manager'],
  deleteCustomers:['admin'],
  // CMS
  viewCMS:        ['admin'],
  editCMS:        ['admin'],
  // Users
  viewUsers:      ['admin'],
  manageUsers:    ['admin'],
} as const;

export function can(role: Role, permission: keyof typeof PERMISSIONS): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
