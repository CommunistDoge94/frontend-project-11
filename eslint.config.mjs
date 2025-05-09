import js from '@eslint/js';
import globals from 'globals';
import pluginImport from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      import: pluginImport
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'quote-props': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'dot-notation': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error', 
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always'
        }
      ]
    }
  }
], {
  ignores: [
    'dist/',
    '*.config.js',
    '*.config.mjs',
  ]
});
