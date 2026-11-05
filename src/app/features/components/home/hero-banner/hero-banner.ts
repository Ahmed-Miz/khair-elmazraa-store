import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  imports: [RouterLink],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {
  title = input<string>('');
  subtitle = input<string>('');
  videoUrl = input<string>('');
}
