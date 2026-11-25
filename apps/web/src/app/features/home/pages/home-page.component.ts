import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { homeContent } from '../data-access/home-content';
import { CtaPanel } from '../../../shared/components/cta-panel.component';
import { SectionHeading } from '../../../shared/components/section-heading.component';
import { EventSpaceSection } from '../components/event-space-section.component';
import { LiveOriginalMusicSection } from '../components/live-original-music-section.component';
import { TriviaTuesdaySection } from '../components/trivia-tuesday-section.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-home-page',
  imports: [
    CtaPanel,
    EventSpaceSection,
    LiveOriginalMusicSection,
    RouterLink,
    SectionHeading,
    TriviaTuesdaySection,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePage {
  protected readonly content = homeContent;
}
