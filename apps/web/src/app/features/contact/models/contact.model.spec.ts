import { FormControl } from '@angular/forms';
import {
  CONTACT_FIELD_LIMITS,
  contactValidators,
  createContactRequest,
  nonWhitespaceValidator,
} from './contact.model';

describe('contact model', () => {
  it('trims and allowlists the expected request payload', () => {
    const input = {
      firstName: ' John ',
      lastName: ' Smith ',
      email: ' john@example.com ',
      phone: ' 5551234567 ',
      message: ' Hello brewery. ',
      unexpected: 'must not be submitted',
    };

    expect(createContactRequest(input as Parameters<typeof createContactRequest>[0])).toEqual({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      phone: '5551234567',
      message: 'Hello brewery.',
    });
  });

  it('omits an empty optional phone number', () => {
    expect(
      createContactRequest({
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '   ',
        message: 'Hello',
      }),
    ).toEqual({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      message: 'Hello',
    });
  });

  it('rejects whitespace-only required input', () => {
    expect(nonWhitespaceValidator(new FormControl('   '))).toEqual({ required: true });
    expect(() =>
      createContactRequest({
        firstName: ' ',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '',
        message: 'Hello',
      }),
    ).toThrow();
  });

  it.each(['not-an-email', 'name@', '@example.com'])('rejects invalid email %s', (email) => {
    const control = new FormControl(email, contactValidators('email'));
    expect(control.hasError('email')).toBe(true);
  });

  it('validates phone format and field limits', () => {
    const phone = new FormControl('letters', contactValidators('phone'));
    expect(phone.hasError('pattern')).toBe(true);

    const message = new FormControl(
      'a'.repeat(CONTACT_FIELD_LIMITS.message + 1),
      contactValidators('message'),
    );
    expect(message.hasError('maxlength')).toBe(true);
  });
});
