import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaPanel } from '../../../shared/components/cta-panel.component';
import { PageHero } from '../../../shared/components/page-hero.component';
import { beerCatalogue } from '../data-access/beer-catalogue';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-beers-page',
  imports: [CtaPanel, PageHero],
  templateUrl: './beers-page.component.html',
  styleUrl: './beers-page.component.scss',
})
export class BeersPage {
  protected readonly content = { beers: beerCatalogue };
}
