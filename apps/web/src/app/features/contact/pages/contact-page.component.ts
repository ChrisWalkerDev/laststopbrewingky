import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/components/page-hero.component';
import { ContactForm } from '../components/contact-form/contact-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-contact-page',
  imports: [ContactForm, PageHero],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPage {}
