import {
  type ValidationErrors,
  type AbstractControl,
  type ValidatorFn,
  Validators,
} from '@angular/forms';

export const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'message'] as const;
export const ALLOWED_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'message'] as const;

export type ContactField = (typeof ALLOWED_FIELDS)[number];

export interface ContactRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone?: string;
  readonly message: string;
}

export type ContactFormValue = Record<ContactField, string>;

export const CONTACT_FIELD_LIMITS = {
  firstName: 50,
  lastName: 50,
  email: 254,
  phone: 30,
  message: 2000,
} as const satisfies Record<ContactField, number>;

export function nonWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string' && control.value.trim().length === 0) {
    return { required: true };
  }
  return null;
}

export function contactValidators(field: ContactField): ValidatorFn[] {
  const validators: ValidatorFn[] = [Validators.maxLength(CONTACT_FIELD_LIMITS[field])];

  if ((REQUIRED_FIELDS as readonly string[]).includes(field)) {
    validators.push(
      (control) => Validators.required(control),
      (control) => nonWhitespaceValidator(control),
    );
  }
  if (field === 'email') {
    validators.push((control) => Validators.email(control));
  }
  if (field === 'phone') {
    validators.push(Validators.pattern(/^\+?[0-9\s().-]{7,30}$/));
  }

  return validators;
}

export function createContactRequest(value: ContactFormValue): ContactRequest {
  const allowedValues = Object.fromEntries(
    ALLOWED_FIELDS.map((field) => [field, value[field].trim()]),
  ) as ContactFormValue;

  for (const field of REQUIRED_FIELDS) {
    if (allowedValues[field].length === 0) {
      throw new Error(`${field} is required.`);
    }
  }

  return {
    firstName: allowedValues.firstName,
    lastName: allowedValues.lastName,
    email: allowedValues.email,
    ...(allowedValues.phone ? { phone: allowedValues.phone } : {}),
    message: allowedValues.message,
  };
}
