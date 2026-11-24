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
  { id: 'jon-fee', name: 'Jon Fee', role: 'Owner' },
  { id: 'mike-sims', name: 'Mike Sims', role: 'Owner' },
  { id: 'hunter-monarch', name: 'Hunter Monarch', role: 'Owner' },
  { id: 'erin-pippin', name: 'Erin Pippin', role: 'Owner' },
] as const satisfies readonly TeamMember[];

export const breweryTeam = [
  { id: 'cessaine-lee', name: 'Cessaine Lee', role: 'General Manager' },
  { id: 'hunter-freeman', name: 'Hunter Freeman', role: 'Brewer' },
] as const satisfies readonly TeamMember[];
