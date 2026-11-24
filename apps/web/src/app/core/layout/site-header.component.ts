import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly exact?: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeader {
  protected readonly navigationOpen = signal(false);
  protected readonly navigation: readonly NavigationItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Beers', path: '/beers' },
    { label: 'Food & Menu', path: '/menu' },
    { label: 'About Us', path: '/about' },
    { label: 'Visit', path: '/visit' },
    { label: 'Contact', path: '/contact' },
  ];

  protected toggleNavigation(): void {
    this.navigationOpen.update((open) => !open);
  }

  protected closeNavigation(): void {
    this.navigationOpen.set(false);
  }
}
