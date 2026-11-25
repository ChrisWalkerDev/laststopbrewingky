import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UNTAPPD_BEER_MENU_URL } from '../config/untappd-menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-untappd-beer-menu',
  templateUrl: './untappd-beer-menu.component.html',
  styleUrl: './untappd-beer-menu.component.scss',
})
export class UntappdBeerMenu {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly menuUrl = UNTAPPD_BEER_MENU_URL;
  // Angular requires an explicit trust boundary for cross-origin iframe resource URLs.
  protected readonly trustedMenuUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(UNTAPPD_BEER_MENU_URL);
}
