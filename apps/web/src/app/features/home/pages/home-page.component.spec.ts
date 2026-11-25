import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomePage } from './home-page.component';

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('links the hero food menu button to the food menu page', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const foodMenuButton = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('.hero .button'),
    ).find((link) => link.textContent?.trim() === 'View the food menu');

    expect(foodMenuButton).toBeDefined();
    expect(foodMenuButton?.getAttribute('href')).toBe('/menu');
  });

  it('includes the event space section after the menu and beer sections', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const eventSection = root.querySelector('lsb-event-space-section .event-space');
    const beerSection = root.querySelector('.section--deep');
    const menuSection = root.querySelector('.split-feature');

    expect(eventSection).not.toBeNull();
    expect(beerSection).not.toBeNull();
    expect(menuSection).not.toBeNull();
    expect(
      (beerSection?.compareDocumentPosition(eventSection as HTMLElement) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      (menuSection?.compareDocumentPosition(eventSection as HTMLElement) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      eventSection?.querySelector<HTMLAnchorElement>('.event-space__cta a')?.getAttribute('href'),
    ).toBe('/contact');
  });

  it('places Trivia Tuesday immediately after the event space with the confirmed details', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const eventSpace = root.querySelector<HTMLElement>('lsb-event-space-section');
    const trivia = root.querySelector<HTMLElement>('lsb-trivia-tuesday-section');

    expect(eventSpace).not.toBeNull();
    expect(trivia).not.toBeNull();
    expect(eventSpace?.nextElementSibling).toBe(trivia);
    expect(trivia?.textContent).toContain('Trivia Tuesday at Last Stop!');
    expect(trivia?.textContent).toContain('Every Tuesday');
    expect(trivia?.textContent).toContain('7:00 PM – 9:00 PM');
    expect(trivia?.textContent).toContain('Presented by');
    expect(trivia?.textContent).toContain('Salvato Music and Entertainment');
    expect(trivia?.textContent).toContain('Last Stop Brewing');
  });

  it('places live original music immediately after Trivia Tuesday with the recurring schedule', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const trivia = root.querySelector<HTMLElement>('lsb-trivia-tuesday-section');
    const liveMusic = root.querySelector<HTMLElement>('lsb-live-original-music-section');

    expect(trivia).not.toBeNull();
    expect(liveMusic).not.toBeNull();
    expect(trivia?.nextElementSibling).toBe(liveMusic);
    expect(liveMusic?.textContent).toContain('Every Saturday Night');
    expect(liveMusic?.textContent).toContain('Saturday Nights. Live Original Music.');
    expect(liveMusic?.querySelector('.live-music__details')).toBeNull();
  });
});
