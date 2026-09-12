import { describe, expect, it } from 'vitest'
import { allSentences } from './pools'
import { answerSeqs, fitsPrefix, goodPrefix, isAnswer, nextTokens, splitAlt } from './sentence'
import { glossFull, glossShort } from './gloss'

describe('ลำดับคำตอบ', () => {
  it('แตก alt กลับเป็น token ได้ แม้มีคำที่ขึ้นต้นเหมือนกัน (我 / 我们)', () => {
    expect(splitAlt(['我们', '我', '去'], '我去我们')).toEqual(['我', '去', '我们'])
    expect(splitAlt(['下班', '以后', '我'], '我下班以后')).toEqual(['我', '下班', '以后'])
    expect(splitAlt(['我', '去'], '我去了')).toBeNull()      // token ไม่พอ
    expect(splitAlt(['我', '去', '吧'], '我去')).toBeNull()   // token เหลือ
  })

  it('โหมดช่วย: 我 ต้องไม่ผ่านเป็นคำแรกของประโยคที่ขึ้นต้นด้วย 我们', () => {
    const seqs = [['我们', '跟', '我', '去']]
    expect(fitsPrefix(seqs, ['我'])).toBe(false)
    expect(fitsPrefix(seqs, ['我们'])).toBe(true)
    expect(nextTokens(seqs, ['我们'])).toEqual(['跟'])
  })

  it('ลำดับสำรองต้องนับว่าถูก และคำใบ้เสนอได้ทั้งสองทาง', () => {
    const seqs = [['我', '下班', '以后'], ['下班', '以后', '我']]
    expect(isAnswer(seqs, ['下班', '以后', '我'])).toBe(true)
    expect(nextTokens(seqs, [])).toEqual(['我', '下班'])
  })

  it('นับช่วงต้นที่ถูก เทียบกับลำดับที่ไปได้ไกลสุด', () => {
    const seqs = [['我', '去', '超市'], ['超市', '我', '去']]
    expect(goodPrefix(seqs, ['我', '超市', '去'])).toBe(1)
    expect(goodPrefix(seqs, ['超市', '我', '去'])).toBe(3)
    expect(goodPrefix(seqs, [])).toBe(0)
  })

  it('คำที่บังเอิญถูกตำแหน่งแต่อยู่หลังคำผิด ต้องนับว่าผิดด้วย (ถอดคำผิดแล้วมันจะเลื่อนตำแหน่ง)', () => {
    // เคสจริง: 多少 อยู่ตำแหน่ง 4 ถูกพอดี แต่ 4 คำก่อนหน้าผิดหมด
    const seqs = [['这', '盒', '曲别针', '多少', '钱']]
    expect(goodPrefix(seqs, ['曲别针', '钱', '盒', '多少', '这'])).toBe(0)
  })

  it('alt ทุกข้อในคลังต้องแตกเป็น token ได้ครบ (ไม่งั้นลำดับสำรองหายเงียบๆ)', () => {
    const bad = allSentences.filter((s) => (s.alt ?? []).length + 1 !== answerSeqs(s).length)
    expect(bad.map((s) => s.th)).toEqual([])
  })
})

describe('ความหมายไทยของคำในไทล์', () => {
  it('ทุก token ในทุกประโยคต้องมีความหมาย (ผู้เริ่มต้นเรียงไม่ได้ถ้าไม่รู้ความหมาย)', () => {
    const miss = new Set<string>()
    for (const s of allSentences) for (const t of s.tokens) if (!glossFull(t.zh)) miss.add(t.zh)
    expect([...miss]).toEqual([])
  })

  it('ความหมายสั้นตัดวงเล็บ/ความหมายรองออก แต่ห้ามกลายเป็นว่าง', () => {
    expect(glossShort('顺便')).toBe('ถือโอกาส')
    expect(glossShort('车，')).toBe(glossShort('车'))
    for (const s of allSentences) for (const t of s.tokens) expect(glossShort(t.zh)).not.toBe('')
  })
})
