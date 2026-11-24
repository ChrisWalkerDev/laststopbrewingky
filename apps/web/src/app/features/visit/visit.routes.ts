import type { Routes } from '@angular/router';
import { VisitPage } from './pages/visit-page.component';

export const visitRoutes: Routes = [
  {
    path: '',
    component: VisitPage,
    data: {
      seo: {
        title: 'Visit Us',
        description:
          'Plan a visit to Last Stop Brewing with location, opening hours, parking, and accessibility information.',
        path: '/visit',
      },
    },
  },
];
