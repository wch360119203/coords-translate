import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'ES2015',
    lib: {
      entry: './src/main.ts',
      name: 'coordsTranslate',
      fileName: 'coords-translate',
      formats: ['umd', 'es'],
    },
  },
  plugins: [dts({ exclude: './src/vite-env.d.ts', outputDir: './dist/types' })],
});
