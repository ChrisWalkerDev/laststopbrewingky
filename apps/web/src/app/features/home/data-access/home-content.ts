import { beerCatalogue } from '../../beers';

export const homeContent = {
  heroEyebrow: 'Shelbyville, Kentucky Craft Beer',
  heroTitle: 'Make your last stop a memorable one.',
  heroDescription:
    'A distinctive brewery experience belongs here. This placeholder-ready introduction will be replaced with the brewery’s actual voice, story, and location.',
  heroImage: {
    src: '/images/home/atmosphere-20261124.webp',
    alt: 'Colorful artwork displayed inside Last Stop Brewing',
  },
  introduction:
    'Use this space for a concise introduction to the taproom, the brewing approach, and what makes a visit worth the stop. No business claims have been invented for this preview.',
  beers: beerCatalogue,
  atmosphereImage: {
    src: '/images/home/atmosphere-food-20261124.webp',
    alt: 'Colorful character artwork displayed on a wall at Last Stop Brewing',
  },
} as const;
