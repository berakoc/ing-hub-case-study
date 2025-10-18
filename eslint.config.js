import { defineConfig } from 'eslint/config';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import lit from 'eslint-plugin-lit';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {},
    },

    extends: compat.extends('eslint:recommended', 'plugin:prettier/recommended'),

    plugins: {
      prettier,
      lit,
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
