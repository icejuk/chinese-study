import { useEffect, useMemo, useRef, useState } from 'react'
import { listenPool, type ListenItem, type ListenSrc } from '../lib/pools'
import { gradeThai } from '../lib/thai'
import { ROUND_SENTENCES, buildRound, clearWrong, markWrong, wrongCountIn } from '../lib/session'
import { playSound } from '../lib/tts'
import { KEYS, readRaw, writeRaw } from '../lib/storage'
import { Chips, DoneCard, Progress, RoundNote, ScoreBar } from '../components/ui'
import { SpeakButton } from '../components/SpeakButton'

const SRCS: { v: ListenSrc; label: string }[] = [
  { v: 'all', label: 'ทั้งหมด' },
  { v: 'sb', label: '🧩 ประโยค' },
  { v: 'dlg', label: '💬 สนทนา' },
  { v: 'ph', label: '🔤 วลี' },
]

type Phase = 'ask' | 'judge' | 'done'

/** ฟังเสียงประโยค → พิมพ์คำแปลไทย
    ตรวจคำหลักให้ แล้วผู้ใช้ตัดสินสุดท้ายเอง (คำแปลไทยเขียนได้หลายแบบ) */
export function ListenScreen() {
  const [src, setSrc] = useState<ListenSrc>(() => {
    const saved = readRaw(KEYS.listen)
    return SRCS.some((s) => s.v === saved) ? (saved as ListenSrc) : 'all'
  })
  const [nonce, setNonce] = useState(0)
  useEffect(() => writeRaw(KEYS.listen, src), [src])

  const source = useMemo(() => listenPool(src), [src])
  // รอบละ 20 ประโยค + เอาประโยคที่เคยตัดสินว่า "ยังไม่ถูก" กลับมาถามอีก
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queue = useMemo(() => buildRound(source, ROUND_SENTENCES, (x) => x.zh), [source, nonce])

  const [idx, setIdx] = useState(0)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<Phase>('ask')
  const [showPy, setShowPy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const item: ListenItem | undefined = queue[idx]
  const grade = useMemo(() => (item && phase !== 'ask' ? gradeThai(value, item) : null), [item, phase, value])

  useEffect(() => {
    setIdx(0)
    setRight(0)
    setWrong(0)
  }, [src])

  // ⚠️ ห้ามเล่นเสียงเอง — ผู้ใช้กดปุ่มฟังเองเมื่อพร้อม (เสียงเด้งตอนเข้าหน้าทำให้ตกใจ/ฟังไม่ทัน)
  useEffect(() => {
    if (!item) return
    setValue('')
    setPhase('ask')
    setShowPy(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, queue])

  if (!queue.length) return <DoneCard right={0} total={0} onRestart={() => setNonce((n) => n + 1)} />

  if (idx >= queue.length) {
    return (
      <div className="stack">
        <Chips label="แหล่งข้อ" items={SRCS} value={src} onChange={setSrc} />
        <DoneCard
          right={right}
          total={right + wrong}
          onRestart={() => { setIdx(0); setRight(0); setWrong(0); setNonce((n) => n + 1) }}
        />
      </div>
    )
  }

  const submit = () => {
    if (phase !== 'ask') return
    if (!value.trim()) {
      inputRef.current?.focus()
      return
    }
    setPhase('judge')
    setShowPy(true)
  }

  /** ผู้ใช้ตัดสินเอง: 1 แตะ = ให้คะแนน + ไปข้อถัดไป (ทวนได้นานเท่าที่อยากก่อนกด) */
  const judge = (ok: boolean) => {
    if (ok) {
      setRight((n) => n + 1)
      clearWrong(item!.zh)
    } else {
      setWrong((n) => n + 1)
      markWrong(item!.zh)
    }
    setIdx((i) => i + 1)
  }

  const revealOnly = () => {
    setPhase('done')
    setShowPy(true)
    setWrong((n) => n + 1)
    markWrong(item!.zh)
  }

  return (
    <div className="stack">
      <div className="section-title">ฟังประโยคแล้วพิมพ์คำแปลไทย ({queue.length} ประโยค)</div>
      <Chips label="แหล่งข้อ" items={SRCS} value={src} onChange={setSrc} />
      <RoundNote size={queue.length} total={source.length} wrong={wrongCountIn(source, (x) => x.zh)} />
      <ScoreBar right={right} wrong={wrong} />

      <div className="card card-pad drill">
        <div className="drill-num">
          ข้อ {idx + 1} / {queue.length}
        </div>

        <SpeakButton
          zh={item!.zh}
          size="xl"
          label="ฟังเสียงประโยค"
          hint="แตะฟังประโยคนี้ · ฟังกี่รอบก็ได้"
        />

        <div className="ln-py py">{showPy ? item!.py : ''}</div>

        <input
          ref={inputRef}
          className={`input thai ${phase === 'ask' ? '' : grade?.auto && grade.full ? 'ok' : 'bad'}`}
          type="text"
          placeholder="พิมพ์คำแปลไทย…"
          value={value}
          readOnly={phase !== 'ask'}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-label="พิมพ์คำแปลไทย"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            // หลังตรวจแล้วไม่ให้ Enter ข้ามข้อ ต้องกด ✓/✗ เอง
            if (phase === 'ask') submit()
          }}
        />

        {phase !== 'ask' && grade && (
          <div className={`fb ${!grade.auto ? '' : grade.full ? 'ok' : 'bad'}`}>
            {!grade.auto
              ? 'ประโยคนี้ตรวจอัตโนมัติไม่ได้ — เทียบกับเฉลยแล้วตัดสินเอง'
              : grade.full
                ? `✓ คำหลักครบทุกคำ (${grade.keywords.join(' · ')})`
                : `ตกคำว่า: ${grade.missing.join(' · ')}`}
          </div>
        )}

        {phase !== 'ask' && (
          <div className="reveal ln-ans">
            <div className="ln-ans-th">{item!.th}</div>
            <div className="py">{item!.py}</div>
            <div className="zh ln-ans-zh">{item!.zh}</div>
            {item!.note && <div className="muted">💡 {item!.note}</div>}
          </div>
        )}

        <div className="drill-acts">
          {phase === 'ask' && (
            <>
              <button type="button" className="btn" onClick={() => setShowPy(true)} disabled={showPy}>
                💡 ใบ้พินอิน
              </button>
              <button type="button" className="btn" onClick={revealOnly}>
                👁 เฉลย
              </button>
              <button type="button" className="btn btn-primary btn-block" onClick={submit}>
                ตรวจคำแปล
              </button>
            </>
          )}

          {phase === 'judge' && (
            <>
              <button type="button" className="btn" onClick={() => playSound(item!.zh)}>
                🔊 ฟังอีกครั้ง
              </button>
              <div className="judge-row">
                {/* ปุ่มที่ระบบเดาไว้จะทึบ — ถ้าตรวจอัตโนมัติไม่ได้ ไม่ทึบทั้งคู่ ไม่ชี้นำผิด */}
                <button
                  type="button"
                  className={`btn btn-ok ${grade?.auto && grade.full ? 'solid' : ''}`}
                  onClick={() => judge(true)}
                >
                  ✓ ฉันแปลถูก
                </button>
                <button
                  type="button"
                  className={`btn btn-err ${grade?.auto && !grade.full ? 'solid' : ''}`}
                  onClick={() => judge(false)}
                >
                  ✗ ยังไม่ถูก
                </button>
              </div>
            </>
          )}

          {phase === 'done' && (
            <>
              <button type="button" className="btn" onClick={() => playSound(item!.zh)}>
                🔊 ฟังอีกครั้ง
              </button>
              <button type="button" className="btn btn-primary btn-block btn-lg" onClick={() => setIdx((i) => i + 1)}>
                ข้อถัดไป →
              </button>
            </>
          )}
        </div>
      </div>

      <Progress value={idx} max={queue.length} />
    </div>
  )
}
