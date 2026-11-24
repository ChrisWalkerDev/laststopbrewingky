import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, type FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AppHttpError } from '../../../../core/http/http-error';
import {
  CONTACT_FIELD_LIMITS,
  type ContactField,
  contactValidators,
  createContactRequest,
} from '../../models/contact.model';
import { CONTACT_SUBMISSION } from '../../services/contact-submission.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly submission = inject(CONTACT_SUBMISSION);

  protected readonly limits = CONTACT_FIELD_LIMITS;
  protected readonly submitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: this.createControl('firstName'),
    lastName: this.createControl('lastName'),
    email: this.createControl('email'),
    phone: this.createControl('phone'),
    message: this.createControl('message'),
  });

  protected hasError(field: ContactField): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  protected fieldError(field: ContactField): string {
    const control = this.form.controls[field];
    const label =
      field === 'firstName'
        ? 'First name'
        : field === 'lastName'
          ? 'Last name'
          : field[0].toUpperCase() + field.slice(1);

    if (control.hasError('required')) {
      return `${label} is required.`;
    }
    if (control.hasError('email')) {
      return 'Enter an email address in the format name@example.com.';
    }
    if (control.hasError('pattern')) {
      return 'Enter a valid phone number using digits and common phone punctuation.';
    }
    if (control.hasError('maxlength')) {
      return `${label} must be ${CONTACT_FIELD_LIMITS[field]} characters or fewer.`;
    }
    return '';
  }

  protected async submit(): Promise<void> {
    if (this.submitting()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const result = await firstValueFrom(
        this.submission.submit(createContactRequest(this.form.getRawValue())),
      );
      if (!result.success) {
        this.errorMessage.set(
          result.message || 'Your message could not be sent. Please try again.',
        );
        return;
      }

      this.form.reset();
      this.successMessage.set(
        result.message || 'Your message was sent. Thank you for contacting the brewery.',
      );
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof AppHttpError
          ? error.message
          : 'Your message could not be sent. Please try again.',
      );
    } finally {
      this.submitting.set(false);
    }
  }

  private createControl(field: ContactField): FormControl<string> {
    return this.formBuilder.nonNullable.control('', contactValidators(field));
  }
}
