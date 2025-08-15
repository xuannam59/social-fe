import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@social/configs': path.resolve(__dirname, './src/configs'),
      '@social/components': path.resolve(__dirname, './src/components'),
      '@social/pages': path.resolve(__dirname, './src/pages'),
      '@social/types': path.resolve(__dirname, './src/types'),
      '@social/styles': path.resolve(__dirname, './src/assets/styles'),
      '@social/animations': path.resolve(__dirname, './src/assets/animations'),
      '@social/images': path.resolve(__dirname, './src/assets/images'),
      '@social/apis': path.resolve(__dirname, './src/services/apis'),
      '@social/redux': path.resolve(__dirname, './src/services/redux'),
      '@social/hooks': path.resolve(__dirname, './src/hooks'),
      '@social/constants': path.resolve(__dirname, './src/utils/constants'),
      '@social/defaults': path.resolve(__dirname, './src/utils/defaults'),
      '@social/common': path.resolve(__dirname, './src/utils/common'),
    },
  },
  server: {
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 3000,
  },
});
