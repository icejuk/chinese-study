/* ล็อกลำดับศัพท์บทที่ 17 ให้ตรงหนังสือ 汉语教程 第一册 下 หน้า 16-17

   เหตุผลเดียวกับ lesson16.test.ts: ผู้เรียนนับการ์ดเทียบกับเลขข้อในหนังสือ
   → คำที่หนังสือไม่ลิสต์ต้องต่อท้ายเท่านั้น ห้ามแทรกกลาง */
import { describe, expect, it } from 'vitest'
import { lessons } from './lessons'

/** ข้อ 1-25 ของหนังสือ + หัวข้อย่อย 来 ที่พิมพ์ใต้ 出来 */
const BOOK = [
  '在',
  '出来', '来',            // ข้อ 2 + หัวข้อย่อย
  '正在', '音乐', '没有', '正', '录音', '事儿', '书店', '想', '汉英',
  '坐', '挤', '骑', '行', '学期', '门', '课', '综合', '口语', '听力', '阅读',
  '文化', '体育', '教',
]

const L17 = lessons[16]

describe('ศัพท์บทที่ 17', () => {
  it('ลำดับต้องตรงหนังสือเป๊ะ และไม่มีคำอื่นแถม', () => {
    expect(L17.vocab.map((w) => w.zh)).toEqual(BOOK)
  })

  it('ไม่มีคำซ้ำในบท', () => {
    const zh = L17.vocab.map((w) => w.zh)
    expect(new Set(zh).size).toBe(zh.length)
  })

  it('ทุกคำต้องมี py / th / en / thr ครบ', () => {
    const bad = L17.vocab.filter((w) => !w.py || !w.th || !w.en || !w.thr)
    expect(bad.map((w) => w.zh)).toEqual([])
  })

  it('ทุกคำต้องโผล่ในบทสนทนาจริง (ไม่งั้นไม่มีที่ให้เห็นคำนั้นใช้งาน)', () => {
    const text = L17.dialogue.map((d) => ('sec' in d ? '' : d.zh)).join('')
    expect(BOOK.filter((zh) => !text.includes(zh))).toEqual([])
  })
})
