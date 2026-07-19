export interface Address {
  id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  label: string;
  street: string;
  building_no?: string | null;
  floor_number?: string | null;
  apartment_number?: string | null;
  area?: string | null;
  city: string;
  governorate?: string | null;
  postal_code?: string | null;
  country: string;
  is_default: boolean;
}
