export interface BeerSummary {
  readonly slug: string;
  readonly name: string;
  readonly style: string;
  readonly description: string;
  readonly status: string;
  readonly abv?: string;
  readonly ibu?: string;
}

export const beerCatalogue: readonly BeerSummary[] = [
  {
    slug: 'featured-beer-placeholder-one',
    name: 'Featured Beer One',
    style: 'Beer style placeholder',
    description:
      'A factual tasting description, availability, and brewing details can replace this placeholder.',
    status: 'Availability placeholder',
    abv: 'ABV pending',
    ibu: 'IBU pending',
  },
  {
    slug: 'featured-beer-placeholder-two',
    name: 'Featured Beer Two',
    style: 'Beer style placeholder',
    description:
      'Add verified tasting notes and the story behind the beer when brewery content is available.',
    status: 'Seasonal status pending',
  },
  {
    slug: 'featured-beer-placeholder-three',
    name: 'Featured Beer Three',
    style: 'Beer style placeholder',
    description:
      'Reserve this card for a house favourite or an upcoming release once the details are supplied.',
    status: 'On-tap status pending',
  },
];
