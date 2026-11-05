import { CartInterface } from './../../interface/cart-interface';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { finalize, from, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MyCustomService } from './my-custom-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private supabase = inject(MyCustomService);
  private pLATFORM_ID = inject(PLATFORM_ID);
  public cartItems = signal<CartInterface[]>([]);
  public countCart = signal<number>(0);
  private ngxSpinnerService = inject(NgxSpinnerService);
  getGuestId(): string {
    let guestId;
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      guestId = localStorage.getItem('cart_guestId');
    }

    if (!guestId) {
      guestId = 'guestId_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      if (isPlatformBrowser(this.pLATFORM_ID)) {
        localStorage.setItem('cart_guestId', guestId);
      }
    }
    return guestId;
  }

  addOffers(offerId: number): Observable<any> {
    const guestId = this.getGuestId();
    this.ngxSpinnerService.show();
    return from(
      this.supabase.client
        .from('cart_items')
        .insert([
          {
            guest_id: guestId,
            offer_id: offerId || null,
            product_id: null,
            quantity: 1,
          },
        ])
        .select() // دي اللي بتخليه يرجع الصف الجديد جوه الـ data
        .then((res) => {
          if (res.error) throw res.error;
          return res.data;
        }),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }
  addToCart(productId: number): Observable<any> {
    const guestId = this.getGuestId();
    this.ngxSpinnerService.show();
    return from(
      this.supabase.client
        .from('cart_items')
        .insert([
          {
            guest_id: guestId,
            offer_id: null,
            product_id: productId || null,
            quantity: 1,
          },
        ])
        .select() // دي اللي بتخليه يرجع الصف الجديد جوه الـ data
        .then((res) => {
          if (res.error) throw res.error;
          return res.data;
        }),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }

  getCartItems(): Observable<any> {
    const currentGuestId = this.getGuestId();
    this.ngxSpinnerService.show();
    return from(
      this.supabase.client
        .from('cart_items')
        // هنا بنحدد الأعمدة اللي عاوزينها من جدول السلة، وجوه قوسين بنحدد أعمدة جدول المنتجات المرتبط به
        .select(
          `
        id,
        quantity,
        product_id,
        offers ( id, title, price, image_url,saving_amount ),
        products (
          id,
          title,
          price,
          image_url,
          
tag

        )
      `,
        )
        .eq('guest_id', currentGuestId)
        .then((response) => {
          if (response.error) {
            throw response.error;
          }
          return response.data;
        }),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }

  removeItem(cartItemId: number): Observable<any> {
    this.ngxSpinnerService.show();
    return from(this.supabase.client.from('cart_items').delete().eq('id', cartItemId).select());
  }

  updateQuantity(cartItemId: number, newQuantity: number): Observable<any> {
    // بنستدعي دالة الـ SQL اللي عملناها عبر rpc بطلب POST آمن تماماً
    return from(
      this.supabase.client.rpc('update_cart_item_quantity', {
        p_cart_item_id: cartItemId,
        p_new_quantity: newQuantity,
      }),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }

  loadCartCount() {
    const currentGuestId = this.getGuestId();

    // بنجيب عدد العناصر من الداتا بيس ونحدث الـ Signal مباشرة
    this.supabase.client
      .from('cart_items')
      .select('id', { count: 'exact' })
      .eq('guest_id', currentGuestId)
      .then((res) => {
        if (!res.error) {
          this.countCart.set(res.count || 0);
        }
      });
  }
}
