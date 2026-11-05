import { Routes } from '@angular/router';
import { Home } from './features/components/home/home';
import { Shop } from './features/components/shop/shop';
import { SavingsOffers } from './features/components/savings-offers/savings-offers';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'shop', component: Shop },
  { path: 'savingsOffers', component: SavingsOffers },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: '**', component: Home },
];
