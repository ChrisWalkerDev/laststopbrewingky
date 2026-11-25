import { TestBed } from '@angular/core/testing';
import { UNTAPPD_BEER_MENU_URL } from '../config/untappd-menu';
import { BeersPage } from './beers-page.component';

describe('BeersPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeersPage],
    }).compileComponents();
  });

  it('presents the current Untappd menu with an accessible external fallback', async () => {
    const fixture = TestBed.createComponent(BeersPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const iframe = root.querySelector<HTMLIFrameElement>('iframe');
    const fallbackLink = root.querySelector<HTMLAnchorElement>('.untappd-menu__fallback a');

    expect(root.querySelector('h1')?.textContent).toContain('Our Beers');
    expect(iframe?.getAttribute('src')).toBe(UNTAPPD_BEER_MENU_URL);
    expect(iframe?.title).toBe('Current brewery beer menu powered by Untappd');
    expect(iframe?.getAttribute('loading')).toBe('lazy');
    expect(fallbackLink?.getAttribute('href')).toBe(UNTAPPD_BEER_MENU_URL);
    expect(fallbackLink?.target).toBe('_blank');
    expect(fallbackLink?.rel).toContain('noopener');
    expect(
      (fallbackLink?.compareDocumentPosition(iframe as HTMLIFrameElement) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('does not render the preserved native catalogue presentation', async () => {
    const fixture = TestBed.createComponent(BeersPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.beer-list')).toBeNull();
    expect(root.querySelectorAll('.untappd-menu__frame')).toHaveLength(1);
  });
});
