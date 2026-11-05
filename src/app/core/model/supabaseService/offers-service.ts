import { inject, Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { finalize, from, Observable } from 'rxjs';
import { MyCustomService } from './my-custom-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private supabase = inject(MyCustomService);
  private ngxSpinnerService = inject(NgxSpinnerService);

  getOffers(): Observable<any> {
    this.ngxSpinnerService.show();
    return from(
      this.supabase.client
        .from('offers')
        .select('*')
        .then((res) => res),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }
}
