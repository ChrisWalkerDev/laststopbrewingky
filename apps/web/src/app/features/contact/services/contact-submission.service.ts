import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken, type Provider } from '@angular/core';
import { defer, delay, map, of, throwError, type Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config/runtime-config';
import { type ContactRequest } from '../models/contact.model';

export interface ContactSubmissionResult {
  readonly success: boolean;
  readonly message?: string;
}

export interface ContactSubmission {
  submit(request: ContactRequest): Observable<ContactSubmissionResult>;
}

export const CONTACT_SUBMISSION = new InjectionToken<ContactSubmission>('CONTACT_SUBMISSION');

@Injectable()
export class MockContactSubmission implements ContactSubmission {
  private readonly config = inject(APP_CONFIG);

  submit(request: ContactRequest): Observable<ContactSubmissionResult> {
    void request;
    return defer(() =>
      this.config.contact.mockFailure
        ? throwError(() => new Error('The mock contact submission failed by configuration.'))
        : of({
            success: true as const,
            message: 'Your simulated message was submitted successfully.',
          }),
    ).pipe(delay(650));
  }
}

@Injectable()
export class HttpContactSubmission implements ContactSubmission {
  private readonly config = inject(APP_CONFIG);
  private readonly http = inject(HttpClient);

  submit(request: ContactRequest): Observable<ContactSubmissionResult> {
    return this.http
      .post<unknown>(this.config.contact.endpoint, request, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status !== 200 && response.status !== 201) {
            throw new Error(`Unexpected contact API response status ${response.status}.`);
          }

          return {
            success: true as const,
            message: 'Your message was sent successfully.',
          };
        }),
      );
  }
}

export function provideContactSubmission(): Provider[] {
  return [
    MockContactSubmission,
    HttpContactSubmission,
    {
      provide: CONTACT_SUBMISSION,
      useFactory: (): ContactSubmission => {
        const config = inject(APP_CONFIG);
        return config.contact.mode === 'mock'
          ? inject(MockContactSubmission)
          : inject(HttpContactSubmission);
      },
    },
  ];
}
