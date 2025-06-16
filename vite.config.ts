import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Wichtig: base auf '/' setzen für Custom Domain
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimierungen für Production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-label'],
        },
      },
    },
  },
})
