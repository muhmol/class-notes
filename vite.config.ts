import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves a project site from /<repo-name>/, so the base path must
// be configurable. Locally it stays "/"; the deploy workflow sets BASE_PATH.
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'یادداشت کلاس',
        short_name: 'یادداشت کلاس',
        description: 'ثبت سریع آنچه سر کلاس گفته شد، با تاریخ و ساعت خودکار',
        lang: 'fa',
        dir: 'rtl',
        display: 'standalone',
        start_url: base,
        scope: base,
        background_color: '#F2F4F7',
        theme_color: '#3B3BF5',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
