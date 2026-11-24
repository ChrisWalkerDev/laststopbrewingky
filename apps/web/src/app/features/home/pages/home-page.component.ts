import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { homeContent } from '../data-access/home-content';
import { CtaPanel } from '../../../shared/components/cta-panel.component';
import { SectionHeading } from '../../../shared/components/section-heading.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-home-page',
  imports: [CtaPanel, RouterLink, SectionHeading],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePage {
  protected readonly content = homeContent;
}
