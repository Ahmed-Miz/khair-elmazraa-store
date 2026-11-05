import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/model/supabaseService/cart-service';
import { CartInterface } from '../../core/interface/cart-interface';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  // بيانات تجريبية للمنتجات الموجودة في السلة
  private cartService = inject(CartService);
  ngOnInit(): void {
    this.getCartItems();
  }
  cartItems = this.cartService.cartItems;

  getCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        this.cartItems.set(res);
        this.cartService.countCart.set(res.length);
        console.log(this.cartItems());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deliveryFee = 35; // رسوم التوصيل الثابتة في الإسكندرية
  // زيادة الكمية باستخدام الـ ID مباشرة

  increaseQty(item: CartInterface) {
    const updatedQty = item.quantity + 1;

    this.cartService.updateQuantity(item.id, updatedQty).subscribe({
      next: (res) => {
        // تحديث الـ Signal المحلية باستخدام الـ id الفريد
        this.cartItems.update((items) =>
          items.map((i) => (i.id === item.id ? { ...i, quantity: updatedQty } : i)),
        );
        console.log('تم التحديث بنجاح:', res);
      },
      error: (err) => {
        console.error('خطأ في التحديث:', err);
      },
    });
  }
  // تقليل الكمية باستخدام الـ ID مباشرة
  decreaseQty(item: CartInterface) {
    const updateQuantity = item.quantity - 1;
    if (updateQuantity < 1) {
      this.removeItem(item.id);
    } else {
      this.cartService.updateQuantity(item.id, updateQuantity).subscribe({
        next: (res) => {
          this.cartItems.update((items) =>
            items.map((i) => (i.id === item.id ? { ...i, quantity: updateQuantity } : i)),
          );
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // حذف منتج من السلة
  removeItem(id: number) {
    this.cartService.removeItem(id).subscribe({
      next: (res) => {
        this.getCartItems();
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.cartItems.update((items) => items.filter((i) => i.id !== id));
  }

  // حساب المجموع الفرعي للمنتجات
  getSubtotal(): number {
    return this.cartItems().reduce((sum, item) => {
      // بنحدد السعر الصح بأمان تام وبدون أي احتمالية لحدوث خطأ null
      const price = item.products?.price ?? item.offers?.price ?? 0;

      return sum + price * item.quantity;
    }, 0);
  }
  // حساب الإجمالي النهائي
  getTotal(): number {
    return this.getSubtotal() > 0 ? this.getSubtotal() + this.deliveryFee : 0;
  }
}
