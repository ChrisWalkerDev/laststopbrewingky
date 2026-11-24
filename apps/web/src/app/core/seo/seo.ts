import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';
import { APP_CONFIG } from '../config/runtime-config';

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly socialTitle?: string;
}

@Injectable({ providedIn: 'root' })
export class BreweryTitleStrategy extends TitleStrategy {
  private readonly config = inject(APP_CONFIG);
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const seo = this.activeRoute(snapshot.root).data['seo'] as PageSeo | undefined;
    if (!seo) {
      this.title.setTitle('Last Stop Brewing');
      return;
    }

    const title = `${seo.title} | Last Stop Brewing`;
    const socialTitle = seo.socialTitle ?? title;
    this.title.setTitle(title);
    this.updateMeta('name', 'description', seo.description);
    this.updateMeta('property', 'og:title', socialTitle);
    this.updateMeta('property', 'og:description', seo.description);
    this.updateMeta('property', 'og:type', 'website');
    this.updateMeta('name', 'twitter:card', 'summary_large_image');
    this.updateMeta('name', 'twitter:title', socialTitle);
    this.updateMeta('name', 'twitter:description', seo.description);
    this.updateMeta('name', 'robots', 'index, follow');
    this.updateCanonical(seo.path);
  }

  private activeRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let activeRoute = route;
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }
    return activeRoute;
  }

  private updateMeta(attribute: 'name' | 'property', name: string, content: string): void {
    this.meta.updateTag({ [attribute]: name, content });
  }

  private updateCanonical(path: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!this.config.siteUrl) {
      canonical?.remove();
      return;
    }

    if (!canonical) {
      canonical = this.document.createElement('link');
    }
    canonical.rel = 'canonical';
    canonical.href = new URL(path, this.config.siteUrl).toString();
    this.document.head.append(canonical);
  }
}
