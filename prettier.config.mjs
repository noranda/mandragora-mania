/** @type {import('@types/prettier').Config} */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  bracketSpacing: false,
  arrowParens: 'avoid',
  tailwindFunctions: ['twJoin', 'twMerge'],
};
