import {builtinModules} from 'node:module';

import pluginJs from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import {configs as tseslintConfigs} from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // eslint recommended JS config
  pluginJs.configs.recommended,

  // typescript
  ...tseslintConfigs.recommended,
  ...tseslintConfigs.stylistic,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      'no-var': 'off',
    },
  },
  {
    files: ['.react-router/**/*.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },

  // import and import sorting
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  {
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // side effect imports
            ['^\\u0000'],
            // Node.js builtins (sorting those prefixed with `node:` first).
            ['^node:', `^(${builtinModules.join('|')})(/.*|$)`],
            // npm packages, things that start with a letter (or digit or underscore), or `@` followed by a letter.
            // react sorted first
            ['^react', '^@?\\w'],
            // absolute imports such as our `~/foo` style imports,
            // followed by relative imports (sorted ../../../ before ../../ before ./)
            [
              '^',
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
          ],
        },
      ],
    },
  },

  // a11y for jsx
  pluginJsxA11y.flatConfigs.recommended,

  // react recommended + jsx-runtime
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginReact.configs.flat['jsx-runtime'],

  // react compiler
  {
    plugins: {
      'react-compiler': pluginReactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },

  // react hooks (hooked up manually because it doesn't natively support ESLint 9)
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },

  // included files, excluded files, and globals
  {
    ignores: [
      '**/.cache',
      '**/.yarn',
      '**/dist',
      '**/coverage',
      '**/node_modules',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {languageOptions: {globals: globals.browser}},

  // cjs
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // prettier goes last so it can override other rules
  configPrettier,
];
