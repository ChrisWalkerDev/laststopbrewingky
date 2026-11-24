import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/components/page-hero.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'lsb-not-found-page',
  imports: [PageHero, RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPage {}
