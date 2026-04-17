export type CustomerStatus = 'new' | 'contacted' | 'negotiation' | 'deal' | 'lost';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string | null;
  city: string | null;
  status: CustomerStatus;
  source: string;
  utm_source: string | null;   // e.g. facebook, google, tiktok
  utm_medium: string | null;   // e.g. cpc, paid_social
  utm_campaign: string | null; // e.g. honeymoon_eu, komodo_aus
  utm_content: string | null;  // ad creative ID
  device: string | null;       // mobile / desktop
  tag: string | null;
  notes: string | null;
  value: number | null;
  created_at: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  country?: string;
}
