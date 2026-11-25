export interface MenuItem {
  readonly name: string;
  readonly price?: string;
  readonly description?: string;
}

export interface MenuSection {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly introduction?: string;
  readonly price?: string;
  readonly items: readonly MenuItem[];
  readonly list?: readonly string[];
  readonly featured?: boolean;
}

export const menuNavigation = [
  { label: 'Starters', fragment: 'starters' },
  { label: 'Wings & Tenders', fragment: 'wings-tenders' },
  { label: 'Burgers', fragment: 'burgers' },
  { label: 'Sandwiches', fragment: 'sandwiches' },
  { label: 'Kids Menu', fragment: 'kids-menu' },
  { label: 'Cocktails', fragment: 'cocktails' },
] as const;

export const foodSections: readonly MenuSection[] = [
  {
    id: 'starters',
    name: 'Starters',
    label: 'Start here',
    items: [
      { name: 'Fried Pickles', price: '$9.99' },
      { name: 'Mozzarella Sticks', price: '$9.99' },
      { name: 'Pretzels and Beer Cheese', price: '$10.99' },
      { name: 'Tots', price: '$4.99' },
      { name: 'Fries', price: '$4.99' },
      { name: 'Sweet Potato Fries', price: '$4.99' },
      { name: 'Beer Battered Onion Rings', price: '$7.99' },
    ],
  },
  {
    id: 'wings-tenders',
    name: 'Chicken Wings',
    label: 'Choose your count',
    items: [
      { name: '6 Piece', price: '$10.99' },
      { name: '12 Piece', price: '$20.99' },
      { name: '24 Piece', price: '$40.99' },
    ],
    list: [
      'Gochu Jang',
      'Mild Buffalo',
      'Hot Buffalo',
      'Xtra Hot Buffalo',
      'Stinging Honey Garlic',
      'Caribbean Jerk',
      'Honey Mustard',
      'BBQ',
      'Carolina Gold',
    ],
  },
  {
    id: 'chicken-tenders',
    name: 'Chicken Tenders',
    label: 'Crispy & golden',
    items: [
      { name: '2 Piece with Fries', price: '$10.99' },
      { name: '4 Piece with Fries', price: '$14.99' },
    ],
  },
  {
    id: 'kids-menu',
    name: 'Kid Menu',
    label: 'For the little stop',
    price: '$9.99',
    items: [
      { name: 'Grilled Cheese with Fries' },
      { name: '2 Tenders with Fries' },
      { name: 'Cheese Burger with Fries' },
    ],
  },
  {
    id: 'burgers',
    name: 'Burgers',
    label: 'Half-pound classics',
    introduction: 'All burgers served on a toasted brioche bun with fries!',
    featured: true,
    items: [
      {
        name: 'The Smoke Wagon',
        price: '$15.99',
        description:
          'Smoky and satisfying—this ½ lb burger is stacked with bacon, American cheese, crispy onion rings, and tangy BBQ sauce.',
      },
      {
        name: 'The Classic',
        price: '$15.99',
        description:
          'Done right. A ½ lb patty with American cheese, fresh lettuce, tomato, onion, and pickles for that timeless burger flavor.',
      },
      {
        name: 'The Big Stop',
        price: '$15.99',
        description:
          'A house favorite piled high with a ½ lb patty, American cheese, sweet caramelized onions, crisp lettuce, and our signature burger sauce.',
      },
      {
        name: 'Truffle Shuffle',
        price: '$15.99',
        description:
          'Rich and earthy flavors come together with a ½ lb patty topped with sautéed mushrooms and melted Swiss cheese.',
      },
      {
        name: 'The Jalapeño Popper',
        price: '$15.99',
        description:
          'A spicy twist loaded with a ½ lb patty, jalapeño cream cheese, crispy bacon, and American cheese.',
      },
      {
        name: 'The Brew Master',
        price: '$15.99',
        description:
          'Built for beer lovers—this hearty burger features a ½ lb patty stacked with bacon, crispy tater tots, American and Swiss cheese, all smothered in beer cheese.',
      },
      {
        name: 'Fire in the Hole',
        price: '$15.99',
        description:
          'Turn up the heat with a ½ lb patty topped with jalapeños, bacon, American cheese, and a drizzle of hot honey for the perfect sweet heat.',
      },
      {
        name: 'How have you Bean?',
        price: '$15.99',
        description:
          'A savory black bean patty with a crispy outside and tender inside, stacked with classic toppings on a warm toasted bun for a satisfying meat-free bite.',
      },
    ],
  },
  {
    id: 'sandwiches',
    name: 'Other Sandwiches',
    label: 'Toasted & stacked',
    items: [
      {
        name: 'Fried or Grilled Chicken Sandwich',
        price: '$12.99',
        description: 'Crispy or grilled chicken on a toasted bun.',
      },
      {
        name: 'Fried Bologna',
        price: '$11.99',
        description: 'Crispy fried bologna on a toasted bun.',
      },
    ],
  },
] as const;

export const cocktailSection: MenuSection = {
  id: 'cocktails',
  name: 'Cocktails',
  label: 'Mixed at the stop',
  items: [
    {
      name: "Rita's Last Stop",
      price: '$12.00',
      description: 'Tequila, triple sec, and margarita mix.',
    },
    {
      name: "Selena's Long Island Iced Tea",
      price: '$13.00',
      description:
        'A mixture of our house gin, vodka, tequila, triple sec and rum mixed with sour and coke.',
    },
    { name: 'Espresso Martini', price: '$11.00' },
    { name: 'Lemon Drop Martini', price: '$11.00' },
    { name: 'Mimosa', price: '$8.00' },
    { name: 'Last Stop G&T', price: '$11.00' },
    {
      name: "LJ's Old Fashioned",
      price: '$13.00',
      description: 'Crafted in memory of LJ with Buffalo Trace Bourbon.',
    },
    { name: 'Last Stop Vodka Cran', price: '$9.50' },
    {
      name: 'Last Stop Sangria',
      price: '$9.00',
      description: 'Made in house with our own recipe.',
    },
    {
      name: 'Last Stop Staplegun',
      price: '$10.00',
      description: 'Features Buffalo Trace bourbon & pineapple sour.',
    },
    { name: 'Last Stop Bloody Mary', price: '$10.00' },
    {
      name: 'Bloody Beer',
      price: '$8.50',
      description: 'Choice of Light beer and Bloody Mary mix.',
    },
    { name: 'Kentucky Mule', price: '$9.00' },
    {
      name: 'The "Mandy"',
      price: '$9.50',
      description: "Ha'pennyh Rhubarb Gin, sprite, and a lime.",
    },
    {
      name: 'Smor-Tini',
      price: '$11.00',
      description:
        'Mash & Mellow bourbon chilled with bourbon cream. Garnished with graham cracker rim, chocolate and a freshly toasted marshmallow.',
    },
    { name: 'The Don', price: '$6.50', description: 'Benchmark bourbon and Coke.' },
  ],
} as const;
