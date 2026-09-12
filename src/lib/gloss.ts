/* ความหมายไทยของ token ในแบบฝึกเรียงประโยค
   ผู้เริ่มต้นเรียงประโยคไม่ได้ถ้าไม่รู้ว่าแต่ละคำแปลว่าอะไร (ผู้ใช้ขอเอง 2026-09-12)
   → ดึงจากคลังคำที่มีอยู่แล้ว ไม่เขียนความหมายซ้ำลงในไฟล์ประโยค (แก้คำแปลที่เดียวแล้วตามกันหมด)

   ลำดับที่ค้น: คำศัพท์ในบท (บทแรกที่สอนชนะ) → HSK 1 → วลี → EXTRA ด้านล่าง → แตกทีละตัวอักษร
   เทสคุมที่ sentence.test.ts ว่าทุก token ในทุกประโยคต้องมีความหมาย */
import { lessons } from '../data/lessons'
import { hsk1Extra } from '../data/hsk1'

/** token ที่โผล่ในประโยคแต่ไม่ได้เป็นคำศัพท์/วลีของบทไหน (คำประกอบ ตัวเลข ชื่อประเทศ) */
const EXTRA: Record<string, string> = {
  全家: 'ทั้งครอบครัว',
  这个: 'อันนี้',
  那个: 'อันนั้น',
  二十九: 'ยี่สิบเก้า',
  十五: 'สิบห้า',
  好吃: 'อร่อย',
  下个: '(…) หน้า / ถัดไป',
  是不是: 'ใช่ไหม',
  韩国: 'เกาหลี',
  点儿: 'หน่อย',
  比: 'กว่า (เปรียบเทียบ)',
  有点儿: 'ค่อนข้าง / นิดหน่อย',
  今年: 'ปีนี้',
  星期三: 'วันพุธ',
  星期六: 'วันเสาร์',
  可以: 'ได้ / สามารถ',
  常常: 'บ่อยๆ',
  网上: 'ในอินเทอร์เน็ต',
  下班: 'เลิกงาน',
  以后: 'หลังจาก',
  早上: 'ตอนเช้า',
  一下: 'หน่อย / สักครั้ง',
  上海: 'เซี่ยงไฮ้',
}

const PUNC = /[\s,.!?;:()，。！？、；：（）《》]/g

let map: Map<string, string> | null = null
function dict() {
  if (map) return map
  map = new Map()
  const add = (zh: string, th: string) => { if (!map!.has(zh)) map!.set(zh, th) }
  // คำศัพท์ทุกบทก่อนวลี — วลีอย่าง 好的 ต้องไม่ไปบังคำศัพท์
  for (const L of lessons) for (const w of L.vocab) add(w.zh, w.th)
  for (const w of hsk1Extra) add(w.zh, w.th)
  for (const L of lessons) for (const p of L.phrases) add(p.zh, p.th)
  for (const [zh, th] of Object.entries(EXTRA)) add(zh, th)
  return map
}

/** ความหมายเต็ม (อาจมีหลายความหมายคั่น " / ") — '' ถ้าไม่รู้จัก */
export function glossFull(zh: string): string {
  const k = zh.replace(PUNC, '')
  if (!k) return ''
  const hit = dict().get(k)
  if (hit) return hit
  const chars = [...k].map((c) => dict().get(c))
  return chars.every(Boolean) ? chars.map((t) => shorten(t!)).join(' + ') : ''
}

/** ความหมายสั้นสำหรับไทล์ — เอาความหมายแรก ตัดวงเล็บอธิบายออก (ไทล์กว้างไม่พอ) */
export function glossShort(zh: string): string {
  return shorten(glossFull(zh))
}

function shorten(th: string): string {
  const first = th.split(' / ')[0]
  const cut = first.replace(/\s*\([^)]*\)\s*/g, ' ').trim()
  return cut || first   // ความหมายที่มีแต่วงเล็บ เช่น "(คำถาม)" ห้ามกลายเป็นว่าง
}
