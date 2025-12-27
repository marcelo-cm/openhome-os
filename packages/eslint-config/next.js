import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'typescript-eslint': tseslint,
      'unused-imports': unusedImports,
      '@tanstack/query': tanstackQuery,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...tanstackQuery.configs['flat/recommended'].rules,
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'error',
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      // Disable image optimization warnings
      '@next/next/no-img-element': 'off',
    },
  },
  // TanStack Query rules
];
