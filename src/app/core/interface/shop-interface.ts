export interface ShopInterface {
  id: number;
  created_at: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  price: number;
  old_price: number;
  discount_amount: null;
  tag: string;
  offer_items: null;
  is_featured_home: boolean;
  is_best_seller: boolean;
  sales_count: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
