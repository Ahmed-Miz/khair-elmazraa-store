import { finalize, from, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { MyCustomService } from './my-custom-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private supabase = inject(MyCustomService);
  private ngxSpinnerService = inject(NgxSpinnerService);

  getProduct(): Observable<any> {
    this.ngxSpinnerService.show();
    return from(
      this.supabase.client
        .from('products')
        .select('*')
        .then((res) => res),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }
}
