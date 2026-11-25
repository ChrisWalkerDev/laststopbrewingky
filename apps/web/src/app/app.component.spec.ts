import { Location, ViewportScroller } from '@angular/common';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { APP_CONFIG, type RuntimeConfig } from './core/config/runtime-config';
import { App } from './app.component';
import { appConfig } from './app.config';

class RecordingViewportScroller implements ViewportScroller {
  currentPosition: [number, number] = [0, 0];
  readonly anchorCalls: string[] = [];
  readonly historyScrollRestorationCalls: string[] = [];
  readonly positionReads: [number, number][] = [];
  readonly positionCalls: [number, number][] = [];

  setOffset(): void {}

  getScrollPosition(): [number, number] {
    this.positionReads.push([...this.currentPosition]);
    return [...this.currentPosition];
  }

  scrollToPosition(position: [number, number]): void {
    this.currentPosition = [...position];
    this.positionCalls.push([...position]);
  }

  scrollToAnchor(anchor: string): void {
    this.anchorCalls.push(anchor);
  }

  setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
    this.historyScrollRestorationCalls.push(scrollRestoration);
  }
}

describe('App', () => {
  let viewportScroller: RecordingViewportScroller;

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
    sessionStorage.setItem('lastStopAgeVerified', 'true');
    viewportScroller = new RecordingViewportScroller();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...appConfig.providers,
        { provide: ViewportScroller, useValue: viewportScroller },
        { provide: APP_CONFIG, useValue: runtimeConfig },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  function bootstrapApplication(): void {
    document.body.append(document.createElement('lsb-root'));
    TestBed.inject(ApplicationRef).bootstrap(App);
  }

  it('creates the accessible application shell', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('header.site-header')).not.toBeNull();
    expect(root.querySelector<HTMLImageElement>('.brand-logo')?.getAttribute('src')).toBe(
      '/branding/logo.png',
    );
    expect(root.querySelector('main#main-content')).not.toBeNull();
    expect(root.querySelector('footer.site-footer')).not.toBeNull();
    expect(root.querySelector<HTMLAnchorElement>('.skip-link')?.hash).toBe('#main-content');
  });

  it('exposes the primary destinations without an events route', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const primaryLabels = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('#primary-navigation a'),
    ).map((link) => link.textContent?.trim());

    expect(primaryLabels).toEqual(
      expect.arrayContaining(['Home', 'Beers', 'Food & Menu', 'About Us', 'Visit', 'Contact']),
    );
    expect(primaryLabels.some((label) => label === 'Events')).toBe(false);
    expect(primaryLabels.some((label) => label === 'Plan your visit')).toBe(false);
  });

  it.each([
    ['/', 'lsb-home-page'],
    ['/beers', 'lsb-beers-page'],
    ['/menu', 'lsb-food-menu-page'],
    ['/about', 'lsb-about-page'],
    ['/visit', 'lsb-visit-page'],
    ['/contact', 'lsb-contact-page'],
    ['/missing-page', 'lsb-not-found-page'],
  ])('loads the route for %s', async (path, pageSelector) => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl(path);
    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector(pageSelector)).not.toBeNull();
  });

  it('uses About Us for primary and footer navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    const aboutLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('header a[href="/about"], footer a[href="/about"]'),
    );
    expect(aboutLinks.map((link) => link.textContent?.trim())).toEqual(['About Us', 'About Us']);
    expect(root.querySelector('a[href="/our-story"]')).toBeNull();
  });

  it('redirects the legacy Our Story route to the canonical About Us route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/our-story');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/about');
    expect((fixture.nativeElement as HTMLElement).querySelector('lsb-about-page')).not.toBeNull();
  });

  it('scrolls the complete lazy-route navigation sequence to the top', async () => {
    bootstrapApplication();
    const router = TestBed.inject(Router);
    const scrollUrls: string[] = [];
    const subscription = router.events.subscribe((event) => {
      if (event instanceof Scroll && event.routerEvent instanceof NavigationEnd) {
        scrollUrls.push(event.routerEvent.urlAfterRedirects);
      }
    });
    await TestBed.inject(ApplicationRef).whenStable();

    for (const path of ['/about', '/beers', '/menu', '/visit', '/contact', '/']) {
      scrollUrls.length = 0;
      viewportScroller.positionCalls.length = 0;
      viewportScroller.currentPosition = [0, 640];

      await router.navigateByUrl(path);

      await vi.waitFor(() => {
        expect(scrollUrls).toContain(path);
        expect(viewportScroller.positionCalls.at(-1)).toEqual([0, 0]);
      });
    }

    subscription.unsubscribe();
  });

  it('scrolls fragment navigation to the requested anchor', async () => {
    bootstrapApplication();
    const router = TestBed.inject(Router);
    await TestBed.inject(ApplicationRef).whenStable();

    await router.navigateByUrl('/about#owners-title');

    await vi.waitFor(() => {
      expect(viewportScroller.anchorCalls).toContain('owners-title');
    });
  });

  it('uses predictable scrolling from header, footer, page, and mobile navigation', async () => {
    bootstrapApplication();
    const router = TestBed.inject(Router);
    const applicationRef = TestBed.inject(ApplicationRef);
    const scrollUrls: string[] = [];
    const subscription = router.events.subscribe((event) => {
      if (event instanceof Scroll && event.routerEvent instanceof NavigationEnd) {
        scrollUrls.push(event.routerEvent.urlAfterRedirects);
      }
    });
    await applicationRef.whenStable();
    const root = document.querySelector<HTMLElement>('lsb-root');
    expect(root).not.toBeNull();

    const navigateFrom = async (selector: string, path: string): Promise<void> => {
      scrollUrls.length = 0;
      viewportScroller.positionCalls.length = 0;
      viewportScroller.currentPosition = [0, 480];
      const link = root?.querySelector<HTMLAnchorElement>(selector);
      expect(link).not.toBeNull();

      link?.click();

      await vi.waitFor(() => {
        expect(router.url).toBe(path);
        expect(scrollUrls).toContain(path);
        expect(viewportScroller.positionCalls.at(-1)).toEqual([0, 0]);
      });
      applicationRef.tick();
    };

    const navigationToggle = root?.querySelector<HTMLButtonElement>('.nav-toggle');
    navigationToggle?.click();
    applicationRef.tick();
    expect(root?.querySelector('#primary-navigation')?.classList).toContain(
      'primary-navigation--open',
    );

    await navigateFrom('#primary-navigation a[href="/beers"]', '/beers');
    expect(root?.querySelector('#primary-navigation')?.classList).not.toContain(
      'primary-navigation--open',
    );

    await navigateFrom('footer a[href="/about"]', '/about');
    await navigateFrom('main a[href="/visit"]', '/visit');

    scrollUrls.length = 0;
    viewportScroller.positionCalls.length = 0;
    await router.navigateByUrl('/');
    await vi.waitFor(() => {
      expect(scrollUrls).toContain('/');
      expect(viewportScroller.positionCalls.at(-1)).toEqual([0, 0]);
    });
    applicationRef.tick();
    await navigateFrom('main .button[href="/beers"]', '/beers');
    subscription.unsubscribe();
  });

  it('restores scroll positions for browser Back and Forward navigation', async () => {
    bootstrapApplication();
    const router = TestBed.inject(Router);
    const applicationRef = TestBed.inject(ApplicationRef);
    const navigationIds = new Map<string, number>();
    const scrollUrls: string[] = [];
    const subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        navigationIds.set(event.urlAfterRedirects, event.id);
      }
      if (event instanceof Scroll && event.routerEvent instanceof NavigationEnd) {
        scrollUrls.push(event.routerEvent.urlAfterRedirects);
      }
    });
    await applicationRef.whenStable();

    scrollUrls.length = 0;
    await router.navigateByUrl('/beers');
    await applicationRef.whenStable();
    await vi.waitFor(() => {
      expect(scrollUrls).toContain('/beers');
    });
    const beersNavigationId = navigationIds.get('/beers');
    expect(beersNavigationId).toBeDefined();
    viewportScroller.positionCalls.length = 0;
    viewportScroller.currentPosition = [0, 640];

    scrollUrls.length = 0;
    await router.navigateByUrl('/about');
    await applicationRef.whenStable();
    await vi.waitFor(() => {
      expect(scrollUrls).toContain('/about');
    });
    const aboutNavigationId = navigationIds.get('/about');
    expect(aboutNavigationId).toBeDefined();
    viewportScroller.currentPosition = [0, 120];
    viewportScroller.positionCalls.length = 0;

    TestBed.inject(Location).back();
    await vi.waitFor(() => {
      expect(router.url).toBe('/beers');
      expect(viewportScroller.positionCalls).toContainEqual([0, 640]);
    });
    expect(viewportScroller.positionReads).toContainEqual([0, 120]);

    viewportScroller.currentPosition = [0, 640];
    viewportScroller.positionCalls.length = 0;
    TestBed.inject(Location).forward();
    await vi.waitFor(() => {
      expect(router.url).toBe('/about');
      expect(viewportScroller.positionCalls).toContainEqual([0, 120]);
    });

    subscription.unsubscribe();
  });

  it('delegates browser history scroll management to the router', async () => {
    bootstrapApplication();
    await TestBed.inject(ApplicationRef).whenStable();

    expect(viewportScroller.historyScrollRestorationCalls).toContain('manual');
  });

  it('sets canonical About Us page metadata', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/about');
    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('lsb-about-page h1')?.textContent?.trim()).toBe('About Us');
    expect(document.title).toBe('About Us | Last Stop Brewing');
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      'https://laststopbrewing.example/about',
    );
  });
});
