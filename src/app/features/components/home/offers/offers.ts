import { Component, effect, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface OfferCard {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  image: string;
  linkQueryParams: any;
}

@Component({
  selector: 'app-offers',
  imports: [RouterLink],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers {
  offers = input<any[]>([]);

  constructor() {
    effect(() => {
      console.log('الداتا', this.offers());
    });
  }
}
