import {type Config} from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      rotate: {
        '30': '30deg',
      },
      fontFamily: {
        luckiest: ['"Luckiest Guy"', 'cursive'],
        comfortaa: ['Comfortaa', 'sans-serif'],
        baloo2: ['"Baloo 2"', 'cursive'],
        lexend: ['Lexend', 'sans-serif'],
      },
      colors: {
        brown: {
          DEFAULT: '#8b7355',
        },
        blue: {
          DEFAULT: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
