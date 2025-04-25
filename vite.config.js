import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // necesario para realizar las consultas a la API
  server: {
    proxy: {
      '/auth': 'http://localhost:8080/',
    },
  },
})
