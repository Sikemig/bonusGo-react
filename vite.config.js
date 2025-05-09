import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/ganancia': { target: 'http://localhost:8080', changeOrigin: true },
      '/objetivos': { target: 'http://localhost:8080', changeOrigin: true },
      '/producto': { target: 'http://localhost:8080', changeOrigin: true },
      '/roles': { target: 'http://localhost:8080', changeOrigin: true },
      '/transacciones': { target: 'http://localhost:8080', changeOrigin: true },
      '/usuario': { target: 'http://localhost:8080', changeOrigin: true }
    }
  }  
})

