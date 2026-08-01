import { useEffect, useMemo, useState } from 'react'
import { allWordsPool, type WordSet } from '../lib/pools'
import { KEYS, readJson, writeJson } from '../lib/storage'
import { Chips } from '../components/ui'
import { TypeDrill } from '../components/TypeDrill'

const SETS: { v: WordSet; label: string }[] = [
  { v: 'all', label: 'ทุกคำ' },
  { v: 'star', label: '⭐ ยังไม่แม่น' },
  { v: 'due', label: '📅 ครบกำหนด' },
]

export function TypingScreen() {
  const [set, setSet] = useState<WordSet>(() => {
    const saved = readJson<{ src?: string }>(KEYS.typing, {}).src
    return SETS.some((s) => s.v === saved) ? (saved as WordSet) : 'all'
  })

  useEffect(() => writeJson(KEYS.typing, { src: set }), [set])

  const pool = useMemo(() => allWordsPool(set), [set])

  return (
    <div className="stack">
      <div className="section-title">พิมพ์พินอินจากคำแปลไทย · คำศัพท์ทุกบท ({pool.length} คำ)</div>
      <Chips label="ชุดคำ" items={SETS} value={set} onChange={setSet} />
      <TypeDrill
        pool={pool}
        resetKey={set}
        emptyMsg={
          set === 'star'
            ? 'ยังไม่มีคำที่ติดดาว — แตะดาวบนการ์ดคำที่ยังไม่แม่นก่อน'
            : 'ไม่มีคำที่ครบกำหนดทวนวันนี้ — เลือก "ทุกคำ" เพื่อฝึกเพิ่ม'
        }
      />
    </div>
  )
}
