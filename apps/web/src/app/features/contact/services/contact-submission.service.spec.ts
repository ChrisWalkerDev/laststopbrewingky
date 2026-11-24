import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { APP_CONFIG, type RuntimeConfig } from '../../../core/config/runtime-config';
import {
  CONTACT_SUBMISSION,
  HttpContactSubmission,
  MockContactSubmission,
  provideContactSubmission,
} from './contact-submission.service';
import { type ContactRequest } from '../models/contact.model';

const request: ContactRequest = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com',
  message: 'Hello brewery.',
};

function runtimeConfig(
  environment: RuntimeConfig['environment'],
  mode: RuntimeConfig['contact']['mode'],
  endpoint = '',
): RuntimeConfig {
  return {
    apiBaseUrl: '/api',
    environment,
    contact: { mode, endpoint },
  };
}

describe('contact submission provider', () => {
  it.each([
    ['local' as const, 'mock' as const, MockContactSubmission],
    ['production' as const, 'http' as const, HttpContactSubmission],
  ])('selects the configured %s implementation', (environment, mode, implementation) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: APP_CONFIG,
          useValue: runtimeConfig(
            environment,
            mode,
            mode === 'http' ? 'https://api.example.test/contact' : '',
          ),
        },
        ...provideContactSubmission(),
      ],
    });

    expect(TestBed.inject(CONTACT_SUBMISSION)).toBeInstanceOf(implementation);
  });
});

describe('MockContactSubmission', () => {
  it('completes asynchronously without an HTTP request', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: runtimeConfig('local', 'mock') },
        MockContactSubmission,
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const startedAt = performance.now();

    await expect(
      firstValueFrom(TestBed.inject(MockContactSubmission).submit(request)),
    ).resolves.toEqual({
      success: true,
      message: 'Your simulated message was submitted successfully.',
    });

    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(600);
    http.expectNone(() => true);
    http.verify();
  });

  it('supports a controlled failure', async () => {
    const config = runtimeConfig('local', 'mock');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG,
          useValue: { ...config, contact: { ...config.contact, mockFailure: true } },
        },
        MockContactSubmission,
      ],
    });

    await expect(
      firstValueFrom(TestBed.inject(MockContactSubmission).submit(request)),
    ).rejects.toThrow('mock contact submission failed');
  });
});

describe('HttpContactSubmission', () => {
  it.each([200, 201])('posts the exact payload and accepts HTTP %i', async (status) => {
    const endpoint = 'https://external.example.test/contact';
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: runtimeConfig('production', 'http', endpoint) },
        HttpContactSubmission,
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const resultPromise = firstValueFrom(TestBed.inject(HttpContactSubmission).submit(request));

    const pending = http.expectOne(endpoint);
    expect(pending.request.method).toBe('POST');
    expect(pending.request.body).toEqual(request);
    expect(pending.request.withCredentials).toBe(false);
    pending.flush(null, { status, statusText: status === 200 ? 'OK' : 'Created' });

    await expect(resultPromise).resolves.toEqual({
      success: true,
      message: 'Your message was sent successfully.',
    });
    http.verify();
  });

  it('propagates HTTP and network failures', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: APP_CONFIG,
          useValue: runtimeConfig('production', 'http', 'https://external.example.test/contact'),
        },
        HttpContactSubmission,
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(HttpContactSubmission);

    const httpResult = firstValueFrom(service.submit(request));
    http
      .expectOne('https://external.example.test/contact')
      .flush({}, { status: 503, statusText: 'Unavailable' });
    await expect(httpResult).rejects.toBeDefined();

    const networkResult = firstValueFrom(service.submit(request));
    http
      .expectOne('https://external.example.test/contact')
      .error(new ProgressEvent('network failure'));
    await expect(networkResult).rejects.toBeDefined();
    http.verify();
  });
});
