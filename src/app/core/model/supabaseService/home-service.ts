import { inject, Injectable } from '@angular/core';
import { finalize, from, Observable } from 'rxjs';
import { MyCustomService } from './my-custom-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private supabase = inject(MyCustomService);
  private ngxSpinnerService = inject(NgxSpinnerService);

  getHome(): Observable<any> {
    this.ngxSpinnerService.show();
    return from(
      this.supabase.client
        .from('home')
        .select('*')
        .then((res) => res),
    ).pipe(
      finalize(() => {
        this.ngxSpinnerService.hide();
      }),
    );
  }
}
