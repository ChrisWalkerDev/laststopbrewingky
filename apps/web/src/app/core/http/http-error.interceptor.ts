import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppHttpError } from './http-error';

function userMessage(status: number): string {
  if (status === 0) {
    return 'The service could not be reached. Check your connection and try again.';
  }
  if (status === 401) {
    return 'Your session is no longer valid. Sign in again to continue.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (status === 404) {
    return 'The requested resource was not found.';
  }
  if (status === 429) {
    return 'Too many requests were made. Wait a moment and try again.';
  }
  return status >= 500
    ? 'The service is temporarily unavailable. Try again later.'
    : 'The request could not be completed.';
}

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      return throwError(
        () =>
          new AppHttpError({
            status: error.status,
            message: userMessage(error.status),
            retryable: error.status === 0 || error.status === 429 || error.status >= 500,
          }),
      );
    }),
  );
