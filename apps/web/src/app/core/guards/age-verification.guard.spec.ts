import { TestBed } from '@angular/core/testing';
import { provideRouter, RedirectCommand, Router, type RouterStateSnapshot } from '@angular/router';
import {
  AGE_VERIFICATION_RETURN_URL_STATE_KEY,
  ageVerificationGuard,
  isSafeAgeVerificationDestination,
} from './age-verification.guard';
import {
  AGE_VERIFICATION_DESTINATION_KEY,
  AGE_VERIFICATION_KEY,
  AgeVerificationService,
} from '../services/age-verification.service';

describe('ageVerificationGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it.each([
    ['/'],
    ['/beers'],
    ['/beers/some-beer'],
    ['/events?category=live-music'],
    ['/about#owners-title'],
  ])('redirects an unverified visitor attempting %s with the complete URL', (url) => {
    const result = TestBed.runInInjectionContext(() =>
      ageVerificationGuard({} as never, { url } as RouterStateSnapshot),
    );

    expect(sessionStorage.getItem(AGE_VERIFICATION_DESTINATION_KEY)).toBe(url);
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(TestBed.inject(Router).serializeUrl((result as RedirectCommand).redirectTo)).toBe(
      '/age-verification',
    );
    expect((result as RedirectCommand).navigationBehaviorOptions?.state).toEqual({
      [AGE_VERIFICATION_RETURN_URL_STATE_KEY]: url,
    });
  });

  it('allows a visitor only when the exact session value is true', () => {
    sessionStorage.setItem(AGE_VERIFICATION_KEY, 'true');

    const result = TestBed.runInInjectionContext(() =>
      ageVerificationGuard({} as never, { url: '/beers' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('returns unverified for invalid values', () => {
    sessionStorage.setItem(AGE_VERIFICATION_KEY, 'yes');

    const result = TestBed.runInInjectionContext(() =>
      ageVerificationGuard({} as never, { url: '/beers' } as RouterStateSnapshot),
    );

    expect(result).not.toBe(true);
  });

  it.each([
    'https://example.com/phishing',
    '//example.com/phishing',
    '/\\example.com/phishing',
    'javascript:alert(1)',
    '/age\u0000-verification',
    '/age-verification',
    '/age-verification/child',
  ])('rejects the unsafe external destination %s', (destination) => {
    expect(isSafeAgeVerificationDestination(destination)).toBe(false);
  });

  it.each([
    '/',
    '/beers',
    '/beers/some-beer',
    '/events?category=live-music',
    '/about#owners-title',
  ])('accepts the safe internal destination %s', (destination) => {
    expect(isSafeAgeVerificationDestination(destination)).toBe(true);
  });

  it('does not run recursively on the age-verification route', () => {
    const verification = TestBed.inject(AgeVerificationService);
    const rememberSpy = vi.spyOn(verification, 'rememberDestination');

    expect(rememberSpy).not.toHaveBeenCalled();
  });
});
