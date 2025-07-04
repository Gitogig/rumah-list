import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'compression';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['lucide-react'],
          'animation': ['framer-motion', 'aos'],
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    },
    middlewareMode: 'html',
    // @ts-ignore - Type issue with compression middleware
    configureServer: (server) => {
      server.middlewares.use(compression());
    }
  }
});
