/** @type {import('@types/prettier').Config} */
export default {
  arrowParens: 'avoid',
  bracketSpacing: false,
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 100,
  singleQuote: true,
  tailwindFunctions: ['twJoin', 'twMerge'],
};
