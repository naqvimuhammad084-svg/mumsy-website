export type Product = {
  id: string;
  name: string;
  shortBenefit: string;
  description: string;
  price: number;
  image: string;
  category: 'intimate' | 'shave' | 'comfort' | 'treatment';
  benefits: string[];
  howToUse: string[];
  ingredients: string[];
  faqs: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    id: 'intimate-whitening-cream',
    name: 'Intimate Whitening & Brightening Cream',
    shortBenefit: 'Gently brightens and evens intimate skin tone.',
    description:
      'A gentle, pH-balanced cream formulated for the vulva (outer area only) to help visibly brighten, even out tone, and deeply moisturize while respecting sensitive skin.',
    price: 49.0,
    image: '/assets/unnamed.jpg',
    category: 'intimate',
    benefits: [
      'Helps reduce the look of darkness and uneven tone over time.',
      'Supports a healthy skin barrier with hydrating ingredients.',
      'Suitable for sensitive intimate skin on the external area only.',
      'Non-sticky, quick-absorbing texture for daily comfort.'
    ],
    howToUse: [
      'Start with clean, dry skin.',
      'Apply a pea-sized amount to the outer intimate area only (vulva).',
      'Massage gently until fully absorbed.',
      'Use consistently, once or twice a day as preferred.',
      'Avoid using on broken, irritated, or internal skin.'
    ],
    ingredients: [
      'Aloe Vera',
      'Vitamin B5 (Panthenol)',
      'Niacinamide',
      'Soothing botanical extracts',
      'Moisturizing emollients',
      'Free from harsh bleaching agents'
    ],
    faqs: [
      {
        question: 'Is this safe for sensitive skin?',
        answer:
          'Yes, the formula is designed for the external intimate area and is suitable for most sensitive skin types. As with any new product, we recommend a small patch test first.'
      },
      {
        question: 'How long until I see results?',
        answer:
          'Results vary from person to person. Many users notice a more even look in 4–8 weeks with consistent use.'
      },
      {
        question: 'Can I use this during pregnancy or postpartum?',
        answer:
          'Many customers use gentle intimate-care products postpartum. However, if you are pregnant, breastfeeding, or under medical care, please check with your healthcare provider first.'
      }
    ]
  }
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id) ?? null;
}

