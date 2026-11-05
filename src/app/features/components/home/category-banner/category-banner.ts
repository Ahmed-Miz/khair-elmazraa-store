import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Category {
  id: string;
  name: string;
  image: string;
  queryParam: string;
}

@Component({
  selector: 'app-category-banner',
  imports: [RouterLink],
  templateUrl: './category-banner.html',
  styleUrl: './category-banner.css',
})
export class CategoryBanner {
  categories = signal<Category[]>([
    {
      id: '1',
      name: 'دواجن طازجة',
      image:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
      queryParam: 'poultry',
    },
    {
      id: '2',
      name: 'لحوم ومصنعات',
      image:
        'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80',
      queryParam: 'processed',
    },

    {
      id: '4',
      name: 'عروض التوفير',
      image:
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
      queryParam: 'ready-to-cook',
    },
  ]);
}
