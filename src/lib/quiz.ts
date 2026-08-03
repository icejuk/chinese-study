/* เลือก "ตัวเลือกลวง" ของควิซให้ใกล้เคียงคำตอบจริง
   ถ้าสุ่มมาแบบไม่เกี่ยวกันเลย (สี vs ตัวเลข vs อาหาร) จะเดาได้ด้วยการตัดตัวเลือก
   ทั้งที่ยังไม่รู้คำศัพท์จริง → วัดไม่ได้ว่าเข้าใจหรือเปล่า

   ใกล้เคียงคนละแบบตามทิศทางของคำถาม:
   · ตัวเลือกเป็นคำแปลไทย → เอาคำที่อยู่หมวดเดียวกัน (สีกับสี, ครอบครัวกับครอบครัว)
   · ตัวเลือกเป็นพินอิน  → เอาคำที่เสียงใกล้กัน (shì / shí / sì) วัดว่าฟัง-อ่านแยกออกจริงไหม */
import type { Word } from '../data/types'
import { catOf } from '../data/wordCats'
import { pyNorm } from './pinyin'
import { shuffle } from './pools'

/** ระยะแก้ไข (Levenshtein) — ใช้วัดว่าพินอิน 2 คำเสียงใกล้กันแค่ไหน */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    prev = cur
  }
  return prev[b.length]
}

/** คะแนนความใกล้เคียงของเสียง: 0 = เหมือนกันเป๊ะ ยิ่งน้อยยิ่งใกล้ */
function soundGap(a: Word, b: Word): number {
  const pa = pyNorm(a.py)
  const pb = pyNorm(b.py)
  const dist = editDistance(pa, pb)
  // ขึ้นต้นเหมือนกัน (shì / shí) หรือลงท้ายเหมือนกัน (mǎi / mài) ถือว่าใกล้กว่า
  const sameHead = pa[0] === pb[0] ? -0.6 : 0
  const sameTail = pa.slice(-2) === pb.slice(-2) ? -0.6 : 0
  const sameLen = pa.length === pb.length ? -0.4 : 0
  return dist + sameHead + sameTail + sameLen
}

/** จำนวนตัวที่หยิบมาเข้ารอบก่อนสุ่ม — ให้คำถามเดิมไม่ได้ตัวเลือกซ้ำเดิมทุกครั้ง */
const SHORTLIST = 8

/** จะให้ตัวเลือกใกล้เคียงกันด้านไหน */
export type Similarity =
  | 'sound'    // เสียงใกล้กัน — สำหรับข้อที่ต้องฟัง/อ่านพินอินให้แม่น
  | 'meaning'  // ความหมายใกล้กัน (หมวดเดียวกัน) — สำหรับข้อที่ต้องรู้ความหมายจริง

/**
 * ตัวเลือกลวง 3 ตัวสำหรับคำถามหนึ่งข้อ
 * @param field ช่องที่เอาไปแสดงเป็นตัวเลือก ('th' = คำแปลไทย, 'py' = พินอิน)
 * @param by ให้ใกล้เคียงด้านเสียงหรือด้านความหมาย (โหมดฟังต้องใช้ 'sound' แม้ตัวเลือกเป็นไทย)
 */
export function pickDistractors(
  correct: Word,
  all: Word[],
  field: 'th' | 'py',
  by: Similarity,
  count = 3,
): string[] {
  const taken = new Set([correct[field]])
  const cat = catOf(correct.zh)?.k

  const candidates = all.filter((w) => {
    if (w.zh === correct.zh) return false
    if (taken.has(w[field])) return false   // ห้ามซ้ำข้อความกับคำตอบ
    return true
  })

  const ranked =
    by === 'sound'
      ? // เสียงใกล้เคียง: shì / shí / sì อยู่ด้วยกัน
        [...candidates].sort((a, b) => soundGap(correct, a) - soundGap(correct, b))
      : // ความหมายใกล้เคียง: หมวดเดียวกันมาก่อน ในหมวดเดียวกันเอาที่ความยาวใกล้กัน
        [...candidates].sort((a, b) => {
          const ca = catOf(a.zh)?.k === cat ? 0 : 1
          const cb = catOf(b.zh)?.k === cat ? 0 : 1
          if (ca !== cb) return ca - cb
          const la = Math.abs(a[field].length - correct[field].length)
          const lb = Math.abs(b[field].length - correct[field].length)
          return la - lb
        })

  const out: string[] = []
  for (const w of shuffle(ranked.slice(0, Math.max(SHORTLIST, count)))) {
    if (taken.has(w[field])) continue
    taken.add(w[field])
    out.push(w[field])
    if (out.length === count) return out
  }
  // เผื่อคำในหมวดไม่พอ (หมวดเล็ก + กรองชุดคำ) — เติมจากที่เหลือ
  for (const w of shuffle(ranked)) {
    if (taken.has(w[field])) continue
    taken.add(w[field])
    out.push(w[field])
    if (out.length === count) break
  }
  return out
}
