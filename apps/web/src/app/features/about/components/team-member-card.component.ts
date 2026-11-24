import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TeamMember } from '../data-access/about-team';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-team-member-card',
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.scss',
})
export class TeamMemberCard {
  readonly member = input.required<TeamMember>();
}
