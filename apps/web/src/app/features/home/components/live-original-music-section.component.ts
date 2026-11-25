import { ChangeDetectionStrategy, Component } from '@angular/core';

interface LiveOriginalMusicContent {
  readonly titleLead: string;
  readonly titleStatement: string;
  readonly intro: string;
  readonly schedule: string;
  readonly closing: string;
  readonly photo?: {
    readonly src: string;
    readonly alt: string;
  };
  readonly performers?: readonly string[];
  readonly performanceTime?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-live-original-music-section',
  templateUrl: './live-original-music-section.component.html',
  styleUrl: './live-original-music-section.component.scss',
})
export class LiveOriginalMusicSection {
  protected readonly event: LiveOriginalMusicContent = {
    titleLead: 'Saturday Nights.',
    titleStatement: 'Live Original Music.',
    intro:
      'Make your Saturday nights a little more memorable at Last Stop Brewing. Join us every Saturday for live original music, great atmosphere, and a chance to discover talented musicians performing their own music.',
    schedule: 'Every Saturday Night',
    closing:
      'Come along for an evening of original performances and the welcoming atmosphere of Last Stop Brewing.',
  };
}
