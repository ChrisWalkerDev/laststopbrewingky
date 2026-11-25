import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { MenuSection } from '../data-access/menu-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-menu-category-card',
  templateUrl: './menu-category-card.component.html',
  styleUrl: './menu-category-card.component.scss',
})
export class MenuCategoryCard {
  readonly section = input.required<MenuSection>();
}
