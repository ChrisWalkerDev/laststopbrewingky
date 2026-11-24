import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaPanel } from '../../../shared/components/cta-panel.component';
import { PageHero } from '../../../shared/components/page-hero.component';
import { menuSections } from '../data-access/menu-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-food-menu-page',
  imports: [CtaPanel, PageHero],
  templateUrl: './food-menu-page.component.html',
  styleUrl: './food-menu-page.component.scss',
})
export class FoodMenuPage {
  protected readonly content = { menuSections };
}
