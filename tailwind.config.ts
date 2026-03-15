import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        mumsy: {
          purple: '#5B2C83',
          lavender: '#D6C4F3',
          soft: '#F7F3FF',
          dark: '#2B123F'
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 45px rgba(48, 10, 80, 0.18)'
      },
      borderRadius: {
        xl: '1.25rem',
        '3xl': '2rem'
      }
    }
  },
  plugins: []
};

export default config;

