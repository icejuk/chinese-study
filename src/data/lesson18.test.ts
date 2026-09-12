/* ล็อกลำดับศัพท์บทที่ 18 ให้ตรงหนังสือ 汉语教程 第一册 下 หน้า 30

   เหตุผลเดียวกับ lesson16.test.ts: ผู้เรียนนับการ์ดเทียบกับเลขข้อในหนังสือ
   → คำที่หนังสือไม่ลิสต์ต้องต่อท้ายเท่านั้น ห้ามแทรกกลาง */
import { describe, expect, it } from 'vitest'
import { lessons } from './lessons'

/** ข้อ 1-20 ของหนังสือ + หัวข้อย่อย 4 คำ (用 飞 帮 问题) ที่พิมพ์ใต้ข้อแม่ */
const BOOK = [
  '修', '顺便', '替', '盒', '曲别针', '拿',
  '不用', '用',            // ข้อ 7 + หัวข้อย่อย
  '旅行', '代表', '团', '参观', '当', '翻译',
  '飞机', '飞',            // ข้อ 14 + หัวข้อย่อย
  '火车', '回来',
  '帮忙', '帮',            // ข้อ 17 + หัวข้อย่อย
  '浇', '花',
  '没问题', '问题',        // ข้อ 20 + หัวข้อย่อย
]

/** 帮忙 เป็นคำที่แยกได้ — บทสนทนาใช้รูป 帮我一个忙 จึงไม่มี "帮忙" ติดกันให้เจอ */
const SPLIT = ['帮忙']

const L18 = lessons[17]

describe('ศัพท์บทที่ 18', () => {
  it('ลำดับต้องตรงหนังสือเป๊ะ และไม่มีคำอื่นแถม', () => {
    expect(L18.vocab.map((w) => w.zh)).toEqual(BOOK)
  })

  it('ไม่มีคำซ้ำในบท', () => {
    const zh = L18.vocab.map((w) => w.zh)
    expect(new Set(zh).size).toBe(zh.length)
  })

  it('ทุกคำต้องมี py / th / en / thr ครบ', () => {
    const bad = L18.vocab.filter((w) => !w.py || !w.th || !w.en || !w.thr)
    expect(bad.map((w) => w.zh)).toEqual([])
  })

  it('ทุกคำต้องโผล่ในบทสนทนาจริง (ไม่งั้นไม่มีที่ให้เห็นคำนั้นใช้งาน)', () => {
    const text = L18.dialogue.map((d) => ('sec' in d ? '' : d.zh)).join('')
    expect(BOOK.filter((zh) => !SPLIT.includes(zh) && !text.includes(zh))).toEqual([])
    expect(text).toContain('帮我一个忙')
  })
})
