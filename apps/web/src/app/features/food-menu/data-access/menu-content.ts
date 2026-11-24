export interface MenuSection {
  readonly name: string;
  readonly description: string;
  readonly items: readonly string[];
}

export const menuSections = [
  {
    name: 'Food',
    description: 'Publish the verified food menu, pricing, and ordering information here.',
    items: [
      'Menu item placeholder one',
      'Menu item placeholder two',
      'Menu item placeholder three',
    ],
  },
  {
    name: 'Drinks beyond beer',
    description: 'Add confirmed non-alcoholic, wine, spirits, or other drink offerings here.',
    items: ['Drink item placeholder one', 'Drink item placeholder two'],
  },
  {
    name: 'Dietary & allergen information',
    description:
      'Add reviewed dietary and allergen guidance here. This content should be approved by the brewery before publication.',
    items: ['Dietary information pending', 'Allergen statement pending'],
  },
] as const satisfies readonly MenuSection[];
