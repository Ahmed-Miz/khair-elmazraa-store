import { CartInterface } from './../../core/interface/cart-interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../core/model/supabaseService/cart-service';
import { CheckoutService } from '../../core/model/supabaseService/checkout-service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('cart_guestId')) {
        this.orderNumber.set(localStorage.getItem('cart_guestId')!);
      }
    }
  }
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);
  cartItems = this.cartService.cartItems;
  // طريقة الدفع المحددة
  paymentMethod = signal<'cod' | 'vodafone' | 'card'>('cod');

  orderNumber = signal<string>('');
  // حالة إظهار النافذة المنبثقة (Success Modal)
  isSuccessModalOpen = signal<boolean>(false);

  // حالة إنشاء الحساب داخل المودال
  password = signal<string>('');
  isAccountCreated = signal<boolean>(false);
  //Form Group
  checkoutForm: FormGroup = this.fb.group({
    customer_name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]], // فحص رقم المصلري
    area: ['', Validators.required],
    address: ['', Validators.required],
    notes: [''],
    payment_method: ['', Validators.required],
  });

  deliveryFee = 35; // رسوم التوصيل لجميع مناطق الإسكندرية

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

  setPayment(method: 'cod' | 'vodafone' | 'card') {
    this.paymentMethod.set(method);
  }

  // عند الضغط على تأكيد الطلب -> نفتح المودال فوراً
  onSubmitOrder(event: Event) {
    const formValues = this.checkoutForm.value;

    const orderPayload = {
      customer_name: formValues.customer_name,
      phone: formValues.phone,
      area: formValues.area,
      address: formValues.address,
      notes: formValues.notes || null,
      payment_method: formValues.payment_method,
      total_price: this.getTotal(),
      order_items: this.cartItems().map((item) => ({
        product_id: item.product_id || null,
        offer_id: item.offer_id || null,
        title: item.products?.title ?? item.offers?.title ?? '',
        price: item.products?.price ?? item.offers?.price ?? 0,
        quantity: item.quantity,
        image_url: item.products?.image_url ?? item.offers?.image_url ?? '',
      })),
      status: 'pending',
      guest_id: this.orderNumber(),
    };
    event.preventDefault();
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
    } else {
      this.checkoutService.createOrder(orderPayload).subscribe({
        next: (res) => {
          if (res.success === true) {
            this.isSuccessModalOpen.set(true);
            this.clearCart(this.cartItems().map((i) => i.id));
          }
          console.log('تم تسجيل الطلب ببيانات العميل طازجاً!', res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  clearCart(userId: number[]): void {
    this.checkoutService.clearCart(userId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // إغلاق المودال
  closeModal() {
    this.isSuccessModalOpen.set(false);
  }

  // إنشاء حساب سريع باختيار الباسورد
  onQuickRegister() {
    if (this.password().length >= 6) {
      console.log('تم إنشاء الحساب بكلمة السر:', this.password());
      this.isAccountCreated.set(true);
    }
  }
}
