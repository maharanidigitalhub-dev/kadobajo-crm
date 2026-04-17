export type CustomerStatus = 'new' | 'contacted' | 'negotiation' | 'deal' | 'lost';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  source: string;
  tag: string | null;
  notes: string | null;
  value: number | null;
  created_at: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}
