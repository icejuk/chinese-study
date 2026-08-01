import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // service worker gen ใหม่ทุก build พร้อม revision ของทุกไฟล์
      // → หมดปัญหา "ลืม bump CACHE_VERSION แล้ว PWA ที่ติดตั้งไว้ไม่เห็นของใหม่" ของ v1
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-maskable.svg'],
      manifest: {
        name: '鑫越 — เรียนภาษาจีน',
        short_name: '鑫越 จีน',
        description: 'เรียนภาษาจีนจากไทย — พินอิน คำศัพท์ บทเรียน แบบฝึก และผันเสียง',
        lang: 'th',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F6F5F3',
        theme_color: '#C13B31',
        categories: ['education', 'books'],
        icons: [
          { src: './icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: './icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // ข้อมูล 15 บท + 421 ประโยค ทำให้ chunk ใหญ่กว่า default 2 MiB
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            // เสียงอ่านจีน — ข้อยกเว้นเดียวที่ยิงออกเน็ต
            // v1 พลาดตรงนี้: เช็ค res.ok กับ response แบบ opaque (status 0) จึงแคชไม่ติดเลย
            urlPattern: /^https:\/\/translate\.googleapis\.com\/translate_tts/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'zh-tts',
              expiration: { maxEntries: 800, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // ข้อมูลแยกจากโค้ด — แก้ UI แล้วผู้ใช้ไม่ต้องโหลดข้อมูล 150 KB ใหม่
        manualChunks: (id) => (id.includes('/src/data/') ? 'data' : undefined),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
