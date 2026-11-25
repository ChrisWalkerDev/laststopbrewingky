import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CocktailMenu } from '../components/cocktail-menu.component';
import { MenuCategoryCard } from '../components/menu-category-card.component';
import { cocktailSection, foodSections, menuNavigation } from '../data-access/menu-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-food-menu-page',
  imports: [CocktailMenu, MenuCategoryCard, RouterLink],
  templateUrl: './food-menu-page.component.html',
  styleUrl: './food-menu-page.component.scss',
})
export class FoodMenuPage implements AfterViewInit, OnDestroy {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly menuNavigationElement = viewChild.required<ElementRef<HTMLElement>>(
    'categoryNavigationElement',
  );
  protected readonly foodSections = foodSections;
  protected readonly cocktailSection = cocktailSection;
  protected readonly menuNavigation = menuNavigation;

  ngAfterViewInit(): void {
    this.viewportScroller.setOffset([0, this.menuNavigationElement().nativeElement.offsetHeight]);
  }

  ngOnDestroy(): void {
    this.viewportScroller.setOffset([0, 0]);
  }
}
