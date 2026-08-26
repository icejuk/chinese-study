/* แถบเลือกบทของแบบฝึก — ใช้ร่วมกันทั้งควิซ / เรียงประโยค / ฟังแปล
   จำค่าที่เลือกไว้คีย์เดียว: เลือก "บท 16" ที่ควิซแล้วเดินไปเรียงประโยคก็ยังเป็นบท 16
   (เพิ่งเรียนบทไหนก็อยากฝึกบทนั้นทั้งสามแบบฝึก ไม่ต้องเลือกซ้ำ 3 ที่) */
import { useEffect, useState } from 'react'
import { LSN_ALL, LSN_CHIPS, type LsnKey } from '../lib/lsn'
import { KEYS, readRaw, writeRaw } from '../lib/storage'
import { Chips } from './ui'

const valid = (v: unknown): v is LsnKey => typeof v === 'string' && LSN_CHIPS.some((c) => c.v === v)

export function useDrillLsn() {
  const [lsn, setLsn] = useState<LsnKey>(() => {
    const saved = readRaw(KEYS.drillLsn)
    return valid(saved) ? saved : LSN_ALL
  })
  useEffect(() => writeRaw(KEYS.drillLsn, lsn), [lsn])
  return [lsn, setLsn] as const
}

export function LessonPick({
  value,
  onChange,
  count,
}: {
  value: LsnKey
  onChange: (v: LsnKey) => void
  /** จำนวนข้อของบทนั้นในแบบฝึกนี้ — บทที่ได้ 0 จะทึบลง ไม่ให้กดไปเจอหน้าว่างแบบไม่รู้ตัว
      (บท 1 สอนแต่ตัวอักษร/ตัวเลข เรียงเป็นประโยคไม่ได้เลย จึงว่างจริงในแบบฝึกเรียงประโยค) */
  count?: (k: LsnKey) => number
}) {
  const items = count
    ? LSN_CHIPS.map((c) =>
        c.v !== LSN_ALL && count(c.v) === 0
          ? { ...c, className: [c.className, 'chip-off'].filter(Boolean).join(' ') }
          : c,
      )
    : LSN_CHIPS
  // Chips เลื่อนตัวที่เลือกมาให้เห็นเองแล้ว (ค่านี้จำข้ามแท็บ ต้องเห็นชัดว่ากรองบทไหนอยู่)
  return <Chips label="เลือกบท" items={items} value={value} onChange={onChange} variant="num" />
}

/** บอกว่าตอนนี้กรองอยู่บทไหน — โชว์คู่กับตอนที่ไม่มีข้อในบทนั้น */
export const lsnLabel = (v: LsnKey) =>
  v === LSN_ALL ? 'ทุกบท' : v === 'hsk1' ? 'ชุดคำ HSK 1' : `บทที่ ${v}`
