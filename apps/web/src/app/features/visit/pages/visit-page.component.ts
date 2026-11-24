import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/components/page-hero.component';
import { SectionHeading } from '../../../shared/components/section-heading.component';
import { openingHoursLabel, visitContent } from '../data-access/visit-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-visit-page',
  imports: [PageHero, RouterLink, SectionHeading],
  templateUrl: './visit-page.component.html',
  styleUrl: './visit-page.component.scss',
})
export class VisitPage {
  protected readonly content = visitContent;
  protected readonly hoursLabel = openingHoursLabel;
  protected readonly today = new Date().getDay();
}
