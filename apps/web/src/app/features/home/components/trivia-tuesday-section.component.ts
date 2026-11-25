import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-trivia-tuesday-section',
  templateUrl: './trivia-tuesday-section.component.html',
  styleUrl: './trivia-tuesday-section.component.scss',
})
export class TriviaTuesdaySection {}
