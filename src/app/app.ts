import { FlowbiteService } from './features/services/flowbite.service/flowbite.service';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { CartService } from './core/model/supabaseService/cart-service';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, Footer, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('khair.almazraa');
  private cartService = inject(CartService);
  constructor(private FlowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
      this.cartService.getGuestId();
    });
  }
}
