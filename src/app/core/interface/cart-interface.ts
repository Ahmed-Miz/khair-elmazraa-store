export interface CartInterface {
  id: number;
  quantity: number;
  product_id: number;
  offer_id: number;
  products: Products;
  offers: Ofeers;
}

interface Products {
  id: number | string;
  price: number;
  title: string;
  image_url: string;
  tag: string;
}
interface Ofeers {
  id: number | string;
  price: number;
  title: string;
  image_url: string;
  saving_amount: string;
}
