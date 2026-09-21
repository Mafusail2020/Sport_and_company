import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forwards to the local backend stub during `npm run dev` so the
      // frontend can call a same-origin relative path (`/api/contact`)
      // without hardcoding a backend port or dealing with CORS in dev.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
