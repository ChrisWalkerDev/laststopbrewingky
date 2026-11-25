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
          'Explore the current beer selection on tap at Last Stop Brewing in Shelbyville, Kentucky.',
        path: '/beers',
      },
    },
  },
];
