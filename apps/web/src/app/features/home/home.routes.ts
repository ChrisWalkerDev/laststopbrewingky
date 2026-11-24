import type { Routes } from '@angular/router';
import { HomePage } from './pages/home-page.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomePage,
    data: {
      seo: {
        title: 'Kentucky craft brewery preview',
        description:
          'Preview Last Stop Brewing’s beer, menu, story, and visit information with a content-ready brewery website.',
        path: '/',
        socialTitle: 'Last Stop Brewing',
      },
    },
  },
];
