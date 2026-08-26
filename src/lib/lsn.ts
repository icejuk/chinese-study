/* "ข้อนี้เป็นของบทไหน" — ใช้กรองแบบฝึกให้ฝึกเฉพาะบทที่เพิ่งเรียนได้

   คำศัพท์บอกบทได้ตรงๆ (อยู่ในบทไหนก็บทนั้น) แต่ประโยคเรียงคำ 421 ข้อชุดแรก
   เขียนมือไว้ก่อนมีระบบบท ไม่มีเลขบทติดมา → คำนวณย้อนหลังจาก "คำที่ใช้ในประโยค"
   บทของประโยค = บทของคำที่เรียนช้าสุดในประโยคนั้น (เรียนถึงบทนั้นแล้วจึงจะเรียงได้)

   ⚠️ คำนวณตอนโหลด ไม่ได้เขียนเลขบทลงไฟล์ข้อมูล — ข้อมูลจะไม่เพี้ยนเวลาเพิ่ม/ย้ายคำ
   (บทที่ 16 ย้าย 现在 · 时候 · 电影 · 少 · 东西 มาจาก hsk1 มาแล้วครั้งหนึ่ง) */
import { lessons } from '../data/lessons'
import { hsk1Extra } from '../data/hsk1'
import type { Sentence } from '../data/types'

/** บทที่ 1–16 หรือ 'hsk1' (ชุดคำ HSK 1 ที่หนังสือไม่มี) */
export type Lsn = number | 'hsk1'

/** ค่าที่ชิปเลือกบทส่งมา — 'all' = ไม่กรอง */
export type LsnKey = string

export const LSN_ALL: LsnKey = 'all'
export const lsnKey = (l: Lsn): LsnKey => (l === 'hsk1' ? 'hsk1' : String(l))

/** ชิปสำหรับแถบเลือกบท — เรียงเหมือนหน้าบทเรียนเพื่อให้จำตำแหน่งได้ */
export const LSN_CHIPS: { v: LsnKey; label: string; className?: string }[] = [
  // chip-hsk1 = ชิปที่เป็นข้อความ ต้องกว้างตามข้อความ ไม่ใช่จัตุรัส 40px เหมือนเลขบท
  { v: LSN_ALL, label: 'ทุกบท', className: 'chip-hsk1' },
  ...lessons.map((_, i) => ({ v: String(i + 1), label: String(i + 1) })),
  { v: 'hsk1', label: 'HSK 1', className: 'chip-hsk1' },
]

/* ---- คำศัพท์ → บท ---- */
let wordMap: Map<string, Lsn> | null = null
function words() {
  if (wordMap) return wordMap
  wordMap = new Map()
  lessons.forEach((L, i) => {
    // บทแรกที่คำนั้นโผล่ชนะ (给/找 โผล่ 2 บท) — วลีก็นับ เพราะประโยคใช้วลีเป็นก้อนได้
    for (const w of [...L.vocab, ...L.phrases]) if (!wordMap!.has(w.zh)) wordMap!.set(w.zh, i + 1)
  })
  for (const w of hsk1Extra) if (!wordMap!.has(w.zh)) wordMap!.set(w.zh, 'hsk1')
  return wordMap
}

/** บทของคำศัพท์ — undefined ถ้าไม่รู้จักคำนี้ */
export const wordLsn = (zh: string): Lsn | undefined => words().get(zh)

/* ---- ประโยค → บท ---- */
const PUNC = /[\s,.!?;:()，。！？、；：（）]/g
/** ลำดับความ "ช้า" ของบท: hsk1 ถือว่าอยู่ท้ายสุด (เป็นคำนอกหนังสือ) */
const rank = (l: Lsn) => (l === 'hsk1' ? 999 : l)

const sentCache = new WeakMap<object, Lsn>()

export function sentenceLsn(s: Sentence): Lsn {
  const hit = sentCache.get(s as object)
  if (hit !== undefined) return hit
  const map = words()
  let best: Lsn = 1
  for (const t of s.tokens) {
    const zh = t.zh.replace(PUNC, '')
    // ทั้ง token ก่อน (คำ 2 พยางค์) ไม่เจอค่อยไล่ทีละตัว (โจทย์บางข้อรวมคำติดกัน)
    const found = map.get(zh)
    const cands = found !== undefined ? [found] : [...zh].map((c) => map.get(c)).filter((x): x is Lsn => x !== undefined)
    for (const c of cands) if (rank(c) > rank(best)) best = c
  }
  sentCache.set(s as object, best)
  return best
}

/** ข้อนี้ตรงกับชิปที่เลือกไหม */
export const matchLsn = (key: LsnKey, l: Lsn | undefined) =>
  key === LSN_ALL || (l !== undefined && lsnKey(l) === key)
