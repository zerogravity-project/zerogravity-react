import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
      passWithNoTests: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json'],
        exclude: ['node_modules/', '__tests__/', '*.config.*', 'dist/'],
      },
    },
  })
);
