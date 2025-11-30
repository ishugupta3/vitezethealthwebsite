import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true,
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
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
    // Middleware to mock /api/get-address-list endpoint
    middleware: true,
    setupMiddlewares(middlewares, devServer) {
      middlewares.unshift((req, res, next) => {
        if (req.url === '/api/get-address-list') {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify([
            { id: 1, name: "Home", address: "123 Main Street" },
            { id: 2, name: "Office", address: "456 Business Rd" }
          ]))
          return
        }
        next()
      })
      return middlewares
    }
  }
})
