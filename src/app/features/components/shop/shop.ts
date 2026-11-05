import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/model/supabaseService/product-service';
import { Category, ShopInterface } from '../../../core/interface/shop-interface';
import { CartService } from '../../../core/model/supabaseService/cart-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop',
  imports: [RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  activeCategory = signal<string>('الكل');
  products = signal<ShopInterface[]>([]);
  searchQuery = signal<string>('');
  cunt = signal<number>(0);

  ngOnInit(): void {
    this.getProducts();
    this.route.queryParams.subscribe((params) => {
      const category = params['category'] || 'الكل';
      const search = params['search'] || params['q'] || '';
      this.searchQuery.set(search);
      this.activeCategory.set(category);
      this.selectCategory(category);
    });
  }

  categories = signal<Category[]>([
    { id: 'الكل', name: 'الكل', icon: 'fa-solid fa-border-all' },
    { id: 'دواجن', name: 'دواجن', icon: 'fa-solid fa-drumstick-bite' },
    { id: 'لحوم', name: 'لحوم ', icon: 'fa-solid fa-cow' },
    { id: 'مصنعات', name: 'مصنعات', icon: 'fa-solid fa-burger' },
  ]);

  getProducts(): void {
    this.productService.getProduct().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.cunt.set(res.data.length);
        this.selectCategory('الكل');
        console.log(this.products());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // الفلترة التلقائية الذكية (بتجمع القسم + البحث + الـ Title)

  filteredArticles = computed(() => {
    const allItems = this.products();
    const category = this.activeCategory();
    const query = this.searchQuery();
    return allItems.filter((item) => {
      const matchesCatrgory = category === 'الكل' || item.category === category;
      const itemtitle = item.title || item.description || '';
      const matchesSearch = !query || itemtitle.includes(query);
      return matchesCatrgory && matchesSearch;
    });
  });
  selectCategory(id: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: id === 'الكل' ? null : id },
      queryParamsHandling: 'merge',
    });
  }

  addToItems(productId: number): void {
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.toastrService.success('تم إضافة المنتج إلى السلة بنجاح!', 'نجاح', {
          closeButton: true,
        });
        this.cartService.loadCartCount();
        console.log(res);
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
