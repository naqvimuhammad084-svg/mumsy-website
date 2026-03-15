export type StaticRange = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
};

export const defaultRanges: StaticRange[] = [
  {
    id: 'vintima-default',
    name: 'VINTIMA',
    slug: 'vintima',
    logo_url: '/vintima-logo.png',
    description: 'Premium intimate care range.'
  }
];
