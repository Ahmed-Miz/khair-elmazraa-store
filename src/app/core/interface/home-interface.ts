export interface ProductInterface {
  id: number;
  tag: string;
  price: number;
  title: string;
  category: string;
  image_url: string;
  old_price: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string; // FontAwesome class
}
