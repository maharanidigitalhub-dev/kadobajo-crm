export type CustomerStatus = 'new' | 'contacted' | 'negotiation' | 'deal' | 'lost';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  country?: string;
  city?: string;
  status: CustomerStatus;
  source?: string;
  source_slug?: string;        // lp, lp-2, lp-3, lp-4, lp-5
  audience_segment?: string;   // Universal, SEA, AUS/NZ, etc
  landing_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  device?: string;
  tag?: string;
  notes?: string;
  value?: number;
  avatar_url?: string;
  created_at?: string;
}
