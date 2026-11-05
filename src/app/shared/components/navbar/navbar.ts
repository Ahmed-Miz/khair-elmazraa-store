import { Component, HostListener, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from '../../../core/model/supabaseService/cart-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgClass],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  isScrolled = false;
  isMenuOpen = signal<boolean>(false); // حالة فتح وإغلاق السايد بار
  logged = signal<boolean>(false);

  ngOnInit(): void {}
  cartCount = this.cartService.countCart;

  constructor() {
    // إغلاق السايد بار أوتوماتيكياً عند الانتقال لأي صفحة
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.closeMenu();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  toggleMenu() {
    this.isMenuOpen.update((val) => !val);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onSearch(query: string, event: Event) {
    this.router.navigate(['/shop'], { queryParams: { search: query } });
    console.log('Search:', query);
    this.closeMenu();
  }

  logout() {
    this.logged.set(false);
    this.closeMenu();
  }

  getSubtotal(): number {
    return this.cartItems().reduce((sum, item) => {
      const price = item.products?.price ?? item.offers?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }
}
