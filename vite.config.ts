import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/apri/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      scope: '/apri/',
      manifest: false, // public/manifest.json を使用
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo-cache',
              expiration: { maxAgeSeconds: 300 }, // 5分TTL
            },
          },
        ],
      },
    }),
  ],
})
