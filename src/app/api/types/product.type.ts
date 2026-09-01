import { Variant } from "./variant.type";

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  images: string[];
  slug: string;
  price: number;
  created_at: string;
  is_active: boolean;
  on_sale?: boolean;
  discount_percentage?: number | null;
  rating?: number;
  reviews_count?: number;
  step_type?: string;
  variants?: Variant[];
}
