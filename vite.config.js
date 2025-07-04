import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    strictPort: false, // Allow Vite to use a different port if 5183 is already in use
    proxy: {
      '/api': {
        target: 'http://localhost:5177', // Your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      // Allow Cline extension connections for development
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss: http: https:; connect-src 'self' ws: wss: http: https: *.cline.bot;"
    }
  },
  // Add base path in case you want to deploy to a subdirectory
  base: '/'
});
