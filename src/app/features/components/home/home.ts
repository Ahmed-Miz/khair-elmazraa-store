import { Component, inject, OnInit, signal } from '@angular/core';
import { HeroBanner } from './hero-banner/hero-banner';
import { CategoryBanner } from './category-banner/category-banner';
import { Offers } from './offers/offers';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/model/supabaseService/product-service';
import { Feature, ProductInterface } from '../../../core/interface/home-interface';
import { HomeService } from '../../../core/model/supabaseService/home-service';
import { CartService } from '../../../core/model/supabaseService/cart-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [HeroBanner, CategoryBanner, Offers, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  products = signal<ProductInterface[]>([]);
  offers = signal<any[]>([]);
  heroTitle = signal<string>('');
  heroSubtitle = signal<string>('');
  heroVideoUrl = signal<string>('');

  features = signal<Feature[]>([
    {
      id: '1',
      title: 'ضمان الجودة',
      description: 'استرجاع أو استبدال فوراً لو الطلب ما عجبكش.',
      icon: 'fa-solid fa-shield-halved',
    },
    {
      id: '2',
      title: 'تغليف حراري',
      description: 'حفظ برودة الشحنة لحد باب البيت.',
      icon: 'fa-solid fa-snowflake',
    },
    {
      id: '3',
      title: 'شفافية الوزن',
      description: 'الوزن الفعلي بيحدد على الميزان قبل التغليف.',
      icon: 'fa-solid fa-box-open',
    },
  ]);

  ngOnInit(): void {
    this.getHomeProduct();
  }

  getHomeProduct(): void {
    this.homeService.getHome().subscribe({
      next: (res) => {
        let homeProduct = res.data[0].featured_products;
        let homeOffers = res.data[0]?.offer_products || [];
        this.products.set(homeProduct);
        this.offers.set(homeOffers);
        this.heroTitle.set(res.data[0].hero_title);
        this.heroSubtitle.set(res.data[0].hero_subtitle);
        this.heroVideoUrl.set(res.data[0].hero_video_url);
        console.log(this.heroTitle(), this.heroSubtitle(), this.heroVideoUrl());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addCartHome(id: number, event: Event): void {
    event.preventDefault();

    this.cartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.success('تم إضافة المنتج إلى السلة بنجاح!', 'نجاح', {
          closeButton: true,
        });
        this.cartService.loadCartCount();
      },
      error: (err) => {
        console.log(err);
        this.toastrService.warning('هذا المنتج موجود بالفعل في السلة!', 'تنبيه', {
          closeButton: true,
        });
      },
    });
  }
}
