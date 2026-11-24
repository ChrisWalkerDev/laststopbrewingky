import type { Routes } from '@angular/router';
import { ContactPage } from './pages/contact-page.component';
import { provideContactSubmission } from './services/contact-submission.service';

export const contactRoutes: Routes = [
  {
    path: '',
    component: ContactPage,
    providers: provideContactSubmission(),
    data: {
      seo: {
        title: 'Contact Us',
        description: 'Send Last Stop Brewing a message or question using the secure contact form.',
        path: '/contact',
      },
    },
  },
];
