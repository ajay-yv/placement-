import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.HTTPS === 'true' ? basicSsl() : null
  ].filter(Boolean),
  base: './', // Ensure assets are loaded correctly in Electron
  optimizeDeps: {
    entries: ['index.html'], // Only scan the main index.html
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://placement-sage.vercel.app',
        changeOrigin: true,
      }
    },
    host: true, // innovative feature: allow access from network
    watch: {
      ignored: ['**/android/**', '**/ios/**', '**/dist/**', '**/release/**']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'recharts']
        }
      }
    }
  }
})
