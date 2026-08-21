import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, '../../../dist-modules/clx.ssh'),
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
