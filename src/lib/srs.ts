/* SRS (กล่องทวนซ้ำ) + ดาว "ยังไม่แม่น"
   ⚠️ กับดักจาก v1: key ต้องเป็น "คำศัพท์เดี่ยว" เท่านั้น (kind === 'vocab')
   สถิติ/ชุดครบกำหนด join กับคำศัพท์ทุกบท ถ้าเขียน key ที่เป็นวลีหรือประโยค
   ข้อมูลจะโป่งใน localStorage แล้วไม่โผล่ที่ไหนเลย */
import { KEYS, readJson, writeJson } from './storage'
import { lessons } from '../data/lessons'
import { hsk1Extra } from '../data/hsk1'
import type { Word } from '../data/types'

const INTERVALS = [0, 1, 2, 4, 7, 15, 30] // จำนวนวันจนถึงรอบทวนถัดไป (index = box)

export type SrsRow = { box: number; due: number; wrong: number; right: number }
export type SrsMap = Record<string, SrsRow>

export const today = () => Math.floor(Date.now() / 86400000)

export const srsGet = () => readJson<SrsMap>(KEYS.srs, {})
export const srsSave = (o: SrsMap) => writeJson(KEYS.srs, o)

export function srsUpdate(zh: string, correct: boolean) {
  const o = srsGet()
  const r = o[zh] ?? { box: 0, due: today(), wrong: 0, right: 0 }
  if (correct) {
    r.right++
    r.box = Math.min(r.box + 1, INTERVALS.length - 1)
    r.due = today() + INTERVALS[r.box]
  } else {
    r.wrong++
    r.box = 1
    r.due = today() // ผิด → กลับมาทวนได้เลยวันนี้
  }
  o[zh] = r
  srsSave(o)
}

/* ---- ดาว ---- */
export const starsGet = () => new Set(readJson<string[]>(KEYS.stars, []))
const starsSave = (s: Set<string>) => writeJson(KEYS.stars, [...s])

export const isStarred = (zh: string) => starsGet().has(zh)

export function toggleStar(zh: string): boolean {
  const s = starsGet()
  if (s.has(zh)) s.delete(zh)
  else s.add(zh)
  starsSave(s)
  return s.has(zh)
}

export function addStar(zh: string) {
  const s = starsGet()
  if (!s.has(zh)) {
    s.add(zh)
    starsSave(s)
  }
}

/* ---- คลังคำศัพท์ (แหล่งความจริงของ SRS/ดาว) ----
   = คำในหนังสือ 15 บท + คำ HSK 1 ที่หนังสือไม่มี
   ควิซ / พิมพ์พินอิน / ดาว / SRS ใช้ชุดนี้ทั้งหมด (แบบฝึกในบทใช้แค่ vocab ของบทนั้น) */
export const allWords = (): Word[] => [...lessons.flatMap((L) => L.vocab), ...hsk1Extra]

export function dueWords(): Word[] {
  const o = srsGet()
  const t = today()
  return allWords().filter((v) => {
    const r = o[v.zh]
    return !r || r.due <= t
  })
}

export type WordStat = Word & SrsRow
/** คำที่ตอบผิดบ่อยสุดก่อน — ใช้โชว์สถิติหลังจบควิซ */
export function weakWords(limit = 12): WordStat[] {
  const o = srsGet()
  return allWords()
    .map((v) => ({ ...v, ...(o[v.zh] ?? { box: 0, due: 0, wrong: 0, right: 0 }) }))
    .filter((v) => v.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || a.right - b.right)
    .slice(0, limit)
}
