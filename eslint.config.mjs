import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
    },
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/order': 'off',
      'simple-import-sort/imports': 'off',
      'simple-import-sort/exports': 'off',
    },
  }),
];

export default eslintConfig;
