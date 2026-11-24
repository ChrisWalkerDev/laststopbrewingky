import type { Routes } from '@angular/router';
import { BeersPage } from './pages/beers-page.component';

export const beersRoutes: Routes = [
  {
    path: '',
    component: BeersPage,
    data: {
      seo: {
        title: 'Beers',
        description:
          'Explore the content-ready beer catalogue framework for Last Stop Brewing, including styles and product details.',
        path: '/beers',
      },
    },
  },
];
