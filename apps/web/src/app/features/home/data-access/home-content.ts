import { beerCatalogue } from '../../beers';

export const homeContent = {
  heroEyebrow: 'Kentucky craft beer · content preview',
  heroTitle: 'Make the next stop a memorable one.',
  heroDescription:
    'A distinctive brewery experience belongs here. This placeholder-ready introduction will be replaced with the brewery’s actual voice, story, and location.',
  introduction:
    'Use this space for a concise introduction to the taproom, the brewing approach, and what makes a visit worth the stop. No business claims have been invented for this preview.',
  beers: beerCatalogue,
} as const;
