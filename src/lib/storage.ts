/* localStorage ทั้งหมดของแอป
   ⚠️ คีย์ต้องเหมือน v1 ทุกตัว ไม่งั้นคนที่ใช้อยู่จะเสียความคืบหน้าทั้งหมด
   (v1 = index.html เดิม ใช้คีย์ xy-* พวกนี้มาตั้งแต่ต้น) */
export const KEYS = {
  lesson: 'xy-lsn',        // บทที่เปิดล่าสุด (ตัวเลขล้วน)
  nav: 'xy-nav',           // { tab, mode, last: {...} }
  srs: 'xy-srs',           // { [zh]: { box, due, wrong, right } }
  stars: 'xy-star-words',  // [zh, ...]
  typing: 'xy-ty',         // { src }
  listen: 'xy-ln',         // แหล่งข้อของแบบฝึกฟังแปล
  wrong: 'xy-wrong',       // { [zh]: จำนวนครั้งที่ตอบผิด } — ล้างทิ้งเมื่อตอบถูก
  drillLsn: 'xy-dlsn',     // บทที่กรองในแบบฝึก ('all' | '1'..'16' | 'hsk1') — คีย์ใหม่ของ v2
} as const

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

/** เขียนแบบกลืน error — โหมด private ของ Safari throw ตอน setItem */
export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* เต็มหรือถูกปิด — ยอมเสียการจดจำ ดีกว่าแอปพัง */
  }
}

export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeRaw(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* เหมือน writeJson */
  }
}
