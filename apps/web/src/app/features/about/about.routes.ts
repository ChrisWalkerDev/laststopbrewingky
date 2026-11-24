import type { Routes } from '@angular/router';
import { AboutPage } from './pages/about-page.component';

export const aboutRoutes: Routes = [
  {
    path: '',
    component: AboutPage,
    data: {
      seo: {
        title: 'About Us',
        description:
          'Meet the owners, General Manager, and Brewer behind Last Stop Brewing and discover the people bringing teamwork and craftsmanship to every pour.',
        path: '/about',
      },
    },
  },
];
