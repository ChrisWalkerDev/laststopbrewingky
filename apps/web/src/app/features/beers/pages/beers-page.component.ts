import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/components/page-hero.component';
import { UntappdBeerMenu } from '../components/untappd-beer-menu.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-beers-page',
  imports: [PageHero, UntappdBeerMenu],
  templateUrl: './beers-page.component.html',
  styleUrl: './beers-page.component.scss',
})
export class BeersPage {}
