export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  company_id: number;
  company?: Company;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
}
