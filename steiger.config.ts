import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['./src/app/providers/**', './src/app/gates/**'],
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    //todo: remove this rule after
    files: ['./src/entities/**', './src/widgets/**', './src/features/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    // pluralize ложно считает "canvas" plural от "canva"
    files: ['./src/**/canvas/**'],
    rules: {
      'fsd/inconsistent-naming': 'off',
    },
  },
]);
