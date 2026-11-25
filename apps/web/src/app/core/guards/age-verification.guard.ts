import { inject } from '@angular/core';
import { type CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AgeVerificationService } from '../services/age-verification.service';

export const AGE_VERIFICATION_RETURN_URL_STATE_KEY = 'returnUrl';

export function isSafeAgeVerificationDestination(destination: string): boolean {
  const hasControlCharacter = Array.from(destination).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });

  if (
    !destination.startsWith('/') ||
    destination.startsWith('//') ||
    destination.includes('\\') ||
    hasControlCharacter
  ) {
    return false;
  }

  try {
    const tree = new URL(destination, 'https://laststopbrewing.invalid');
    return (
      tree.origin === 'https://laststopbrewing.invalid' &&
      tree.pathname !== '/age-verification' &&
      !tree.pathname.startsWith('/age-verification/')
    );
  } catch {
    return false;
  }
}

export const ageVerificationGuard: CanActivateFn = (_route, state) => {
  const verification = inject(AgeVerificationService);
  const router = inject(Router);

  if (verification.isVerified()) {
    return true;
  }

  const destination = isSafeAgeVerificationDestination(state.url) ? state.url : '/';
  verification.rememberDestination(destination);

  return new RedirectCommand(router.createUrlTree(['/age-verification']), {
    state: {
      [AGE_VERIFICATION_RETURN_URL_STATE_KEY]: destination,
    },
  });
};
