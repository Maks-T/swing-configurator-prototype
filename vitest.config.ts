import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@calculation', replacement: path.resolve(__dirname, './calculation') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  test: {
    include: ['src/**/*.test.ts', 'calculation/**/*.test.ts'],
  },
});
