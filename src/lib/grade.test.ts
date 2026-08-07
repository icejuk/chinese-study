/* เทสตัวให้คะแนนกับ "ข้อมูลจริงทั้งคลัง" ไม่ใช่เคสตัวอย่าง 2-3 อัน
   (v1 เคยพังเพราะเทสน้อย: ตัดวรรณยุกต์รวบเดียวแล้ว nǚ กลายเป็น nu) */
import { describe, expect, it } from 'vitest'
import { pyCheck, pyNorm } from './pinyin'
import { gradeThai, keywordsOf, thNorm } from './thai'
import { listenPool } from './pools'
import { allWords } from './srs'
import { lessons } from '../data/lessons'

const allItems = [...lessons.flatMap((L) => L.vocab), ...lessons.flatMap((L) => L.phrases)]

describe('pinyin', () => {
  it('เฉลยของทุกคำ/วลี (402 รายการ) ต้องตรวจผ่านตัวเอง', () => {
    const fail = allItems.filter((v) => !pyCheck(v.py, v.py).ok)
    expect(fail.map((v) => v.zh + ' ' + v.py)).toEqual([])
  })

  it('ไม่คิดวรรณยุกต์/ตัวพิมพ์ใหญ่/เลขกำกับเสียง', () => {
    expect(pyCheck('zuijin', 'zuìjìn').ok).toBe(true)
    expect(pyCheck('ZUIJIN', 'zuìjìn').ok).toBe(true)
    expect(pyCheck('zui4jin4', 'zuìjìn').ok).toBe(true)
  })

  it('ü พิมพ์เป็น v หรือ u: ก็ได้ แต่พิมพ์ u เฉยๆ ต้องบอกว่าเพราะ ü', () => {
    expect(pyCheck('nv', 'nǚ').ok).toBe(true)
    expect(pyCheck('nu:', 'nǚ').ok).toBe(true)
    expect(pyCheck('nu', 'nǚ')).toEqual({ ok: false, why: 'umlaut' })
    // กับดักเดิม: strip diacritic รวบเดียวจะทำให้ nǚ → nu แล้วผ่านทั้งที่ผิด
    expect(pyNorm('nǚ')).toBe('nv')
    expect(pyNorm('lǜshī')).toBe('lvshi')
  })

  it('วงเล็บในเฉลย = ใส่หรือไม่ใส่ก็ได้', () => {
    expect(pyCheck('youyidianr', 'yǒu(yì)diǎnr').ok).toBe(true)
    expect(pyCheck('youdianr', 'yǒu(yì)diǎnr').ok).toBe(true)
  })
})

describe('คำแปลไทย', () => {
  it('ห้ามตัดสระ/วรรณยุกต์ไทยทิ้ง (คนละเรื่องกับการตัดวรรคตอน)', () => {
    expect(thNorm(' ยุ่ง มาก! ')).toBe('ยุ่งมาก')
    expect(thNorm('ห้าคน (ในบ้าน)')).toBe('ห้าคนในบ้าน')
  })

  for (const src of ['all', 'sb', 'dlg', 'ph'] as const) {
    it(`ป้อนคำแปลเฉลยเองต้องได้ครบทุกคำหลัก — แหล่ง ${src}`, () => {
      const pool = listenPool(src)
      expect(pool.length).toBeGreaterThan(0)
      const fail = pool.filter((it) => {
        const g = gradeThai(it.th, it)
        return g.auto && !g.full
      })
      expect(fail.map((f) => f.th + ' → ตก ' + gradeThai(f.th, f).missing.join(','))).toEqual([])
    })
  }

  it('ข้อที่หาคำหลักไม่ได้ต้องเหลือน้อยมาก (ปล่อยให้ผู้ใช้ตัดสินเอง)', () => {
    const pool = listenPool('all')
    const noKw = pool.filter((it) => keywordsOf(it).length === 0)
    expect(noKw.length / pool.length).toBeLessThan(0.02)
  })

  it('คำแปลที่เขียนต่างจากเฉลยแต่ถูก ต้องผ่าน', () => {
    const pool = listenPool('all')
    const find = (th: string) => {
      const it = pool.find((x) => x.th === th)
      if (!it) throw new Error('ไม่พบประโยค: ' + th)
      return it
    }
    const cases: [string, string][] = [
      ['ฉันไม่ไป', 'ผมไม่ไป'],
      ['พ่อของฉัน', 'พ่อผม'],
      ['คุณยุ่งไหม', 'คุณยุ่งมั้ย'],
      ['บริษัทของแม่ฉัน', 'บริษัทแม่ผม'],
      ['ทั้งหมดสามหยวนห้าเหมาแปดเฟิน', 'รวม 3 หยวน 5 เหมา 8 เฟิน'],
      ['แพงเกินไป ลดหน่อยได้ไหม', 'แพงไป ลดหน่อยสิ'],
      ['พวกเรากลับบ้านกันเถอะ', 'เรากลับบ้านกันเถอะ'],
      ['เชิญนั่ง ดื่มชาสักแก้วสิ', 'นั่งสิ ดื่มชาแก้วนึง'],
    ]
    for (const [th, typed] of cases) {
      const g = gradeThai(typed, find(th))
      expect(g.missing, `"${typed}" ควรผ่านสำหรับ "${th}"`).toEqual([])
    }
  })

  it('ตอบผิดจริงต้องจับได้', () => {
    const pool = listenPool('all')
    const it = pool.find((x) => x.th === 'พ่อของฉัน')!
    expect(gradeThai('แม่ของเขา', it).full).toBe(false)
    expect(gradeThai('', it).full).toBe(false)
  })
})

describe('คลังข้อ', () => {
  it('คำศัพท์ทุกคำ (รวม HSK 1 ที่เพิ่มมา) ต้องมีอยู่ในประโยคของแบบฝึกฟังแปล/เรียงประโยค', () => {
    const text = listenPool('all')
      .map((x) => x.zh)
      .join('|')
    const missing = allWords().filter(
      (w) => !text.includes(w.zh) && !text.includes(w.zh.replace(/[()一]/g, '')),
    )
    expect(missing.map((w) => w.zh)).toEqual([])
  })
})
