import { useEffect, useMemo, useRef, useState } from 'react'
import { sentenceCats } from '../data/sentences'
import type { Sentence } from '../data/types'
import { allSentences, shuffle } from '../lib/pools'
import { ROUND_SENTENCES, buildRound, clearWrong, markWrong, wrongCountIn } from '../lib/session'
import { playSound } from '../lib/tts'
import { LSN_ALL, lsnKey, matchLsn } from '../lib/lsn'
import { glossFull, glossShort } from '../lib/gloss'
import { answerSeqs, fitsPrefix, goodPrefix, isAnswer, nextTokens } from '../lib/sentence'
import { KEYS, readRaw, writeRaw } from '../lib/storage'
import { LessonPick, lsnLabel, useDrillLsn } from '../components/LessonPick'
import { Chips, DoneCard, EmptyNote, Progress, RoundNote, ScoreBar } from '../components/ui'

/** คีย์ของประโยค = ตัวจีนที่ต่อกันแล้ว (ใช้จำว่าประโยคไหนเคยเรียงผิด) */
const sentenceKey = (s: Sentence) => s.tokens.map((t) => t.zh).join('')

type Tile = { zh: string; py: string; id: number }
type Phase = 'build' | 'solved' | 'revealed'
type Mode = 'guided' | 'free'
type Msg = { kind: 'err' | 'tip' | 'ok'; text: string } | null

/* ผู้ใช้เรียงแบบเดิมไม่ได้เลย (2026-09-12: "ทำเท่าไหร่ก็ทำไม่ถูกสักที")
   เดิมต้องวางครบทุกคำก่อนถึงจะรู้ว่าผิด แล้วไม่บอกว่าผิดตรงไหน ต้องล้างเริ่มใหม่ทั้งประโยค
   → โหมดช่วย (ค่าเริ่มต้น): รับเฉพาะคำถัดไปที่ถูก คำผิดเด้งกลับทันที ผิด 2 ครั้งติดชี้คำให้เอง
   → โหมดเรียงเอง: แบบเดิม แต่ตอนตรวจชี้เป็นสีแดง "ตั้งแต่คำแรกที่ผิดไปจนสุด" แตะเอาออกเฉพาะตัวแดงได้
     (ห้ามชี้เป็นรายตำแหน่ง — ดูเหตุผลที่ goodPrefix ใน lib/sentence.ts)
   ทั้งสองโหมด: ใช้ตัวช่วยหรือเคยผิด = ข้อนี้นับว่าผิด และจะกลับมาถามอีก (เหมือนเดิม) */
const MODES: { v: Mode; label: string }[] = [
  { v: 'guided', label: '🤝 โหมดช่วย' },
  { v: 'free', label: '🧠 เรียงเอง' },
]
const MODE_DESC: Record<Mode, string> = {
  guided: 'แตะคำทีละคำตามลำดับ — ถ้าผิดคำจะเด้งกลับ ไม่ต้องเริ่มใหม่',
  free: 'เรียงให้ครบก่อนแล้วค่อยตรวจ — คำที่ผิดจะเป็นสีแดง',
}

const stripPunc = (zh: string) => zh.replace(/[\s,.!?;:()，。！？、；：（）《》]/g, '')

export function SentenceScreen() {
  const [cat, setCat] = useState('all')
  const [lsn, setLsn] = useDrillLsn()
  const [nonce, setNonce] = useState(0)
  const [mode, setModeState] = useState<Mode>(() => (readRaw(KEYS.sbMode) === 'free' ? 'free' : 'guided'))
  const setMode = (m: Mode) => {
    setModeState(m)
    writeRaw(KEYS.sbMode, m)
  }

  /** ข้อของหมวดที่เลือก (ยังไม่กรองบท) — ใช้ทั้งสร้างชุดและนับว่าบทไหนมีข้อกี่ข้อ */
  const inCat = useMemo(() => allSentences.filter((s) => cat === 'all' || s.cat === cat), [cat])
  const source = useMemo(() => inCat.filter((s) => matchLsn(lsn, s.lsn)), [inCat, lsn])
  const countIn = useMemo(() => {
    const n = new Map<string, number>()
    for (const s of inCat) n.set(lsnKey(s.lsn), (n.get(lsnKey(s.lsn)) ?? 0) + 1)
    return (k: string) => n.get(k) ?? 0
  }, [inCat])

  // รอบละ 20 ประโยค (เรียงคำใช้เวลากว่าตอบคำเดี่ยว) + เอาประโยคที่เคยผิดกลับมาถาม
  const queue = useMemo(
    () => buildRound(source, ROUND_SENTENCES, sentenceKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source, nonce],
  )

  const [idx, setIdx] = useState(0)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [placed, setPlaced] = useState<Tile[]>([])
  const [bank, setBank] = useState<Tile[]>([])
  const [phase, setPhase] = useState<Phase>('build')
  const [shake, setShake] = useState(false)
  const [missed, setMissed] = useState(false)       // ข้อนี้เคยผิด/ใช้ตัวช่วย → ไม่นับว่าถูก
  const [bad, setBad] = useState<Set<number>>(new Set())   // ไทล์ที่วางผิดตำแหน่ง (โหมดเรียงเอง)
  const [flashId, setFlashId] = useState<number | null>(null) // ไทล์ที่เพิ่งแตะผิด (โหมดช่วย)
  const [hintId, setHintId] = useState<number | null>(null)
  const [tries, setTries] = useState(0)             // แตะผิดติดกันกี่ครั้งที่ตำแหน่งนี้
  const [msg, setMsg] = useState<Msg>(null)
  const flashTimer = useRef<number>()

  const cur: Sentence | undefined = queue[idx]
  const seqs = useMemo(() => (cur ? answerSeqs(cur) : []), [cur])

  // ขึ้นข้อใหม่ / เปลี่ยนโหมด: สับไทล์ (ห้ามสับได้ลำดับที่ถูกอยู่แล้ว ไม่งั้นกดผ่านฟรี)
  useEffect(() => {
    if (!cur) return
    const tiles = cur.tokens.map((t, i) => ({ zh: t.zh, py: t.py, id: i }))
    let order = shuffle(tiles)
    if (tiles.length > 1) {
      let guard = 0
      while (isAnswer(seqs, order.map((t) => t.zh)) && guard++ < 20) order = shuffle(tiles)
    }
    setBank(order)
    setPlaced([])
    setPhase('build')
    setMissed(false)
    setBad(new Set())
    setHintId(null)
    setFlashId(null)
    setTries(0)
    setMsg(null)
  }, [cur, seqs, mode])

  useEffect(() => {
    setIdx(0)
    setRight(0)
    setWrong(0)
  }, [cat, lsn])

  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  const filters = (
    <>
      <Chips label="หมวด" items={sentenceCats.map((c) => ({ v: c.k, label: c.label }))} value={cat} onChange={setCat} />
      <LessonPick value={lsn} onChange={setLsn} count={countIn} />
    </>
  )

  // ⚠️ ต้องโชว์แถบเลือกด้วย — เดิม return DoneCard เปล่า เลือกชุดที่ไม่มีข้อแล้วออกไม่ได้
  if (!queue.length) {
    return (
      <div className="stack">
        {filters}
        <EmptyNote>
          🧩 ไม่มีประโยคของ{lsn === LSN_ALL ? 'หมวดนี้' : `${lsnLabel(lsn)} ในหมวดนี้`}
          <br />
          เปลี่ยนหมวดเป็น "ทั้งหมด" หรือเลือกบทอื่นด้านบน
        </EmptyNote>
      </div>
    )
  }

  if (idx >= queue.length) {
    return (
      <div className="stack">
        {filters}
        <DoneCard right={right} total={right + wrong} onRestart={() => { setIdx(0); setRight(0); setWrong(0); setNonce((n) => n + 1) }} />
      </div>
    )
  }

  const zhFull = cur!.tokens.map((t) => t.zh).join('')
  const pyFull = cur!.tokens.map((t) => t.py).join(' ')
  const placedIds = new Set(placed.map((t) => t.id))
  const answered = phase !== 'build'

  /** ข้อนี้ไม่นับว่าถูกแล้ว — จดลงรายการถามซ้ำครั้งเดียวพอ */
  const miss = () => {
    if (!missed) markWrong(zhFull)
    setMissed(true)
  }

  const solve = () => {
    setPhase('solved')
    setHintId(null)
    if (!missed) {
      setRight((n) => n + 1)
      clearWrong(zhFull) // เรียงถูกตั้งแต่ครั้งแรก = ผ่านจริง ลบออกจากรายการถามซ้ำ
      setMsg({ kind: 'ok', text: '🎉 ถูกต้อง!' })
    } else {
      setWrong((n) => n + 1)
      setMsg({ kind: 'ok', text: '✓ เรียงเสร็จแล้ว — ข้อนี้จะกลับมาให้ฝึกอีกรอบ' })
    }
    playSound(zhFull)
  }

  /** ชี้คำถัดไปที่ถูก — ถ้าวางผิดอยู่ ต้องเอาคำผิดออกก่อนถึงจะชี้ต่อได้ */
  const showHint = (zhs: string[], used: Set<number>) => {
    miss()
    if (!fitsPrefix(seqs, zhs)) {
      setBad(new Set(placed.slice(goodPrefix(seqs, zhs)).map((t) => t.id)))
      setMsg({ kind: 'tip', text: 'แตะคำสีแดงเพื่อเอาออกก่อน' })
      return
    }
    const want = nextTokens(seqs, zhs)
    const tile = bank.find((b) => !used.has(b.id) && want[0] === b.zh) ?? bank.find((b) => !used.has(b.id) && want.includes(b.zh))
    if (!tile) return
    setHintId(tile.id)
    setMsg({ kind: 'tip', text: `💡 คำถัดไปคือ "${tile.py}" (${glossShort(tile.zh)})` })
  }

  const place = (t: Tile) => {
    if (answered) return
    const zhs = placed.map((x) => x.zh)

    if (mode === 'guided' && !fitsPrefix(seqs, [...zhs, t.zh])) {
      miss()
      window.clearTimeout(flashTimer.current)
      setFlashId(t.id)
      flashTimer.current = window.setTimeout(() => setFlashId(null), 450)
      const n = tries + 1
      setTries(n)
      // ผิด 2 ครั้งติดที่ตำแหน่งเดิม = ติดจริงแล้ว ชี้ให้เลย ไม่ปล่อยให้เดาสุ่มจนท้อ
      if (n >= 2) showHint(zhs, placedIds)
      else setMsg({ kind: 'err', text: `ยังไม่ใช่ "${t.py}" — ลองคำอื่นดูนะ` })
      return
    }

    const next = [...placed, t]
    setPlaced(next)
    setTries(0)
    setHintId(null)
    setMsg(null)
    if (next.length !== cur!.tokens.length) return

    const nextZh = next.map((x) => x.zh)
    if (isAnswer(seqs, nextZh)) return solve()
    // มาถึงตรงนี้ได้แค่โหมดเรียงเอง (โหมดช่วยกันคำผิดไว้ตั้งแต่ตอนแตะแล้ว)
    miss()
    setBad(new Set(next.slice(goodPrefix(seqs, nextZh)).map((t) => t.id)))
    setMsg({ kind: 'err', text: 'ยังไม่ถูก — แตะคำสีแดงเพื่อเอาออก แล้วเรียงต่อจากคำที่เหลือ' })
    setShake(true)
    window.setTimeout(() => setShake(false), 320)
  }

  const unplace = (t: Tile) => {
    if (answered) return
    // โหมดช่วย: เอาออกได้ทีละคำจากท้าย — ถ้าถอดตรงกลาง คำหลังจากนั้นจะไม่ต่อกันแล้ว
    const keep = mode === 'guided' ? placed.slice(0, placed.findIndex((x) => x.id === t.id)) : placed.filter((x) => x.id !== t.id)
    setPlaced(keep)
    const nb = new Set(bad)
    nb.delete(t.id)
    setBad(nb)
    if (!nb.size) setMsg(null)
    setHintId(null)
  }

  const reveal = () => {
    setPlaced(cur!.tokens.map((t, i) => ({ zh: t.zh, py: t.py, id: i })))
    setPhase('revealed')
    setBad(new Set())
    setHintId(null)
    setMsg(null)
    setWrong((n) => n + 1)
    if (!missed) markWrong(zhFull)
    playSound(zhFull)
  }

  const next = () => setIdx((i) => i + 1)
  const slotsLeft = cur!.tokens.length - placed.length

  const tileBody = (t: Tile) => (
    <>
      <b className="py">{t.py}</b>
      <span className="th">{glossShort(t.zh)}</span>
      <span className="zh">{t.zh}</span>
    </>
  )

  return (
    <div className="stack">
      {filters}
      <RoundNote size={queue.length} total={source.length} wrong={wrongCountIn(source, sentenceKey)} />
      <ScoreBar right={right} wrong={wrong} />

      <div className="card card-pad drill">
        <Chips label="วิธีเล่น" items={MODES} value={mode} onChange={setMode} />
        <div className="sb-mode-desc">{MODE_DESC[mode]}</div>

        <div className="drill-num">
          ประโยคที่ {idx + 1} / {queue.length}
        </div>
        <div className="sb-prompt">{cur!.th}</div>
        {cur!.note && <div className="sb-note">💡 {cur!.note}</div>}

        <div className={`sb-answer ${answered ? 'ok' : ''} ${shake ? 'shake' : ''}`}>
          {placed.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tile ${bad.has(t.id) ? 'bad' : ''}`}
              disabled={answered}
              onClick={() => unplace(t)}
            >
              {tileBody(t)}
            </button>
          ))}
          {/* ช่องว่างบอกว่าเหลืออีกกี่คำ — ผู้เริ่มต้นรู้ว่าต้องเรียงยาวแค่ไหน */}
          {!answered && Array.from({ length: slotsLeft }, (_, i) => <span key={i} className="sb-slot" aria-hidden="true" />)}
        </div>

        <div className={`sb-msg ${msg?.kind ?? ''}`} role="status">{msg?.text ?? ' '}</div>

        {answered && (
          <>
            <div className="reveal">
              <div className="py" style={{ fontSize: 15 }}>{pyFull}</div>
              <div className="zh" style={{ fontSize: 17, fontWeight: 700 }}>{zhFull}</div>
            </div>
            {/* ทวนคำศัพท์ในประโยค — ผู้ใช้อยากรู้คำศัพท์ไปด้วยเพื่อแต่งประโยคเองได้ */}
            <div className="sb-words">
              <div className="sb-words-title">📖 คำศัพท์ในประโยคนี้ · แตะเพื่อฟัง</div>
              {cur!.tokens.map((t, i) => (
                <button key={i} type="button" className="sb-word" onClick={() => playSound(stripPunc(t.zh))}>
                  <b className="py">{t.py.replace(/[,.!?]$/, '')}</b>
                  <span className="zh">{stripPunc(t.zh)}</span>
                  <span className="th">{glossFull(t.zh)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {!answered && (
          <div className="sb-bank">
            {bank.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tile ${placedIds.has(t.id) ? 'used' : ''} ${flashId === t.id ? 'flash' : ''} ${hintId === t.id ? 'hint' : ''}`}
                disabled={placedIds.has(t.id)}
                onClick={() => place(t)}
              >
                {tileBody(t)}
              </button>
            ))}
          </div>
        )}

        {/* ⚠️ ห้ามเด้งข้อถัดไปเอง — ต้องมีเวลาทวนเฉลยและคำศัพท์ (ของเดิมออโต้ 2 วิ เร็วเกินไป) */}
        <div className="drill-acts">
          {phase === 'build' ? (
            <>
              <button type="button" className="btn" onClick={() => { setPlaced([]); setBad(new Set()); setMsg(null) }} disabled={!placed.length}>
                ↺ ล้าง
              </button>
              <button type="button" className="btn" onClick={() => showHint(placed.map((x) => x.zh), placedIds)}>
                💡 คำใบ้
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
