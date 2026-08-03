/* เทสว่าตัวเลือกลวง "ใกล้เคียง" จริง ไม่ใช่สุ่มมั่ว และไม่มีข้อไหนตัวเลือกซ้ำ/ขาด */
import { describe, expect, it } from 'vitest'
import { editDistance, pickDistractors } from './quiz'
import { pyNorm } from './pinyin'
import { catOf } from '../data/wordCats'
import { allWords } from './srs'

const words = allWords()

describe('editDistance', () => {
  it('นับจำนวนตัวที่ต้องแก้', () => {
    expect(editDistance('shi', 'shi')).toBe(0)
    expect(editDistance('shi', 'si')).toBe(1)
    expect(editDistance('mai', 'mao')).toBe(1)
    expect(editDistance('', 'abc')).toBe(3)
  })
})

describe('ตัวเลือกลวง', () => {
  for (const [field, by] of [
    ['th', 'meaning'],
    ['py', 'sound'],
    ['th', 'sound'],
  ] as const) {
    it(`ทุกคำ (${words.length}) ต้องได้ตัวเลือกลวงครบ 3 ตัว ไม่ซ้ำกัน — ${field}/${by}`, () => {
      const bad: string[] = []
      for (const w of words) {
        const d = pickDistractors(w, words, field, by)
        const uniq = new Set([...d, w[field]])
        if (d.length !== 3 || uniq.size !== 4) bad.push(`${w.zh} → ${d.join(' / ')}`)
      }
      expect(bad).toEqual([])
    })
  }

  it('ตัวเลือกแบบ sound ต้องเสียงใกล้กว่าการสุ่ม (วัดที่ค่าเฉลี่ยระยะพินอิน)', () => {
    const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
    const pickedGaps: number[] = []
    const randomGaps: number[] = []
    for (const w of words) {
      const target = pyNorm(w.py)
      for (const d of pickDistractors(w, words, 'py', 'sound')) {
        pickedGaps.push(editDistance(target, pyNorm(d)))
      }
      // เทียบกับการหยิบมั่ว 3 ตัว
      for (let i = 0; i < 3; i++) {
        const r = words[(words.indexOf(w) * 7 + i * 53 + 11) % words.length]
        if (r.zh !== w.zh) randomGaps.push(editDistance(target, pyNorm(r.py)))
      }
    }
    // ใกล้กว่าอย่างเห็นได้ชัด ไม่ใช่ดีขึ้นนิดเดียว
    expect(avg(pickedGaps)).toBeLessThan(avg(randomGaps) * 0.65)
  })

  it('ตัวเลือกแบบ meaning ส่วนใหญ่ต้องอยู่หมวดเดียวกับคำตอบ', () => {
    let same = 0
    let total = 0
    for (const w of words) {
      const cat = catOf(w.zh)?.k
      const pool = words.filter((x) => catOf(x.zh)?.k === cat && x.zh !== w.zh)
      if (pool.length < 3) continue // หมวดเล็กเกินไป ต้องยืมคำหมวดอื่น เป็นเรื่องปกติ
      for (const d of pickDistractors(w, words, 'th', 'meaning')) {
        total++
        if (words.some((x) => x.th === d && catOf(x.zh)?.k === cat)) same++
      }
    }
    expect(same / total).toBeGreaterThan(0.9)
  })
})
