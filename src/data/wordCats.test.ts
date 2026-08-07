/* คุมความถูกต้องของการจัดหมวด — ถ้าเพิ่มคำศัพท์ใหม่แล้วลืมจัดหมวด เทสนี้จะฟ้อง */
import { describe, expect, it } from 'vitest'
import { WORD_CATS, catOf } from './wordCats'
import { allWords } from '../lib/srs'

/** ต้องครอบ "ทุกคำที่ใช้ในควิซ/พิมพ์พินอิน" = คำในบท + คำ HSK 1 ที่เพิ่มเข้ามา */
const vocabZh = [...new Set(allWords().map((w) => w.zh))]

describe('หมวดหมู่คำศัพท์', () => {
  it('คำศัพท์ทุกคำต้องมีหมวด', () => {
    const missing = vocabZh.filter((zh) => !catOf(zh))
    expect(missing).toEqual([])
  })

  it('1 คำอยู่ได้หมวดเดียว', () => {
    const seen = new Map<string, string>()
    const dup: string[] = []
    for (const c of WORD_CATS) {
      for (const w of c.words) {
        const prev = seen.get(w)
        if (prev) dup.push(`${w} (${prev} + ${c.k})`)
        else seen.set(w, c.k)
      }
    }
    expect(dup).toEqual([])
  })

  it('ในหมวดต้องไม่มีคำที่ไม่มีอยู่ในคลังคำ (พิมพ์ผิด)', () => {
    const known = new Set(vocabZh)
    const unknown = WORD_CATS.flatMap((c) => c.words.filter((w) => !known.has(w)).map((w) => `${c.k}: ${w}`))
    expect(unknown).toEqual([])
  })

  it('ทุกหมวดต้องมีคำอย่างน้อย 5 คำ (ไม่งั้นแยกหมวดไม่คุ้ม)', () => {
    const thin = WORD_CATS.filter((c) => c.words.length < 5).map((c) => c.k)
    expect(thin).toEqual([])
  })
})
