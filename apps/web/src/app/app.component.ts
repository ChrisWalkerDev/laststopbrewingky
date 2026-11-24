import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './core/layout/site-footer.component';
import { SiteHeader } from './core/layout/site-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SiteFooter, SiteHeader],
  selector: 'lsb-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {}
