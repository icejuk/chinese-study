import { useEffect, useRef, useState } from 'react'
import type { DrillItem } from '../lib/pools'
import { pyCheck } from '../lib/pinyin'
import { addStar, srsUpdate } from '../lib/srs'
import { ROUND_WORDS, buildRound, clearWrong, markWrong, wrongCountIn } from '../lib/session'
import { DoneCard, Progress, RoundNote, ScoreBar } from './ui'
import { TapToSpeak } from './SpeakButton'

type Phase = 'ask' | 'right' | 'wrong'

/** แบบฝึกพิมพ์พินอิน — ใช้ทั้งในบท (คำของบทนั้น) และแท็บพิมพ์พินอิน (ทุกบท) */
export function TypeDrill({
  pool,
  emptyMsg = 'ยังไม่มีคำในชุดนี้',
  resetKey,
}: {
  pool: DrillItem[]
  emptyMsg?: string
  /** เปลี่ยนค่านี้ = เริ่มชุดใหม่ (เช่นสลับบท/สลับชุดคำ) */
  resetKey?: string | number
}) {
  const [queue, setQueue] = useState<DrillItem[]>(() => buildRound(pool, ROUND_WORDS, (w) => w.zh))
  const [idx, setIdx] = useState(0)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [phase, setPhase] = useState<Phase>('ask')
  const [value, setValue] = useState('')
  const [hintUmlaut, setHintUmlaut] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | null>(null)

  const item = queue[idx]
  const done = idx >= queue.length

  const restart = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setQueue(buildRound(pool, ROUND_WORDS, (w) => w.zh))
    setIdx(0)
    setRight(0)
    setWrong(0)
    setPhase('ask')
    setValue('')
  }

  // สลับบท/สลับชุด = เริ่มใหม่ (ไม่ผูกกับ pool ตรงๆ เพราะ pool สร้างใหม่ทุก render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => restart(), [resetKey])

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  // ⚠️ ห้ามเล่นเสียงเอง — ผู้ใช้ไม่ต้องการเสียงเด้งตอนเข้าหน้า/ขึ้นคำใหม่ ให้กดปุ่มฟังเอง
  useEffect(() => {
    if (!item) return
    inputRef.current?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, queue])

  const next = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setPhase('ask')
    setValue('')
    setHintUmlaut(false)
    setIdx((i) => i + 1)
  }

  const finish = (ok: boolean) => {
    if (!item) return
    setPhase(ok ? 'right' : 'wrong')
    if (ok) setRight((n) => n + 1)
    else setWrong((n) => n + 1)
    // SRS + ดาว เฉพาะคำศัพท์ — วลีไม่อยู่ในคลังคำ เขียนไปก็ไม่โผล่ที่ไหน
    if (item.kind === 'vocab') {
      srsUpdate(item.zh, ok)
      if (!ok) addStar(item.zh)
    }
    // รายการข้อที่ต้องถามซ้ำ (ใช้กับวลีด้วยได้ ไม่ผูกกับคลังคำเหมือน SRS)
    if (ok) clearWrong(item.zh)
    else markWrong(item.zh)
    // ตอบถูกไปต่อเองไว / ตอบผิดหยุดรอให้กดเอง เพราะต้องมีเวลาอ่านเฉลย
    // (ตอบผิดก็ไม่อ่านเสียงให้เอง — อยากฟังกดปุ่มฟังเสียงได้)
    if (ok) timer.current = window.setTimeout(next, 1200)
  }

  const submit = () => {
    if (!item || phase !== 'ask') return
    const res = pyCheck(value, item.py)
    if (res.ok) return finish(true)
    if (res.why === 'empty') {
      inputRef.current?.focus()
      return
    }
    setHintUmlaut(res.why === 'umlaut')
    finish(false)
  }

  const total = queue.length
  if (!total || done) {
    return (
      <DoneCard
        right={right}
        total={total ? right + wrong : 0}
        onRestart={restart}
        note={!total ? <div className="muted">{emptyMsg}</div> : undefined}
      />
    )
  }

  return (
    <div className="stack">
      <RoundNote size={total} total={pool.length} wrong={wrongCountIn(pool, (w) => w.zh)} />
      <ScoreBar right={right} wrong={wrong} />

      <div className="card card-pad drill">
        <div className="drill-num">
          ข้อ {idx + 1} / {total}
        </div>
        {/* โจทย์ทั้งก้อนคือปุ่มฟังเสียง — แตะที่ไหนก็ได้ */}
        <TapToSpeak zh={item.zh}>
          <div className="drill-th">{item.th}</div>
          <div className={`drill-zh zh ${item.zh.length > 4 ? 'sm' : ''}`}>{item.zh}</div>
        </TapToSpeak>

        <input
          ref={inputRef}
          className={`input mono ${phase === 'right' ? 'ok' : phase === 'wrong' ? 'bad' : ''}`}
          type="text"
          placeholder="พินอิน"
          value={value}
          readOnly={phase !== 'ask'}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-label="พิมพ์พินอิน"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            if (phase === 'ask') submit()
            else next()
          }}
        />

        {phase === 'ask' ? (
          <div className="muted drill-hint">กด Enter เพื่อตรวจ · ü พิมพ์เป็น v หรือ u:</div>
        ) : (
          <div className={`fb ${phase === 'right' ? 'ok' : 'bad'}`}>
            {phase === 'right'
              ? '✓ ถูกต้อง!'
              : hintUmlaut
                ? '✗ ü ต้องพิมพ์เป็น v หรือ u:'
                : '✗ ยังไม่ถูก'}
          </div>
        )}

        {phase !== 'ask' && (
          <div className="reveal">
            เฉลย: <b className="mono">{item.py}</b>
            {item.en ? <span className="muted"> · {item.en}</span> : null}
          </div>
        )}

        <div className="drill-acts">
          {phase === 'ask' ? (
            <>
              <button type="button" className="btn" onClick={() => finish(false)}>
                👁 ดูเฉลย
              </button>
              <button type="button" className="btn btn-primary btn-block" onClick={submit}>
                ตรวจ
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-primary btn-block btn-lg" onClick={next}>
              ข้อถัดไป →
            </button>
          )}
        </div>
      </div>

      <Progress value={idx} max={total} />
    </div>
  )
}
