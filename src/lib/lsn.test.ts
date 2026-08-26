/* คุมการติดเลขบทให้ข้อของแบบฝึก — เทียบกับข้อมูลจริงทั้งคลัง ไม่ใช่เคสตัวอย่าง
   ที่ต้องคุมคือ "ข้อหายไหม" เวลากรองตามบท ถ้ามีข้อที่ไม่เข้าบทไหนเลย
   ผู้ใช้จะฝึกข้อนั้นไม่ได้อีกตลอดกาลโดยไม่มีอะไรฟ้อง */
import { describe, expect, it } from 'vitest'
import { LSN_ALL, LSN_CHIPS, lsnKey, matchLsn, sentenceLsn, wordLsn, type Lsn } from './lsn'
import { allSentences, listenPool } from './pools'
import { lessons } from '../data/lessons'
import { hsk1Extra } from '../data/hsk1'
import { sentences16 } from '../data/sentences16'
import { sentencesExtra } from '../data/sentencesExtra'

const LESSON_KEYS = LSN_CHIPS.filter((c) => c.v !== LSN_ALL).map((c) => c.v)

describe('บทของคำศัพท์', () => {
  it('คำในบทต้องได้เลขบทที่ถูก (บทแรกที่คำนั้นโผล่)', () => {
    const wrong: string[] = []
    lessons.forEach((L, i) => {
      for (const w of L.vocab) {
        const got = wordLsn(w.zh)
        // คำที่โผล่หลายบทจะได้บทแรก → ต้องไม่มากกว่าบทที่กำลังดู
        if (typeof got !== 'number' || got > i + 1) wrong.push(`${w.zh} บท ${i + 1} → ${got}`)
      }
    })
    expect(wrong).toEqual([])
  })

  it('คำ HSK 1 ที่หนังสือไม่มี ต้องเป็น hsk1', () => {
    expect(hsk1Extra.filter((w) => wordLsn(w.zh) !== 'hsk1').map((w) => w.zh)).toEqual([])
  })

  it('บทที่ 16 ต้องมีคำครบตามที่ใส่ไว้', () => {
    const l16 = lessons[15].vocab.map((w) => w.zh)
    expect(l16.length).toBe(37)
    expect(l16.filter((zh) => wordLsn(zh) !== 16)).toEqual([])
  })
})

describe('บทของประโยค', () => {
  it('ทุกประโยคต้องมีเลขบทที่อยู่ในชิปเลือกบท (ไม่มีข้อกำพร้า)', () => {
    const orphan = allSentences.filter((s) => !LESSON_KEYS.includes(lsnKey(s.lsn)))
    expect(orphan.map((s) => s.th)).toEqual([])
  })

  it('กรองทุกบทแล้วต้องได้ข้อครบ ไม่ขาดไม่ซ้ำ', () => {
    const sum = LESSON_KEYS.reduce(
      (n, k) => n + allSentences.filter((s) => matchLsn(k, s.lsn)).length,
      0,
    )
    expect(sum).toBe(allSentences.length)
  })

  it('ชุดที่เขียนเจาะจงต้องติดบทตรงตามชุด ไม่ใช่เดาจากคำ', () => {
    // 电视 เป็นคำ HSK 1 — ถ้าเดาจากคำ ประโยคบท 16 ที่ใช้ 电视 จะหลุดไป hsk1
    expect(sentences16.every((s) => allSentences.find((x) => x.th === s.th)?.lsn === 16)).toBe(true)
    expect(sentencesExtra.every((s) => allSentences.find((x) => x.th === s.th)?.lsn === 'hsk1')).toBe(true)
  })

  it('บทที่ 16 ได้ 28 ข้อ = 25 ที่เขียนให้บทนี้ + 3 ข้อเก่าที่ใช้คำของบทนี้', () => {
    // 3 ข้อเก่าใช้ 一起 / 少 ซึ่งเพิ่งมาเป็นคำของบท 16 (ก่อนหน้านี้ 一起 ไม่มีในคลังคำเลย
    // แต่ถูกใช้ในประโยค) → การถูกจัดมาบท 16 ถูกต้องแล้ว ไม่ใช่บั๊ก
    expect(allSentences.filter((s) => s.lsn === 16).length).toBe(28)
    expect(sentences16.every((s) => allSentences.some((x) => x.th === s.th && x.lsn === 16))).toBe(true)
  })

  it('ประโยคชุดเดิมต้องกระจายอยู่หลายบท ไม่กองที่บทเดียว', () => {
    const spread = new Set(allSentences.map((s) => lsnKey(s.lsn)))
    expect(spread.size).toBeGreaterThan(8)
  })

  it('บทของประโยคต้องไม่ต่ำกว่าบทของคำที่ใช้ในประโยคนั้น', () => {
    const bad: string[] = []
    for (const s of allSentences) {
      if (s.lsn === 'hsk1' || s.lsn === 16) continue // 2 ชุดนี้ติดบทตรงๆ ไม่ได้คำนวณ
      for (const t of s.tokens) {
        const w = wordLsn(t.zh.replace(/[\s,.!?;:()，。！？、；：（）]/g, ''))
        if (typeof w === 'number' && typeof s.lsn === 'number' && w > s.lsn) {
          bad.push(`${s.th}: ${t.zh} (บท ${w}) > บท ${s.lsn}`)
        }
      }
    }
    expect(bad).toEqual([])
  })
})

describe('กรองแบบฝึกฟังแปล', () => {
  it('กรองทุกบทแล้วได้ข้อครบเท่าไม่กรอง', () => {
    const all = listenPool('all').length
    const sum = LESSON_KEYS.reduce((n, k) => n + listenPool('all', k).length, 0)
    expect(sum).toBe(all)
  })

  it('เลือกบทที่ 16 ต้องได้ทั้งประโยค สนทนา และวลีของบทนั้น', () => {
    const got = listenPool('all', '16')
    expect(got.length).toBeGreaterThan(50)
    expect(new Set(got.map((x) => x.src))).toEqual(new Set(['sb', 'dlg', 'ph']))
    expect(got.every((x) => x.lsn === 16)).toBe(true)
  })

  it('ทุกบทที่มีในหนังสือต้องมีข้อให้ฝึกอย่างน้อย 1 ข้อ', () => {
    const empty = lessons.map((_, i) => String(i + 1)).filter((k) => listenPool('all', k).length === 0)
    expect(empty).toEqual([])
  })
})

describe('matchLsn', () => {
  it('all = ผ่านหมด · เลขบทต้องตรงเป๊ะ · ไม่รู้บทถือว่าไม่ผ่าน', () => {
    const cases: [string, Lsn | undefined, boolean][] = [
      [LSN_ALL, 3, true], [LSN_ALL, 'hsk1', true], [LSN_ALL, undefined, true],
      ['3', 3, true], ['3', 4, false], ['16', 16, true],
      ['hsk1', 'hsk1', true], ['hsk1', 16, false], ['3', undefined, false],
    ]
    for (const [key, lsn, want] of cases) {
      expect(matchLsn(key, lsn), `${key} vs ${lsn}`).toBe(want)
    }
  })
})

describe('sentenceLsn', () => {
  it('เอาบทของคำที่เรียนช้าสุดในประโยค', () => {
    // 图书馆 อยู่บท 4 · 我/去 อยู่บทต้นๆ → ประโยคนี้ต้องเป็นบท 4
    const s = { th: 'ทดสอบ', cat: 'mix', tokens: [{ zh: '我', py: 'wǒ' }, { zh: '去', py: 'qù' }, { zh: '图书馆', py: 'túshūguǎn' }] }
    expect(sentenceLsn(s)).toBe(wordLsn('图书馆'))
  })
})
