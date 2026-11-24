import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((module) => module.homeRoutes),
  },
  {
    path: 'beers',
    loadChildren: () =>
      import('./features/beers/beers.routes').then((module) => module.beersRoutes),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./features/food-menu/food-menu.routes').then((module) => module.foodMenuRoutes),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.routes').then((module) => module.aboutRoutes),
  },
  {
    path: 'our-story',
    redirectTo: 'about',
    pathMatch: 'full',
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./features/contact/contact.routes').then((module) => module.contactRoutes),
  },
  {
    path: 'visit',
    loadChildren: () =>
      import('./features/visit/visit.routes').then((module) => module.visitRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/pages/not-found-page.component').then((m) => m.NotFoundPage),
    data: {
      seo: {
        title: 'Page not found',
        description: 'The requested page could not be found.',
        path: '/404',
      },
    },
  },
];
