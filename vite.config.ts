import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/pin-api': {
        target: 'https://pin.gsu.edu',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pin-api/, ''),
      },
    },
  },
})
