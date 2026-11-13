import js from '@eslint/js';
import functional from 'eslint-plugin-functional';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  files: ['src/**/*.{ts,tsx}', 'calculation/**/*.ts'],
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    functional,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    curly: ['error', 'all'],
    'no-restricted-syntax': [
      'error',
      { selector: 'WhileStatement', message: 'while запрещён код-стайлом' },
      { selector: 'ForInStatement', message: 'for-in запрещён код-стайлом' },
      {
        selector: 'TSEnumDeclaration',
        message: 'enum запрещён: as const + одноимённый type',
      },
    ],
    // interface допустим только для module augmentation (Window, ImportMetaEnv, Register)
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    // Мутации разрешены только в zustand+immer сторах (через eslint-disable в шапке файла)
    'functional/immutable-data': 'off',
  },
});
