/* ตรวจ "คำแปลไทย" ของแบบฝึกฟังแปล
   คำแปลไทยประโยคเดียวเขียนได้หลายแบบ (ฉัน/ผม, สลับลำดับคำขยาย) เทียบ string ตรงๆ
   จะตัดสินผิดทั้งที่แปลถูก → ตรวจแค่ "คำหลัก" แล้วให้ผู้ใช้ตัดสินสุดท้ายเอง */
import { lessons } from '../data/lessons'

/** ⚠️ ตัดแค่ช่องว่าง/วรรคตอน ห้ามแตะสระ-วรรณยุกต์ไทย (เป็นอักขระประกอบเหมือน ǚ ในพินอิน) */
const PUNC = /[\s,.!?;:()[\]{}"'/\\|·…—–\-，。！？、；：（）]/g

export function thNorm(s: unknown): string {
  return String(s ?? '').normalize('NFC').replace(PUNC, '')
}

/** คำไวยากรณ์ที่ภาษาไทยละได้ — ไม่เอามาเป็นคำหลัก ไม่งั้นขึ้น "ตกคำ" ทั้งที่แปลถูก
   (我妈妈的公司 แปลว่า "บริษัทแม่ผม" ก็ถูก ไม่ต้องมี "ของ" · 请坐 = "นั่งสิ") */
const STOP = new Set([
  'ของ', 'ก็', 'ที่', 'และ', 'แล้ว', 'จะ', 'ได้', 'ด้วย', 'ให้',
  'เป็น', 'คือ', 'ใช่', 'อยู่', 'เชิญ', 'กรุณา',
])

/** คำพ้องที่แปลต่างจากเฉลยได้โดยไม่ผิด — เน้นคำที่โผล่เป็นคำหลักบ่อยสุดในคลัง
   (ฉัน 150 · คุณ 103 · เขา 59 · นี้ 44 ครั้ง) */
const ALIAS: string[][] = [
  ['ฉัน', 'ผม', 'ดิฉัน', 'หนู', 'เรา'],
  ['คุณ', 'เธอ', 'นาย', 'ท่าน', 'แก'],
  ['เขา', 'เค้า', 'หล่อน', 'เธอ'],
  ['พวกเรา', 'เรา'], ['พวกคุณ', 'คุณ'], ['พวกเขา', 'เขา'],
  ['นี้', 'นี่'], ['นั้น', 'นั่น'],
  ['ไหม', 'มั้ย', 'หรือเปล่า', 'รึเปล่า'],
  ['ล่ะ', 'ละ', 'เหรอ', 'หรอ'],
  ['ก็', 'ก้อ'],
  // เลขอาราบิกกับคำอ่านไทยต้องเท่ากัน — คนพิมพ์ "3 หยวน" บ่อยกว่า "สามหยวน"
  ['ศูนย์', '0'], ['หนึ่ง', '1'], ['สอง', '2'], ['สาม', '3'], ['สี่', '4'], ['ห้า', '5'],
  ['หก', '6'], ['เจ็ด', '7'], ['แปด', '8'], ['เก้า', '9'], ['สิบ', '10'],
  ['ร้อย', '100'], ['พัน', '1000'], ['หมื่น', '10000'],
  ['ทั้งหมด', 'รวม', 'ทั้งสิ้น'],
  ['เกินไป', 'เกิน', 'ไป'],
  ['นิดหน่อย', 'หน่อย', 'เล็กน้อย'],
]

let aliasMap: Map<string, string[]> | null = null
function aliasOf(word: string): string[] {
  if (!aliasMap) {
    aliasMap = new Map()
    for (const group of ALIAS) for (const w of group) if (!aliasMap.has(w)) aliasMap.set(w, group)
  }
  return aliasMap.get(word) ?? [word]
}

/* ---- แม็ป คำจีน → คำแปลไทย จาก vocab+วลีทุกบท (สร้างครั้งเดียว) ---- */
let zhToTh: Map<string, string> | null = null
let maxKeyLen = 0
function dict() {
  if (zhToTh) return zhToTh
  zhToTh = new Map()
  for (const L of lessons) {
    for (const w of [...L.vocab, ...L.phrases]) if (!zhToTh.has(w.zh)) zhToTh.set(w.zh, w.th)
  }
  for (const k of zhToTh.keys()) maxKeyLen = Math.max(maxKeyLen, k.length)
  return zhToTh
}

export type GradeTarget = { zh: string; th: string }
export type Grade = {
  keywords: string[]
  missing: string[]
  full: boolean
  /** ตรวจอัตโนมัติได้ไหม — ถ้าหาคำหลักไม่ได้เลย (~0.3% ของคลัง) ต้องให้ตัดสินเอง */
  auto: boolean
}

const kwCache = new WeakMap<object, string[]>()

/**
 * คำหลักของประโยค = คำแปลของคำจีนในประโยค "ที่ปรากฏอยู่ในคำแปลเฉลยจริง" เท่านั้น
 * (ถ้าไม่เช็คว่าปรากฏจริง จะไปบังคับคำที่เฉลยไม่ได้ใช้ เช่น 是 = ใช่ ในประโยคที่แปลว่า "คือ")
 */
export function keywordsOf(item: GradeTarget): string[] {
  const cached = kwCache.get(item as object)
  if (cached) return cached

  const th = thNorm(item.th)
  const map = dict()
  const s = (item.zh || '').replace(PUNC, '')
  const cand = new Set<string>()
  // ไล่ทุกช่วงตัวอักษร ไม่ใช่ตัดคำแบบยาวสุด — เพราะ 我的爸爸 มีในคลังเป็นวลีเดียว ('พ่อของฉัน')
  // ถ้าเอาวลีทั้งก้อนมาเป็นคำหลัก การตรวจจะกลายเป็นเทียบทั้งประโยคแบบตรงตัว
  for (let i = 0; i < s.length; i++) {
    for (let len = 1; len <= Math.min(maxKeyLen, s.length - i); len++) {
      const t = s.slice(i, i + len)
      const meaning = map.get(t)
      if (!meaning) continue
      // คำเดียวมีได้หลายคำแปล ('ดี / โอเค') และมีคำอธิบายในวงเล็บ ('เขา (ชาย)') → แตกก่อน
      for (const v of meaning.replace(/\([^)]*\)/g, '').split('/')) {
        const k = thNorm(v)
        if (k.length >= 2 && th.includes(k)) cand.add(k)
      }
    }
  }
  const ks = [...cand]
  // เก็บแต่หน่วยย่อยสุด (ตัดคำที่ครอบคำอื่นอยู่) — ยืดหยุ่นกับการเรียงคำแปลที่ต่างกัน
  const out = ks.filter((k) => !STOP.has(k) && !ks.some((o) => o !== k && k.includes(o)))
  kwCache.set(item as object, out)
  return out
}

export function gradeThai(input: string, item: GradeTarget): Grade {
  const got = thNorm(input)
  const keywords = keywordsOf(item)
  const missing = keywords.filter((k) => !aliasOf(k).some((v) => got.includes(v)))
  return { keywords, missing, full: !!got && missing.length === 0, auto: keywords.length > 0 }
}
