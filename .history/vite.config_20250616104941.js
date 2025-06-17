import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
    strictPort: false // Allow Vite to use a different port if 5183 is already in use
  },
  // Add base path in case you want to deploy to a subdirectory
  base: '/'
});
