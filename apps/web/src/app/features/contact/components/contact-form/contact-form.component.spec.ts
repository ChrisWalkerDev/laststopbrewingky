import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { Subject, type Observable } from 'rxjs';
import { ContactForm } from './contact-form.component';
import {
  CONTACT_SUBMISSION,
  type ContactSubmission,
  type ContactSubmissionResult,
} from '../../services/contact-submission.service';

class SubmissionStub implements ContactSubmission {
  readonly requests: unknown[] = [];
  readonly responses = new Subject<ContactSubmissionResult>();

  submit(request: unknown): Observable<ContactSubmissionResult> {
    this.requests.push(request);
    return this.responses;
  }
}

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let submission: SubmissionStub;

  beforeEach(async () => {
    submission = new SubmissionStub();
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [{ provide: CONTACT_SUBMISSION, useValue: submission }],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
  });

  it('requires valid non-whitespace fields and permits an omitted phone', () => {
    setValue('contact-first-name', '   ');
    setValue('contact-last-name', 'Smith');
    setValue('contact-email', 'invalid');
    setValue('contact-message', 'Hello');

    expect(submitButton().disabled).toBe(true);
    blur('contact-first-name');
    blur('contact-email');
    expect(textContent('form')).toContain('First name is required.');
    expect(textContent('form')).toContain('Enter an email address');

    setValue('contact-first-name', 'John');
    setValue('contact-email', 'john@example.com');
    expect(submitButton().disabled).toBe(false);
  });

  it('submits once while loading and resets only after success', async () => {
    fillValidForm();
    submitForm();
    submitForm();
    expect(submission.requests).toHaveLength(1);
    expect(submitButton().disabled).toBe(true);
    expect(submitButton().textContent).toContain('Sending');

    submission.responses.next({ success: true, message: 'Message received.' });
    submission.responses.complete();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(textContent('form')).toContain('Message received.');
    expect(input('contact-first-name').value).toBe('');
    expect(input('contact-message').value).toBe('');
  });

  it('preserves form values and displays an error after failure', async () => {
    fillValidForm();
    submitForm();
    submission.responses.error(new Error('Private provider detail'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(textContent('form')).toContain('Your message could not be sent.');
    expect(input('contact-first-name').value).toBe(' John ');
    expect(input('contact-message').value).toBe(' Hello brewery. ');
  });

  function fillValidForm(): void {
    setValue('contact-first-name', ' John ');
    setValue('contact-last-name', ' Smith ');
    setValue('contact-email', ' john@example.com ');
    setValue('contact-message', ' Hello brewery. ');
  }

  function input(id: string): HTMLInputElement | HTMLTextAreaElement {
    const element = root().querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
    if (!element) {
      throw new Error(`Missing field ${id}`);
    }
    return element;
  }

  function setValue(id: string, value: string): void {
    const element = input(id);
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function blur(id: string): void {
    input(id).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function submitButton(): HTMLButtonElement {
    return root().querySelector('button[type="submit"]') as HTMLButtonElement;
  }

  function submitForm(): void {
    root()
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
  }

  function textContent(selector: string): string {
    return (root().querySelector(selector)?.textContent ?? '').trim();
  }

  function root(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }
});
