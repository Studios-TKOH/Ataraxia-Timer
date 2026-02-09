import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'ads.txt',
        '_redirects',
        'Logo_SN_紫.png',
        'Logo_SN_紫2.png',
        'Logo_STKH.svg'
      ],
      manifest: {
        id: '/',
        name: 'Ataraxia Timer',
        short_name: 'Ataraxia',
        description: 'Focus timer with Spotify integration and full offline mode',
        theme_color: '#8b5cf6',
        background_color: '#050505',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'es',
        icons: [
          {
            src: 'Logo_SN_紫.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Logo_SN_紫2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,mp3}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'image' ||
              request.destination === 'font' ||
              request.destination === 'audio',
            handler: 'CacheFirst',
            options: {
              cacheName: 'media-cache',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 180
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173
  }
})
