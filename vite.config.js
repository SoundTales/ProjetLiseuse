import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/ProjetLiseuse/',  // 🔥 Indispensable pour GitHub Pages
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',  // 🔥 Important pour regrouper les fichiers CSS & JS
    sourcemap: true,
    minify: 'terser',
  },
});
