/* เทสรอบฝึก + รายการข้อที่เคยผิด
   ต้องเซ็ต localStorage ปลอมก่อน เพราะเทสรันบน node (ไม่มี DOM) */
import { beforeEach, describe, expect, it } from 'vitest'

const store = new Map<string, string>()
;(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage

const { buildRound, clearWrong, markWrong, wrongCountIn, wrongGet } = await import('./session')

type Item = { zh: string }
const pool: Item[] = Array.from({ length: 100 }, (_, i) => ({ zh: 'w' + i }))
const key = (x: Item) => x.zh

beforeEach(() => store.clear())

describe('รายการข้อที่เคยผิด', () => {
  it('ตอบผิดแล้วจด · ผิดซ้ำนับเพิ่ม · ตอบถูกแล้วลบออก', () => {
    markWrong('我')
    expect(wrongGet()).toEqual({ 我: 1 })
    markWrong('我')
    expect(wrongGet()).toEqual({ 我: 2 })
    clearWrong('我')
    expect(wrongGet()).toEqual({})
    // ลบข้อที่ไม่มีอยู่ต้องไม่พัง
    expect(() => clearWrong('ไม่มี')).not.toThrow()
  })

  it('นับจำนวนข้อที่ค้างในคลังนั้นได้', () => {
    markWrong('w1')
    markWrong('w2')
    markWrong('ไม่อยู่ในคลังนี้')
    expect(wrongCountIn(pool, key)).toBe(2)
  })
})

describe('สร้างรอบฝึก', () => {
  it('ได้ไม่เกินขนาดรอบ และไม่มีข้อซ้ำ', () => {
    const round = buildRound(pool, 50, key)
    expect(round.length).toBe(50)
    expect(new Set(round.map(key)).size).toBe(50)
  })

  it('คลังเล็กกว่าขนาดรอบ = ได้ทั้งคลัง', () => {
    const small = pool.slice(0, 8)
    expect(buildRound(small, 50, key).map(key).sort()).toEqual(small.map(key).sort())
  })

  it('ข้อที่เคยผิดต้องถูกหยิบมาในรอบถัดไปทุกข้อ', () => {
    for (const zh of ['w10', 'w20', 'w30']) markWrong(zh)
    const round = buildRound(pool, 50, key).map(key)
    expect(round).toContain('w10')
    expect(round).toContain('w20')
    expect(round).toContain('w30')
  })

  it('ถ้าข้อที่เคยผิดมากกว่าขนาดรอบ ต้องเอาตัวที่ผิดบ่อยสุดมาก่อน', () => {
    for (let i = 0; i < 60; i++) markWrong('w' + i)
    for (let k = 0; k < 5; k++) markWrong('w59') // ผิดบ่อยสุด
    const round = buildRound(pool, 10, key).map(key)
    expect(round).toContain('w59')
    // ต้องไม่มีข้อที่ไม่เคยผิดหลุดเข้ามา ทั้งที่ยังมีข้อที่เคยผิดเหลืออยู่
    expect(round.every((z) => Number(z.slice(1)) < 60)).toBe(true)
  })

  it('ตอบถูกแล้วข้อนั้นไม่ถูกบังคับให้กลับมาอีก', () => {
    markWrong('w5')
    clearWrong('w5')
    expect(wrongCountIn(pool, key)).toBe(0)
  })
})
