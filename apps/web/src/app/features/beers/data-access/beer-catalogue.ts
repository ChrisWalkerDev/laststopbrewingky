export interface BeerSummary {
  readonly slug: string;
  readonly name: string;
  readonly style: string;
  readonly description?: string;
  readonly status: string;
  readonly abv?: string;
  readonly ibu?: string;
  readonly image?: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
}

export const beerCatalogue: readonly BeerSummary[] = [
  {
    slug: 'slightbuzz',
    name: 'Slightbuzz',
    style: 'Light Lager',
    status: 'Available Year Round',
    abv: '4.3%',
    ibu: '10',
    image: {
      src: '/images/beer/slightbuzz-20261124.webp',
      alt: 'A glass of Slightbuzz light lager in front of brewing tanks',
      objectPosition: 'center',
    },
  },
];
