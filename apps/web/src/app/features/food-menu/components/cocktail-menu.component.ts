import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { MenuSection } from '../data-access/menu-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-cocktail-menu',
  templateUrl: './cocktail-menu.component.html',
  styleUrl: './cocktail-menu.component.scss',
})
export class CocktailMenu {
  readonly section = input.required<MenuSection>();
}
