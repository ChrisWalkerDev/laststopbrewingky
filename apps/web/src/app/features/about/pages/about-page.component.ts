import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamMemberCard } from '../components/team-member-card.component';
import { breweryTeam, owners } from '../data-access/about-team';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-about-page',
  imports: [RouterLink, TeamMemberCard],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPage {
  protected readonly owners = owners;
  protected readonly breweryTeam = breweryTeam;
}
