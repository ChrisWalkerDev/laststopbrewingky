import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { VisitPage } from './visit-page.component';
import { openingHoursLabel } from '../data-access/visit-content';

describe('VisitPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the verified location and external map action', async () => {
    const fixture = TestBed.createComponent(VisitPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('address')?.textContent).toContain('525 Main Street');
    expect(root.querySelector('address')?.textContent).toContain('Shelbyville, KY 40065');
    const mapLink = root.querySelector<HTMLAnchorElement>('.location-card .button');
    expect(mapLink?.href).toContain('google.com/maps/search/');
    expect(mapLink?.target).toBe('_blank');
    expect(mapLink?.rel).toContain('noopener');
    expect(mapLink?.href).toContain('525%20Main%20Street');
  });

  it('renders every opening day and identifies today in text', async () => {
    const fixture = TestBed.createComponent(VisitPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const days = Array.from(root.querySelectorAll('.hours-list dt')).map((day) =>
      day.textContent?.trim(),
    );

    expect(days).toHaveLength(7);
    expect(root.querySelector('.hours-list__today .today-label')?.textContent).toContain('Today');
    expect(root.querySelector('.hours-list')?.textContent).toContain('12 PM–12 AM');
    expect(root.querySelector('.hours-list')?.textContent).toContain('2 PM–12 AM');
  });

  it('represents verified closed days explicitly', () => {
    expect(openingHoursLabel({ day: 'Monday', dayIndex: 1, closed: true })).toBe('Closed');
  });
});
