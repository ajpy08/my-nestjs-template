// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      camelcase: ['error', { ignoreImports: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      eqeqeq: ['error', 'always'],
      'max-depth': ['error', { max: 3 }],
      'max-len': ['error', { code: 120, tabWidth: 2 }],
      'max-lines-per-function': ['error', { max: 65, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['error', 3],
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
      'no-console': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-eq-null': 'error',
      'no-magic-numbers': [
        'error',
        { ignore: [1], ignoreArrayIndexes: true, ignoreDefaultValues: true, detectObjects: true },
      ],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      indent: ['error', 2, { SwitchCase: 1, ignoredNodes: ['PropertyDefinition'] }],
      semi: 'error',
      quotes: ['error', 'single'],
      'no-use-before-define': 'error',
      'no-var': 'error',
      'arrow-parens': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf',
        },
      ],
    },
  },
);