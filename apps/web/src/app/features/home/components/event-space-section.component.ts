import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-event-space-section',
  imports: [RouterLink],
  templateUrl: './event-space-section.component.html',
  styleUrl: './event-space-section.component.scss',
})
export class EventSpaceSection {}
