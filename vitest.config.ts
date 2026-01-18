import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '**.config.**',
        '**/types/**',
        '**/*.d.ts',
        'app/**',
        '.next/',
        '**/queryClient.ts',
        '**/ui/**',
        '**/sonner.tsx',
        '**/skeleton.tsx',
        'middleware.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 60,
        branches: 80,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
