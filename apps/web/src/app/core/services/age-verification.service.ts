import { Injectable } from '@angular/core';

export const AGE_VERIFICATION_KEY = 'lastStopAgeVerified';
export const AGE_VERIFICATION_DESTINATION_KEY = 'lastStopAgeVerificationDestination';

@Injectable({ providedIn: 'root' })
export class AgeVerificationService {
  isVerified(): boolean {
    return this.read(AGE_VERIFICATION_KEY) === 'true';
  }

  verify(): void {
    this.write(AGE_VERIFICATION_KEY, 'true');
  }

  clearVerification(): void {
    this.remove(AGE_VERIFICATION_KEY);
  }

  getPendingDestination(): string | null {
    return this.read(AGE_VERIFICATION_DESTINATION_KEY);
  }

  rememberDestination(destination: string): void {
    this.write(AGE_VERIFICATION_DESTINATION_KEY, destination);
  }

  clearPendingDestination(): void {
    this.remove(AGE_VERIFICATION_DESTINATION_KEY);
  }

  private read(key: string): string | null {
    try {
      return globalThis.sessionStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private write(key: string, value: string): void {
    try {
      globalThis.sessionStorage?.setItem(key, value);
    } catch {
      // The in-memory navigation flow remains available when browser storage is unavailable.
    }
  }

  private remove(key: string): void {
    try {
      globalThis.sessionStorage?.removeItem(key);
    } catch {
      // Verification is still denied when the current marker cannot be read.
    }
  }
}
