import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffe6ed',
          200: '#ffc1d3',
          300: '#ff8fb3',
          400: '#ff5c96',
          500: '#ff2a78',
          600: '#d4135b',
          700: '#a40c45',
          800: '#710730',
          900: '#42021a'
        }
      }
    }
  },
  plugins: []
};

export default config;
