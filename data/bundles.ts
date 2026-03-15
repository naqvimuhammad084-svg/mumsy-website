export type Bundle = {
  id: string;
  name: string;
  description: string;
  price: number;
  savingsLabel: string;
  includedProducts: string[];
};

export const bundles: Bundle[] = [
  {
    id: 'daily-comfort-bundle',
    name: 'Daily Comfort Bundle',
    description:
      'Your everyday intimate-care ritual for feeling fresh, comfortable, and confident.',
    price: 89,
    savingsLabel: 'Save 15%',
    includedProducts: ['intimate-whitening-cream']
  },
  {
    id: 'smooth-shave-bundle',
    name: 'Smooth Shave Bundle',
    description:
      'For soft, comfortable shaves around the bikini area with less dryness and discomfort.',
    price: 79,
    savingsLabel: 'Save 12%',
    includedProducts: ['intimate-whitening-cream']
  },
  {
    id: 'menopause-bundle',
    name: 'Menopause Support Bundle',
    description:
      'Gentle, soothing care created to support intimate comfort through hormonal changes.',
    price: 99,
    savingsLabel: 'Save 18%',
    includedProducts: ['intimate-whitening-cream']
  },
  {
    id: 'tightening-bundle',
    name: 'Tightening Confidence Bundle',
    description:
      'Paired formulas designed to help you feel firm, toned, and confident.',
    price: 95,
    savingsLabel: 'Save 15%',
    includedProducts: ['intimate-whitening-cream']
  },
  {
    id: 'whitening-bundle',
    name: 'Radiant Whitening Bundle',
    description:
      'A focused brightening routine for a more even-looking intimate skin tone.',
    price: 92,
    savingsLabel: 'Save 16%',
    includedProducts: ['intimate-whitening-cream']
  }
];

