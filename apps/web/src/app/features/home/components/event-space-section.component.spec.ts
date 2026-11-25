import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { EventSpaceSection } from './event-space-section.component';

@Component({
  template: '',
})
class ContactRouteStub {}

describe('EventSpaceSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSpaceSection],
      providers: [provideRouter([{ path: 'contact', component: ContactRouteStub }])],
    }).compileComponents();
  });

  it('presents confirmed event space options without an implied venue image', async () => {
    const fixture = TestBed.createComponent(EventSpaceSection);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const features = Array.from(root.querySelectorAll('.event-space__feature')).map((feature) =>
      feature.textContent?.trim(),
    );

    expect(root.querySelector('h2')?.textContent?.trim()).toBe('Celebrate Upstairs at Last Stop');
    expect(features).toHaveLength(3);
    expect(root.textContent).toContain('In-house Catering:');
    expect(root.textContent).toContain('Outside Catering:');
    expect(root.textContent).toContain('optional addition');
    expect(root.querySelector('.event-space__photo-note')?.textContent?.trim()).toBe(
      'Upstairs event space photography needed',
    );
    expect(root.querySelector('img')).toBeNull();
  });

  it('navigates the enquiry call to action to the contact page', async () => {
    const fixture = TestBed.createComponent(EventSpaceSection);
    const router = TestBed.inject(Router);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      '.event-space__cta a',
    );

    expect(link?.textContent?.trim()).toBe('Enquire About Our Event Space');
    expect(link?.getAttribute('href')).toBe('/contact');

    link?.click();
    await fixture.whenStable();

    expect(router.url).toBe('/contact');
  });
});
