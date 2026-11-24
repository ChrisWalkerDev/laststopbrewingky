import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-cta-panel',
  imports: [RouterLink],
  templateUrl: './cta-panel.component.html',
  styleUrl: './cta-panel.component.scss',
})
export class CtaPanel {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly link = input.required<string>();
  readonly linkLabel = input.required<string>();
}
