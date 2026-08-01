import { useEffect, useMemo, useState } from 'react'
import { sentenceCats, sentences } from '../data/sentences'
import type { Sentence } from '../data/types'
import { shuffle } from '../lib/pools'
import { playSound } from '../lib/tts'
import { Chips, DoneCard, Progress, ScoreBar } from '../components/ui'

type Tile = { zh: string; py: string; id: number }
type Phase = 'build' | 'solved' | 'revealed'

export function SentenceScreen() {
  const [cat, setCat] = useState('all')
  const [nonce, setNonce] = useState(0)

  const queue = useMemo(
    () => shuffle(cat === 'all' ? sentences : sentences.filter((s) => s.cat === cat)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cat, nonce],
  )

  const [idx, setIdx] = useState(0)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [placed, setPlaced] = useState<Tile[]>([])
  const [bank, setBank] = useState<Tile[]>([])
  const [phase, setPhase] = useState<Phase>('build')
  const [shake, setShake] = useState(false)
  const [missed, setMissed] = useState(false)   // ข้อนี้เคยเรียงผิด → ไม่นับว่าถูก

  const cur: Sentence | undefined = queue[idx]

  // ขึ้นข้อใหม่: สับไทล์ (ห้ามสับได้ลำดับที่ถูกอยู่แล้ว ไม่งั้นกดผ่านฟรี)
  useEffect(() => {
    if (!cur) return
    const tiles = cur.tokens.map((t, i) => ({ zh: t.zh, py: t.py, id: i }))
    let order = shuffle(tiles)
    if (tiles.length > 1) {
      let guard = 0
      while (order.every((t, i) => t.id === i) && guard++ < 20) order = shuffle(tiles)
    }
    setBank(order)
    setPlaced([])
    setPhase('build')
    setMissed(false)
  }, [cur])

  useEffect(() => {
    setIdx(0)
    setRight(0)
    setWrong(0)
  }, [cat])

  if (!queue.length) return <DoneCard right={0} total={0} onRestart={() => setNonce((n) => n + 1)} />

  if (idx >= queue.length) {
    return (
      <div className="stack">
        <Chips label="หมวด" items={sentenceCats.map((c) => ({ v: c.k, label: c.label }))} value={cat} onChange={setCat} />
        <DoneCard right={right} total={right + wrong} onRestart={() => { setIdx(0); setRight(0); setWrong(0); setNonce((n) => n + 1) }} />
      </div>
    )
  }

  const zhFull = cur!.tokens.map((t) => t.zh).join('')
  const pyFull = cur!.tokens.map((t) => t.py).join(' ')

  const place = (t: Tile) => {
    if (phase !== 'build') return
    const next = [...placed, t]
    setPlaced(next)
    if (next.length !== cur!.tokens.length) return
    // เรียงครบแล้ว → ตรวจ
    const ok = next.map((x) => x.zh).join('') === zhFull
    if (ok) {
      setPhase('solved')
      if (!missed) setRight((n) => n + 1)
      else setWrong((n) => n + 1)
      playSound(zhFull)
    } else {
      setMissed(true)
      setShake(true)
      window.setTimeout(() => setShake(false), 320)
    }
  }

  const unplace = (t: Tile) => {
    if (phase !== 'build') return
    setPlaced((p) => p.filter((x) => x.id !== t.id))
  }

  const reveal = () => {
    setPlaced(cur!.tokens.map((t, i) => ({ zh: t.zh, py: t.py, id: i })))
    setPhase('revealed')
    setWrong((n) => n + 1)
    playSound(zhFull)
  }

  const next = () => setIdx((i) => i + 1)
  const placedIds = new Set(placed.map((t) => t.id))
  const answered = phase !== 'build'

  return (
    <div className="stack">
      <Chips label="หมวด" items={sentenceCats.map((c) => ({ v: c.k, label: c.label }))} value={cat} onChange={setCat} />
      <ScoreBar right={right} wrong={wrong} />

      <div className="card card-pad drill">
        <div className="drill-num">
          ประโยคที่ {idx + 1} / {queue.length}
        </div>
        <div className="sb-prompt">{cur!.th}</div>
        {cur!.note && <div className="sb-note">💡 {cur!.note}</div>}

        <div className={`sb-answer ${phase === 'build' ? '' : 'ok'} ${shake ? 'shake' : ''}`}>
          {placed.length === 0 && <span className="muted">แตะคำด้านล่างมาเรียงตรงนี้</span>}
          {placed.map((t) => (
            <button key={t.id} type="button" className="tile" disabled={answered} onClick={() => unplace(t)}>
              <b className="py">{t.py}</b>
              <span className="zh">{t.zh}</span>
            </button>
          ))}
        </div>

        {answered && (
          <div className="reveal">
            <div className="py" style={{ fontSize: 15 }}>{pyFull}</div>
            <div className="zh" style={{ fontSize: 17, fontWeight: 700 }}>{zhFull}</div>
          </div>
        )}

        <div className="sb-bank">
          {bank.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tile ${placedIds.has(t.id) ? 'used' : ''}`}
              disabled={answered || placedIds.has(t.id)}
              onClick={() => place(t)}
            >
              <b className="py">{t.py}</b>
              <span className="zh">{t.zh}</span>
            </button>
          ))}
        </div>

        {/* ⚠️ ห้ามเด้งข้อถัดไปเอง — ต้องมีเวลาทวนเฉลย (ของเดิมออโต้ 2 วิ เร็วเกินไป) */}
        <div className="drill-acts">
          {phase === 'build' ? (
            <>
              <button type="button" className="btn" onClick={() => setPlaced([])} disabled={!placed.length}>
                ↺ ล้าง
              </button>
              <button type="button" className="btn" onClick={reveal}>
                👁 เฉลย
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn" onClick={() => playSound(zhFull)}>
                🔊 ฟังอีกครั้ง
              </button>
              <button type="button" className="btn btn-primary btn-block btn-lg" onClick={next}>
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
