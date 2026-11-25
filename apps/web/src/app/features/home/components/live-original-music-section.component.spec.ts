import { TestBed } from '@angular/core/testing';
import { LiveOriginalMusicSection } from './live-original-music-section.component';

describe('LiveOriginalMusicSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveOriginalMusicSection],
    }).compileComponents();
  });

  it('promotes recurring live original music without unconfirmed event details', async () => {
    const fixture = TestBed.createComponent(LiveOriginalMusicSection);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const text = root.textContent ?? '';

    expect(root.querySelector('h2')?.textContent).toContain(
      'Saturday Nights. Live Original Music.',
    );
    expect(text).toContain('Every Saturday Night');
    expect(text).toContain('Last Stop Brewing');
    expect(text).toContain('performing their own music');
    expect(root.querySelector('.live-music__stage figcaption')?.textContent).toContain(
      'Live performance photography coming soon',
    );
    expect(root.querySelector('.live-music__details')).toBeNull();
  });
});
