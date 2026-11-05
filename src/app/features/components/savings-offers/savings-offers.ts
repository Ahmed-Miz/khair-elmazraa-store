import { Component, inject, OnInit, signal } from '@angular/core';
import { OffersService } from '../../../core/model/supabaseService/offers-service';
import { CartService } from '../../../core/model/supabaseService/cart-service';

@Component({
  selector: 'app-savings-offers',
  imports: [],
  templateUrl: './savings-offers.html',
  styleUrl: './savings-offers.css',
})
export class SavingsOffers implements OnInit {
  // بيانات الباقات والعروض الرئيسية
  private readonly offersService = inject(OffersService);
  private readonly cartService = inject(CartService);
  offers = signal<any[]>([]);

  ngOnInit(): void {
    this.getSavingsOffers();
  }
  getSavingsOffers(): void {
    this.offersService.getOffers().subscribe({
      next: (res) => {
        this.offers.set(res.data);
        console.log(this.offers());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToOffers(offerId: number) {
    this.cartService.addOffers(offerId).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.loadCartCount();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
