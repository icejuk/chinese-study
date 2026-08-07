/* จัดรอบการฝึก + จำข้อที่ตอบผิดไว้ถามซ้ำ

   ทำไมต้องมี: คลังโตขึ้นเรื่อยๆ (คำศัพท์ 330 · ประโยค 448 · ฟังแปล 628)
   ทำทีเดียวจบรอบเดียวมันยาวเกินจะนั่งจบ → ตัดเป็นรอบละไม่กี่สิบข้อ
   และรอบถัดไปต้องเอา "ข้อที่เคยผิด" กลับมาถามด้วย ตอบถูกแล้วค่อยลบออกจากรายการ */
import { KEYS, readJson, writeJson } from './storage'
import { shuffle } from './pools'

/** ขนาดรอบ — คำศัพท์ตอบไว จึงได้เยอะกว่าประโยคที่ต้องอ่าน/เรียงทีละคำ */
export const ROUND_WORDS = 50
export const ROUND_SENTENCES = 20

export type WrongMap = Record<string, number>

export const wrongGet = (): WrongMap => readJson<WrongMap>(KEYS.wrong, {})

/** ตอบผิด → จดไว้ (นับจำนวนครั้งด้วย ผิดบ่อยจะได้ถูกหยิบมาก่อน) */
export function markWrong(key: string) {
  const o = wrongGet()
  o[key] = (o[key] ?? 0) + 1
  writeJson(KEYS.wrong, o)
}

/** ตอบถูก → ลบออกจากรายการเลย (ตามที่ตั้งใจไว้: หายแล้วไม่ต้องถามซ้ำ) */
export function clearWrong(key: string) {
  const o = wrongGet()
  if (o[key] === undefined) return
  delete o[key]
  writeJson(KEYS.wrong, o)
}

/** จำนวนข้อในคลังนี้ที่ยังค้างว่าเคยตอบผิด */
export function wrongCountIn<T>(pool: readonly T[], keyOf: (x: T) => string): number {
  const o = wrongGet()
  return pool.filter((x) => o[keyOf(x)]).length
}

/**
 * สร้างรอบฝึก: เอาข้อที่เคยผิดมาก่อนให้ครบ แล้วเติมข้อที่เหลือจนได้ `size` ข้อ
 * สับลำดับตอนท้าย เพื่อไม่ให้ข้อที่เคยผิดมากองอยู่ต้นรอบทุกครั้ง (เดาได้ว่าอันไหนคือคำที่ยังไม่แม่น)
 */
export function buildRound<T>(pool: readonly T[], size: number, keyOf: (x: T) => string): T[] {
  if (pool.length <= size) return shuffle(pool)
  const o = wrongGet()
  const bad = pool.filter((x) => o[keyOf(x)])
  const rest = pool.filter((x) => !o[keyOf(x)])
  // ผิดบ่อยกว่ามาก่อน (ถ้าข้อที่เคยผิดเยอะเกินขนาดรอบ จะได้เอาตัวที่แย่สุดมาก่อน)
  const badSorted = shuffle(bad).sort((a, b) => (o[keyOf(b)] ?? 0) - (o[keyOf(a)] ?? 0))
  return shuffle([...badSorted, ...shuffle(rest)].slice(0, size))
}
