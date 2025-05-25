import {type Config} from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      rotate: {
        '30': '30deg',
      },
    },
  },
  plugins: [],
} satisfies Config;
