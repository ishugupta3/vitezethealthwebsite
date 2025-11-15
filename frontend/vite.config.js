import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy for authentication API
      '/api/auth': {
        target: 'https://apihealth.zethealth.com/api/v1/Authenticate/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
      },
      // Proxy for your test backend
      '/api': {
        target: 'http://15.207.229.70',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
