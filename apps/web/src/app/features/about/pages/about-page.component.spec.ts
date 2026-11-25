import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AboutPage } from './about-page.component';

describe('AboutPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('presents each owner exactly once with the same role', async () => {
    const fixture = TestBed.createComponent(AboutPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const cards = Array.from(root.querySelectorAll('.owners-section lsb-team-member-card'));
    const names = cards.map((card) => card.querySelector('h3')?.textContent?.trim());
    const roles = cards.map((card) => card.querySelector('.team-member__details p')?.textContent);

    expect(names).toEqual(['Jon Fee', 'Mike Sims', 'Hunter Monarch', 'Erin Pippin']);
    expect(roles).toEqual(['Owner', 'Owner', 'Owner', 'Owner']);
  });

  it('presents the operations team with their exact roles', async () => {
    const fixture = TestBed.createComponent(AboutPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const people = Array.from(
      root.querySelectorAll('.brewery-team-section lsb-team-member-card'),
    ).map((card) => ({
      name: card.querySelector('h3')?.textContent?.trim(),
      role: card.querySelector('.team-member__details p')?.textContent?.trim(),
    }));

    expect(people).toEqual([
      { name: 'Cessaine Lee', role: 'General Manager' },
      { name: 'Hunter Freeman', role: 'Brewer' },
    ]);
  });

  it('renders every team member name exactly once', async () => {
    const fixture = TestBed.createComponent(AboutPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const renderedNames = Array.from(root.querySelectorAll('lsb-team-member-card h3')).map(
      (heading) => heading.textContent?.trim(),
    );

    expect(renderedNames).toEqual([
      'Jon Fee',
      'Mike Sims',
      'Hunter Monarch',
      'Erin Pippin',
      'Cessaine Lee',
      'Hunter Freeman',
    ]);
    expect(new Set(renderedNames).size).toBe(6);
  });

  it('shows available team portraits and clearly labels missing portraits', async () => {
    const fixture = TestBed.createComponent(AboutPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const jonPortrait = root.querySelector<HTMLImageElement>(
      '.owners-section lsb-team-member-card:nth-child(1) img',
    );
    const mikePortrait = root.querySelector<HTMLImageElement>(
      '.owners-section lsb-team-member-card:nth-child(2) img',
    );
    const hunterPortrait = root.querySelector<HTMLImageElement>(
      '.owners-section lsb-team-member-card:nth-child(3) img',
    );
    const erinPortrait = root.querySelector<HTMLImageElement>(
      '.owners-section lsb-team-member-card:nth-child(4) img',
    );
    const brewerPortrait = root.querySelector<HTMLImageElement>(
      '.brewery-team-section lsb-team-member-card:nth-child(2) img',
    );

    expect(root.querySelector<HTMLAnchorElement>('.about-closing a')?.getAttribute('href')).toBe(
      '/visit',
    );
    expect(jonPortrait?.getAttribute('src')).toBe('/images/about/jon-fee-20261124.webp');
    expect(jonPortrait?.getAttribute('alt')).toBe('Jon Fee, co-owner of Last Stop Brewing');
    expect(mikePortrait?.getAttribute('src')).toBe('/images/about/mike-sims-20261124.webp');
    expect(mikePortrait?.getAttribute('alt')).toBe('Mike Sims, co-owner of Last Stop Brewing');
    expect(hunterPortrait?.getAttribute('src')).toBe('/images/about/hunter-monarch-20261124.webp');
    expect(hunterPortrait?.getAttribute('alt')).toBe(
      'Hunter Monarch, co-owner of Last Stop Brewing',
    );
    expect(erinPortrait?.getAttribute('src')).toBe('/images/about/erin-pippin.webp');
    expect(erinPortrait?.getAttribute('alt')).toBe('Erin Pippin, co-owner of Last Stop Brewing');
    expect(brewerPortrait?.getAttribute('src')).toBe('/images/about/hunter-freeman-20261124.webp');
    expect(brewerPortrait?.getAttribute('alt')).toBe('Hunter Freeman, brewer at Last Stop Brewing');
    expect(root.querySelectorAll('.team-member__placeholder')).toHaveLength(1);
    expect(root.textContent?.match(/Portrait coming soon/g)).toHaveLength(1);
  });
});
