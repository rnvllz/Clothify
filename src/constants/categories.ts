export const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Accessories',
  'Shoes',
  'Activewear',
  'Loungewear',
] as const;

export type Category = typeof CATEGORIES[number];
