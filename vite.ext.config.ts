import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'extensions',
  build: {
    outDir: '../dist-ext',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'extensions/popup.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
