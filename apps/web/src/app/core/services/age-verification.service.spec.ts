import { TestBed } from '@angular/core/testing';
import {
  AGE_VERIFICATION_DESTINATION_KEY,
  AGE_VERIFICATION_KEY,
  AgeVerificationService,
} from './age-verification.service';

describe('AgeVerificationService', () => {
  let service: AgeVerificationService;

  beforeEach(() => {
    sessionStorage.clear();
    service = TestBed.inject(AgeVerificationService);
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it.each([null, '', 'false', 'TRUE', '1'])('treats the stored value %s as unverified', (value) => {
    if (value !== null) {
      sessionStorage.setItem(AGE_VERIFICATION_KEY, value);
    }

    expect(service.isVerified()).toBe(false);
  });

  it('stores and clears successful verification using session storage', () => {
    service.verify();

    expect(sessionStorage.getItem(AGE_VERIFICATION_KEY)).toBe('true');
    expect(service.isVerified()).toBe(true);

    service.clearVerification();

    expect(sessionStorage.getItem(AGE_VERIFICATION_KEY)).toBeNull();
    expect(service.isVerified()).toBe(false);
  });

  it('persists the pending destination only for the current tab session', () => {
    service.rememberDestination('/events?category=live-music#upcoming');

    expect(service.getPendingDestination()).toBe('/events?category=live-music#upcoming');
    expect(sessionStorage.getItem(AGE_VERIFICATION_DESTINATION_KEY)).toBe(
      '/events?category=live-music#upcoming',
    );

    service.clearPendingDestination();
    expect(service.getPendingDestination()).toBeNull();
  });

  it('fails closed when session storage cannot be accessed', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });

    expect(service.isVerified()).toBe(false);
    expect(() => service.verify()).not.toThrow();
    expect(() => service.clearVerification()).not.toThrow();
  });
});
