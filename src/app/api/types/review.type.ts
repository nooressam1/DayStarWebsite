export interface Review {
  id: string;
  user_id?: string;
  product_id?: string;
  username: string;
  rating: number;
  comment?: string | null;
  created_at?: string;
  date: number | string;
  title: string;
  body: string;
  timestamp: string | number; // for sorting
  profile?: {
    username: string;
  };
}
