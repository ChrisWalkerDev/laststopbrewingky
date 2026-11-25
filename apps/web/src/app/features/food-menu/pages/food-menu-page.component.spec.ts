import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FoodMenuPage } from './food-menu-page.component';

describe('FoodMenuPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodMenuPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the supplied menu categories and anchor navigation', async () => {
    const fixture = TestBed.createComponent(FoodMenuPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelectorAll('h1')).toHaveLength(1);
    expect(root.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Food & Drinks',
    );
    expect(root.querySelector<HTMLAnchorElement>('a[href="/menu#burgers"]')).not.toBeNull();
    expect(root.querySelector<HTMLAnchorElement>('a[href="/menu#beer-list"]')).toBeNull();
    expect(root.querySelector('#starters')?.closest('.menu-card')?.textContent).toContain(
      'Fried Pickles',
    );
    expect(root.querySelector('#cocktails')?.closest('.cocktail-list')?.textContent).toContain(
      'Espresso Martini',
    );
  });

  it('renders the confirmed price for every burger', async () => {
    const fixture = TestBed.createComponent(FoodMenuPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const burgers = root.querySelector('#burgers')?.closest('.menu-card');
    const burgerItems = Array.from(burgers?.querySelectorAll('.menu-item') ?? []);

    expect(burgerItems).toHaveLength(8);
    expect(burgerItems.every((item) => item.textContent?.includes('$15.99'))).toBe(true);
  });

  it('uses the confirmed cocktail spelling and omits QR content', async () => {
    const fixture = TestBed.createComponent(FoodMenuPage);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('#cocktails')?.closest('.cocktail-list')?.textContent).toContain(
      'Last Stop Staplegun',
    );
    expect(root.querySelector('.qr-placeholder')).toBeNull();
    expect(root.querySelector('#beer-list')).toBeNull();
  });
});
