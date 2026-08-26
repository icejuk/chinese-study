import { useEffect, useRef, type ReactNode } from 'react'

export function Chips<T extends string>({
  items,
  value,
  onChange,
  variant = 'pill',
  label,
}: {
  items: { v: T; label: string; className?: string }[]
  value: T
  onChange: (v: T) => void
  variant?: 'pill' | 'num'
  label?: string
}) {
  const box = useRef<HTMLDivElement>(null)

  /* แถบชิปเลื่อนแนวนอนได้ ตัวที่เลือกอาจอยู่นอกจอ (แถบเลือกบทมี 18 ตัว, หมวดประโยคมี 11 ตัว)
     ถ้าไม่เลื่อนมาให้เห็น ผู้ใช้จะไม่รู้ว่ากรองอะไรอยู่ — เคยเจอตอนเลือกบท 16 แล้วเห็นแต่ "ทุกบท"
     block: 'nearest' บังคับไว้ ไม่ให้มันดึงหน้าเลื่อนขึ้น-ลงตามไปด้วย · แถบที่พออยู่ในจอจะไม่ขยับ */
  useEffect(() => {
    box.current?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [value])

  return (
    <div ref={box} className="chips" role="tablist" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.v}
          role="tab"
          type="button"
          className={`${variant === 'num' ? 'chip-num' : 'chip'}${it.className ? ` ${it.className}` : ''}`}
          aria-selected={value === it.v}
          onClick={() => onChange(it.v)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

/** บอกว่ารอบนี้เอามากี่ข้อจากทั้งคลัง และมีข้อที่เคยตอบผิดปนมาด้วยกี่ข้อ */
export function RoundNote({ size, total, wrong }: { size: number; total: number; wrong: number }) {
  return (
    <div className="muted">
      รอบนี้ {size} จาก {total} ข้อ
      {wrong > 0 && <> · เอาข้อที่เคยผิด {wrong} ข้อกลับมาถามด้วย</>}
    </div>
  )
}

export function ScoreBar({ right, wrong }: { right: number; wrong: number }) {
  return (
    <div className="card score">
      <div className="c">
        <b>{right}</b>
        <span>✓ ถูก</span>
      </div>
      <div className="w">
        <b>{wrong}</b>
        <span>✗ ผิด</span>
      </div>
      <div className="t">
        <b>{right + wrong}</b>
        <span>ข้อ</span>
      </div>
    </div>
  )
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <i style={{ width: pct + '%' }} />
    </div>
  )
}

/** หน้าจบชุด — ใช้ร่วมทุกแบบฝึก */
export function DoneCard({
  right,
  total,
  onRestart,
  note,
}: {
  right: number
  total: number
  onRestart: () => void
  note?: ReactNode
}) {
  const pct = total > 0 ? Math.round((right / total) * 100) : 0
  return (
    <div className="card card-pad done">
      <div className="done-ico">🎉</div>
      <div className="done-title">{total === 0 ? 'ยังไม่มีข้อในชุดนี้' : 'เก่งมาก!'}</div>
      {total > 0 && (
        <div className="muted">
          ถูก {right} / {total} ข้อ ({pct}%)
        </div>
      )}
      {note}
      <button type="button" className="btn btn-primary btn-lg" onClick={onRestart}>
        เริ่มใหม่
      </button>
    </div>
  )
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <div className="card card-pad muted" style={{ textAlign: 'center' }}>{children}</div>
}
