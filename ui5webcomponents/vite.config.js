import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [
        /^@ui5\/webcomponents/,
        /^@ui5\/webcomponents-fiori/,
        /^@ui5\/webcomponents-icons/,
        /^@ui5\/webcomponents-base/
      ],
      output: {
        globals: {
          // UI5 웹 컴포넌트를 전역 변수로 매핑
          '@ui5/webcomponents': 'ui5.webcomponents',
          '@ui5/webcomponents-fiori': 'ui5.webcomponents.fiori',
          '@ui5/webcomponents-icons': 'ui5.webcomponents.icons',
          '@ui5/webcomponents-base': 'ui5.webcomponents.base'
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/user-api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/sfsf-api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/ecp-api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});