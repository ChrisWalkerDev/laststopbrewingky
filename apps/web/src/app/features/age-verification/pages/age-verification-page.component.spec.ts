import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from '../../../app.component';
import { routes } from '../../../app.routes';
import { APP_CONFIG, type RuntimeConfig } from '../../../core/config/runtime-config';
import {
  AGE_VERIFICATION_KEY,
  AGE_VERIFICATION_DESTINATION_KEY,
} from '../../../core/services/age-verification.service';

describe('age verification flow', () => {
  const runtimeConfig: RuntimeConfig = {
    apiBaseUrl: 'http://localhost:8787',
    contact: {
      mode: 'mock',
      endpoint: '',
    },
    environment: 'local',
    siteUrl: 'https://laststopbrewing.example',
  };

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: APP_CONFIG, useValue: runtimeConfig }],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  async function openPath(path: string): Promise<{
    fixture: ComponentFixture<App>;
    root: HTMLElement;
    router: Router;
  }> {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl(path);
    await fixture.whenStable();
    fixture.detectChanges();

    return { fixture, root: fixture.nativeElement as HTMLElement, router };
  }

  it.each(['/', '/beers', '/about', '/visit', '/contact', '/beers/some-beer'])(
    'shows the gate before the protected route %s',
    async (path) => {
      const { root, router } = await openPath(path);

      expect(router.url).toBe('/age-verification');
      expect(root.querySelector('lsb-age-verification-page')).not.toBeNull();
      expect(root.querySelector('lsb-site-header')).toBeNull();
      expect(root.querySelector('lsb-site-footer')).toBeNull();
    },
  );

  it.each([
    '/',
    '/beers',
    '/contact',
    '/beers/some-beer',
    '/events?category=live-music',
    '/about#owners-title',
  ])('restores the complete requested destination %s after YES', async (destination) => {
    const { fixture, root, router } = await openPath(destination);
    const confirmButton = root.querySelector<HTMLButtonElement>('.button--confirm');

    confirmButton?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(sessionStorage.getItem(AGE_VERIFICATION_KEY)).toBe('true');
    expect(router.url).toBe(destination);
    expect(root.querySelector('lsb-age-verification-page')).toBeNull();
  });

  it('falls back to the homepage when opened directly and YES is selected', async () => {
    const { fixture, root, router } = await openPath('/age-verification');

    root.querySelector<HTMLButtonElement>('.button--confirm')?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });

  it('restores the destination after the verification component is recreated', async () => {
    const { fixture } = await openPath('/events?category=live-music#upcoming');
    fixture.destroy();

    const reloadedFixture = TestBed.createComponent(App);
    await reloadedFixture.whenStable();
    reloadedFixture.detectChanges();
    const root = reloadedFixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('.button--confirm')?.click();
    await reloadedFixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/events?category=live-music#upcoming');
  });

  it('remains verified after recreating the application in the same tab', async () => {
    const { fixture } = await openPath('/beers');
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('.button--confirm')?.click();
    await fixture.whenStable();
    fixture.destroy();

    const refreshedFixture = TestBed.createComponent(App);
    await refreshedFixture.whenStable();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/visit');
    await refreshedFixture.whenStable();

    expect(router.url).toBe('/visit');
    expect(
      (refreshedFixture.nativeElement as HTMLElement).querySelector('lsb-age-verification-page'),
    ).toBeNull();
  });

  it('stays on the gate and does not verify when NO is selected', async () => {
    const { fixture, root, router } = await openPath('/beers');

    root.querySelector<HTMLButtonElement>('.button--reject')?.click();
    fixture.detectChanges();

    expect(sessionStorage.getItem(AGE_VERIFICATION_KEY)).toBeNull();
    expect(router.url).toBe('/age-verification');
    expect(root.textContent).toContain('Sorry, you must be 21 or older to enter this website.');
  });

  it('does not prompt a verified visitor again during the tab session', async () => {
    sessionStorage.setItem(AGE_VERIFICATION_KEY, 'true');
    const { fixture, root, router } = await openPath('/beers');

    expect(router.url).toBe('/beers');
    expect(root.querySelector('lsb-age-verification-page')).toBeNull();

    await router.navigateByUrl('/contact');
    await fixture.whenStable();
    expect(router.url).toBe('/contact');
    expect(root.querySelector('lsb-age-verification-page')).toBeNull();
  });

  it('shows the gate in a new tab session or after verification is cleared', async () => {
    sessionStorage.setItem(AGE_VERIFICATION_KEY, 'true');
    sessionStorage.removeItem(AGE_VERIFICATION_KEY);

    const { router } = await openPath('/visit');

    expect(router.url).toBe('/age-verification');
  });

  it('shows the gate when the session storage value is invalid', async () => {
    sessionStorage.setItem(AGE_VERIFICATION_KEY, 'yes');

    const { router } = await openPath('/about');

    expect(router.url).toBe('/age-verification');
  });

  it('rejects an external return destination supplied in navigation state', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/age-verification', {
      state: { returnUrl: 'https://example.com/phishing' },
    });
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('.button--confirm')?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/');
  });

  it('does not guard the verification route recursively', async () => {
    const { root, router } = await openPath('/age-verification');

    expect(router.url).toBe('/age-verification');
    expect(sessionStorage.getItem(AGE_VERIFICATION_DESTINATION_KEY)).toBeNull();
    expect(root.querySelector('lsb-age-verification-page')).not.toBeNull();
  });
});
