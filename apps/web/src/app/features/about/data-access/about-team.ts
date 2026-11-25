export type TeamMemberRole = 'Owner' | 'General Manager' | 'Brewer';

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: TeamMemberRole;
  readonly portrait?: {
    readonly src: string;
    readonly alt: string;
    readonly objectPosition?: string;
  };
}

export const owners = [
  {
    id: 'jon-fee',
    name: 'Jon Fee',
    role: 'Owner',
    portrait: {
      src: '/images/about/jon-fee-20261124.webp',
      alt: 'Jon Fee, co-owner of Last Stop Brewing',
      objectPosition: 'center',
    },
  },
  {
    id: 'mike-sims',
    name: 'Mike Sims',
    role: 'Owner',
    portrait: {
      src: '/images/about/mike-sims-20261124.webp',
      alt: 'Mike Sims, co-owner of Last Stop Brewing',
      objectPosition: '65% center',
    },
  },
  {
    id: 'hunter-monarch',
    name: 'Hunter Monarch',
    role: 'Owner',
    portrait: {
      src: '/images/about/hunter-monarch-20261124.webp',
      alt: 'Hunter Monarch, co-owner of Last Stop Brewing',
      objectPosition: 'center 35%',
    },
  },
  {
    id: 'erin-pippin',
    name: 'Erin Pippin',
    role: 'Owner',
    portrait: {
      src: '/images/about/erin-pippin.webp',
      alt: 'Erin Pippin, co-owner of Last Stop Brewing',
      objectPosition: 'center 30%',
    },
  },
] as const satisfies readonly TeamMember[];

export const breweryTeam = [
  { id: 'cessaine-lee', name: 'Cessaine Lee', role: 'General Manager' },
  {
    id: 'hunter-freeman',
    name: 'Hunter Freeman',
    role: 'Brewer',
    portrait: {
      src: '/images/about/hunter-freeman-20261124.webp',
      alt: 'Hunter Freeman, brewer at Last Stop Brewing',
      objectPosition: 'center',
    },
  },
] as const satisfies readonly TeamMember[];
