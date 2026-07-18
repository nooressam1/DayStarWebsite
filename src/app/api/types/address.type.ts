export interface Address {
  id: string;
  user_id: string;
  street: string;
  building_no: string;
  city: string;
  country: string;
  label: string | null;
  is_default: boolean;
  created_at?: string;
}
