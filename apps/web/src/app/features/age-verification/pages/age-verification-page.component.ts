import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AGE_VERIFICATION_RETURN_URL_STATE_KEY,
  isSafeAgeVerificationDestination,
} from '../../../core/guards/age-verification.guard';
import { AgeVerificationService } from '../../../core/services/age-verification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-age-verification-page',
  templateUrl: './age-verification-page.component.html',
  styleUrl: './age-verification-page.component.scss',
})
export class AgeVerificationPage {
  private readonly router = inject(Router);
  private readonly verification = inject(AgeVerificationService);
  private readonly navigationDestination = this.readNavigationDestination();

  protected readonly rejected = signal(false);

  protected confirmAge(): void {
    this.verification.verify();
    const destination = this.navigationDestination ?? this.verification.getPendingDestination();
    this.verification.clearPendingDestination();

    const safeDestination =
      destination && isSafeAgeVerificationDestination(destination) ? destination : '/';

    void this.router.navigateByUrl(safeDestination, { replaceUrl: true });
  }

  protected rejectAge(): void {
    this.verification.clearVerification();
    this.rejected.set(true);
  }

  private readNavigationDestination(): string | null {
    const navigationState: unknown = this.router.currentNavigation()?.extras.state;
    if (typeof navigationState !== 'object' || navigationState === null) {
      return null;
    }

    const destination = (navigationState as Record<string, unknown>)[
      AGE_VERIFICATION_RETURN_URL_STATE_KEY
    ];

    return typeof destination === 'string' && isSafeAgeVerificationDestination(destination)
      ? destination
      : null;
  }
}
