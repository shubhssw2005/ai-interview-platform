import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    https: {
      key: fs.existsSync('./localhost-key.pem') ? fs.readFileSync('./localhost-key.pem') : undefined,
      cert: fs.existsSync('./localhost.pem') ? fs.readFileSync('./localhost.pem') : undefined,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});