import type { Routes } from '@angular/router';
import { FoodMenuPage } from './pages/food-menu-page.component';

export const foodMenuRoutes: Routes = [
  {
    path: '',
    component: FoodMenuPage,
    data: {
      seo: {
        title: 'Food & Drinks',
        description:
          'Browse the burgers, starters, wings, sandwiches, cocktails, and drinks at Last Stop Brewing in Kentucky.',
        path: '/menu',
      },
    },
  },
];
