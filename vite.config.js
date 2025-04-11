import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Wattnest/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Updated to port 5001
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
