import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/screens.css'

/* ล้าง cache ของ v1 (ชื่อ xinyue-zh-vNN) ทิ้ง — service worker ใหม่ไม่รู้จักชื่อนี้
   ถ้าไม่ลบ ไฟล์ชุดเก่าจะกินที่เครื่องผู้ใช้ค้างไว้ตลอด */
if ('caches' in window) {
  caches.keys().then((keys) => {
    for (const k of keys) if (k.startsWith('xinyue-zh-')) caches.delete(k)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
