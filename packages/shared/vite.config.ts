import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.wgsl', '**/*.vert', '**/*.frag', '**/*.vs', '**/*.fs'],
      exclude: undefined,
      warnDuplicatedImports: true,
      defaultExtension: 'glsl',
      watch: true,
      root: '/',
    }),
  ],
  build: {
    lib: {
      entry: {
        'entities/emotion/index': path.resolve(__dirname, 'entities/emotion/index.ts'),
        'components/ui/clock/index': path.resolve(__dirname, 'components/ui/clock/index.ts'),
        'components/ui/emotion/scene/index': path.resolve(__dirname, 'components/ui/emotion/scene/index.ts'),
        'components/ui/emotion/scene-lazy/index': path.resolve(__dirname, 'components/ui/emotion/scene-lazy/index.ts'),
        'components/ui/emotion/decorations/index': path.resolve(
          __dirname,
          'components/ui/emotion/decorations/index.ts'
        ),
        'components/ui/emotion/null/index': path.resolve(__dirname, 'components/ui/emotion/null/index.ts'),
        'components/ui/footer/index': path.resolve(__dirname, 'components/ui/footer/index.ts'),
        'components/ui/icon/index': path.resolve(__dirname, 'components/ui/icon/index.ts'),
        'components/ui/logo/index': path.resolve(__dirname, 'components/ui/logo/index.ts'),
        'components/ui/loading/index': path.resolve(__dirname, 'components/ui/loading/index.ts'),
        'components/ui/navigation/index': path.resolve(__dirname, 'components/ui/navigation/index.ts'),
        'components/providers/index': path.resolve(__dirname, 'components/providers/index.ts'),
        'hooks/index': path.resolve(__dirname, 'hooks/index.ts'),
        'utils/index': path.resolve(__dirname, 'utils/index.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@radix-ui/themes',
        'motion',
        'clsx',
        'tailwindcss',
        'tailwind-merge',
        'three-custom-shader-material',
        'lodash',
        'date-fns',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: '.',
        assetFileNames: '[name].[ext]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          three: 'THREE',
        },
      },
    },
    cssCodeSplit: false,
  },
});
