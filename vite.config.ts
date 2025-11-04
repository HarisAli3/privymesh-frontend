import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@zitadel/react': path.resolve(__dirname, './lib/dist/index'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.API_BASE_URL || 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: process.env.API_BASE_URL || 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
