/* ตรวจคำตอบของแบบฝึกเรียงประโยค
   เทียบเป็น "ลำดับ token" ไม่ใช่ string ที่ต่อกันแล้ว
   ⚠️ ถ้าเทียบ string: ประโยคที่มีทั้ง 我 และ 我们 จะให้ 我 ผ่านเป็นคำแรกของ "我们…" ได้
      โหมดช่วยจะรับคำผิดเข้าไปแล้วค้างกลางทาง ไม่มีไทล์ไหนต่อได้อีก */
import type { Sentence } from '../data/types'

export type Seq = string[]

/** แตก alt (ประโยคที่เรียงอีกแบบก็ถูก) กลับเป็นลำดับ token — จับคำยาวก่อน
    ต้องใช้ token ครบทุกตัวพอดี ไม่งั้นคืน null (เทสจับไว้ว่า alt ทุกข้อต้องแตกได้) */
export function splitAlt(tokens: string[], alt: string): Seq | null {
  const left = [...tokens]
  const out: Seq = []
  let rest = alt
  while (rest) {
    const t = left.filter((x) => rest.startsWith(x)).sort((a, b) => b.length - a.length)[0]
    if (!t) return null
    out.push(t)
    left.splice(left.indexOf(t), 1)
    rest = rest.slice(t.length)
  }
  return left.length ? null : out
}

/** ทุกลำดับที่นับว่าถูก — ลำดับหลักก่อนเสมอ (คำใบ้ชี้ตามลำดับหลักถ้าเป็นไปได้) */
export function answerSeqs(s: Sentence): Seq[] {
  const main = s.tokens.map((t) => t.zh)
  const alts = (s.alt ?? []).map((a) => splitAlt(main, a)).filter((x): x is Seq => x !== null)
  return [main, ...alts]
}

const startsWith = (q: Seq, placed: Seq) => placed.every((z, i) => q[i] === z)

/** ที่วางไว้ยังเป็นจุดเริ่มของคำตอบที่ถูกอยู่ไหม */
export const fitsPrefix = (seqs: Seq[], placed: Seq) => seqs.some((q) => startsWith(q, placed))

export const isAnswer = (seqs: Seq[], placed: Seq) =>
  seqs.some((q) => q.length === placed.length && startsWith(q, placed))

/** คำถัดไปที่ถูก (อาจมีหลายคำถ้ามีลำดับสำรอง) */
export function nextTokens(seqs: Seq[], placed: Seq): string[] {
  const out = seqs.filter((q) => startsWith(q, placed) && q.length > placed.length).map((q) => q[placed.length])
  return [...new Set(out)]
}

/** จำนวนคำช่วงต้นที่ถูกแล้ว (เทียบกับลำดับที่ไปได้ไกลสุด) — ตั้งแต่ตำแหน่งนี้ไปถือว่าผิดทั้งหมด
    ⚠️ ห้ามชี้ผิดเป็นรายตำแหน่ง: ผู้เรียนถอดคำผิดออก คำที่เคย "ถูกตำแหน่ง" จะเลื่อนมาอยู่ผิดที่แทน
       (เจอตอนทดสอบ 2026-09-13: ถอดคำแดงออกครบตามที่บอก เหลือ 多少 ตัวเดียวแล้วกลายเป็นแดงเอง) */
export function goodPrefix(seqs: Seq[], placed: Seq): number {
  let best = 0
  for (const q of seqs) {
    let i = 0
    while (i < placed.length && q[i] === placed[i]) i++
    best = Math.max(best, i)
  }
  return best
}
