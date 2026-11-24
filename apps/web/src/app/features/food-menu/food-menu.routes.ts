import type { Routes } from '@angular/router';
import { FoodMenuPage } from './pages/food-menu-page.component';

export const foodMenuRoutes: Routes = [
  {
    path: '',
    component: FoodMenuPage,
    data: {
      seo: {
        title: 'Food & Menu',
        description:
          'Preview Last Stop Brewing’s mobile-friendly food, drink, seasonal special, and dietary information structure.',
        path: '/menu',
      },
    },
  },
];
