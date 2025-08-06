import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@social': path.resolve(__dirname, './src'),
      '@social/components': path.resolve(__dirname, './src/components'),
      '@social/pages': path.resolve(__dirname, './src/pages'),
      '@social/utils': path.resolve(__dirname, './src/utils'),
      '@social/types': path.resolve(__dirname, './src/types'),
      '@social/config': path.resolve(__dirname, './src/config'),
      '@social/css': path.resolve(__dirname, './src/css'),
      '@social/assets': path.resolve(__dirname, './src/assets'),
      '@social/api': path.resolve(__dirname, './src/api'),
    },
  },
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 3000,
  },
});
