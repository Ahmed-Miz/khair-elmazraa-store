import { inject, Injectable } from '@angular/core';
import { MyCustomService } from './my-custom-service';
import { finalize, from, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly myCustomService = inject(MyCustomService);
  private ngxSpinnerService = inject(NgxSpinnerService);

  createOrder(orderPayload: object): Observable<any> {
    this.ngxSpinnerService.show();
    return from(
      this.myCustomService.client.rpc('create_guest_order', { payload: orderPayload }),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }

  clearCart(userId: number[]): Observable<any> {
    return from(this.myCustomService.client.from('cart_items').delete().in('id', userId));
  }
}
