import { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../data/types'
import { allWords, addStar, dueWords, srsUpdate, starsGet, weakWords } from '../lib/srs'
import { shuffle } from '../lib/pools'
import { pickDistractors } from '../lib/quiz'
import { ROUND_WORDS, buildRound, clearWrong, markWrong, wrongCountIn } from '../lib/session'
import { LSN_ALL, lsnKey, matchLsn, wordLsn } from '../lib/lsn'
import { LessonPick, lsnLabel, useDrillLsn } from '../components/LessonPick'
import { playSound } from '../lib/tts'
import { Chips, DoneCard, EmptyNote, Progress, RoundNote, ScoreBar } from '../components/ui'
import { SpeakButton, TapToSpeak } from '../components/SpeakButton'

type Dir = 'zh2th' | 'th2py' | 'listen'
type Set_ = 'all' | 'star' | 'due'

const DIRS: { v: Dir; label: string }[] = [
  { v: 'zh2th', label: 'จีน → ไทย' },
  { v: 'th2py', label: 'ไทย → พินอิน' },
  { v: 'listen', label: '🔊 ฟังเสียง' },
]

const SETS: { v: Set_; label: string }[] = [
  { v: 'all', label: 'ทุกคำ' },
  { v: 'star', label: '⭐ ยังไม่แม่น' },
  { v: 'due', label: '📅 ครบกำหนด' },
]

export function QuizScreen() {
  const [dir, setDir] = useState<Dir>('zh2th')
  const [set, setSet] = useState<Set_>('all')
  const [lsn, setLsn] = useDrillLsn()
  const [nonce, setNonce] = useState(0)

  /** คลังทั้งหมดของชุดที่เลือก (ยังไม่ตัดรอบ) — ใช้บอกจำนวนรวมและนับข้อที่เคยผิด */
  /** คำของชุดที่เลือก (ยังไม่กรองบท) — ใช้ทั้งสร้างชุดและนับว่าบทไหนมีคำกี่คำ */
  const inSet = useMemo(() => {
    const stars = starsGet()
    return set === 'star' ? allWords().filter((w) => stars.has(w.zh)) : set === 'due' ? dueWords() : allWords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, nonce])
  const source = useMemo(() => inSet.filter((w) => matchLsn(lsn, wordLsn(w.zh))), [inSet, lsn])
  const countIn = useMemo(() => {
    const n = new Map<string, number>()
    for (const w of inSet) {
      const l = wordLsn(w.zh)
      if (l !== undefined) n.set(lsnKey(l), (n.get(lsnKey(l)) ?? 0) + 1)
    }
    return (k: string) => n.get(k) ?? 0
  }, [inSet])

  // ตัดเป็นรอบละ 50 คำ — ทำทีเดียว 330 คำมันยาวเกินจะนั่งจบ
  const pool = useMemo(() => buildRound(source, ROUND_WORDS, (w) => w.zh), [source])
  const wrongInSource = useMemo(() => wrongCountIn(source, (w) => w.zh), [source])

  const [idx, setIdx] = useState(0)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const restart = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setIdx(0)
    setRight(0)
    setWrong(0)
    setPicked(null)
    setNonce((n) => n + 1)
  }

  // เปลี่ยนชุด/ทิศทาง = เริ่มใหม่
  useEffect(() => {
    setIdx(0)
    setRight(0)
    setWrong(0)
    setPicked(null)
  }, [dir, set, lsn])

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const q: Word | undefined = pool[idx]
  const field: 'th' | 'py' = dir === 'th2py' ? 'py' : 'th'

  const choices = useMemo(() => {
    if (!q) return []
    // ตัวเลือกลวงต้องใกล้เคียงคำตอบ ไม่งั้นเดาได้โดยไม่ต้องรู้คำศัพท์
    // โหมดฟัง: ตัวเลือกเป็นไทย แต่ต้องเลือกจากคำที่ "เสียงใกล้กัน" เพื่อวัดว่าฟังแยกออกจริง
    const by = dir === 'zh2th' ? 'meaning' : 'sound'
    return shuffle([q[field], ...pickDistractors(q, allWords(), field, by)])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, field, dir])

  // โหมดฟัง: เสียงคือตัวโจทย์ ต้องอ่านให้ทุกข้อ
  useEffect(() => {
    if (q && dir === 'listen') playSound(q.zh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, dir, pool])

  if (!pool.length) {
    return (
      <div className="stack">
        <Chips label="ชุดคำ" items={SETS} value={set} onChange={setSet} />
        <LessonPick value={lsn} onChange={setLsn} count={countIn} />
        <EmptyNote>
          {lsn !== LSN_ALL ? (
            <>
              📖 ไม่มีคำของ{lsnLabel(lsn)} ในชุดนี้
              <br />
              เลือก "ทุกบท" หรือเปลี่ยนชุดคำด้านบน
            </>
          ) : set === 'star' ? (
            <>
              ⭐ ยังไม่มีคำที่ติดดาว
              <br />
              แตะดาวมุมขวาบนของการ์ดคำที่ยังไม่แม่นก่อนนะ
            </>
          ) : (
            <>
              🎉 ไม่มีคำที่ครบกำหนดทวนวันนี้
              <br />
              เก่งมาก! กลับมาพรุ่งนี้ หรือเลือก "ทุกคำ" เพื่อฝึกเพิ่ม
            </>
          )}
        </EmptyNote>
      </div>
    )
  }

  if (idx >= pool.length) {
    const weak = weakWords(8)
    return (
      <div className="stack">
        <DoneCard
          right={right}
          total={right + wrong}
          onRestart={restart}
          note={
            weak.length ? (
              <div className="stats">
                <div className="section-title">คำที่ผิดบ่อย</div>
                {weak.map((w) => (
                  <div key={w.zh} className="stats-row">
                    <span className="zh">{w.zh}</span>
                    <span className="stats-info">
                      <b className="py">{w.py}</b> · {w.th}
                    </span>
                    <span className="stats-wrong">ผิด {w.wrong}</span>
                  </div>
                ))}
              </div>
            ) : undefined
          }
        />
      </div>
    )
  }

  const correct = q![field]
  const answer = (choice: string) => {
    if (picked) return
    setPicked(choice)
    const ok = choice === correct
    if (ok) setRight((n) => n + 1)
    else {
      setWrong((n) => n + 1)
      addStar(q!.zh)
    }
    srsUpdate(q!.zh, ok)
    // จดไว้ว่าคำนี้ยังไม่ผ่าน → รอบหน้าเอากลับมาถาม · ตอบถูกแล้วลบทิ้ง
    if (ok) clearWrong(q!.zh)
    else markWrong(q!.zh)
    /* ⚠️ ต้องเรียก playSound ตรงนี้ (ใน handler ของการแตะ) ห้ามย้ายไปใน setTimeout/useEffect
       iOS ยอมให้เล่นเสียงเฉพาะที่เริ่มจาก user gesture — ถ้าเรียกหลังหน่วงเวลา
       เดสก์ท็อปดังปกติแต่ iPhone เงียบสนิทโดยไม่มี error (เคยพลาดมาแล้ว)

       ตอบผิด → อ่านคำที่ถูกให้ฟัง · ตอบถูก → ข้ามการอ่านซ้ำ ไปอ่านคำของข้อถัดไปเลย
       (ยกเว้นโหมดไทย→พินอิน เพราะเสียงคือคำตอบ จะเฉลยให้ฟรี) */
    const next = pool[idx + 1]
    if (!ok) playSound(q!.zh)
    else if (dir === 'zh2th' && next) playSound(next.zh)
    timer.current = window.setTimeout(() => {
      setPicked(null)
      setIdx((i) => i + 1)
    }, ok ? 900 : 1900)
  }

  return (
    <div className="stack">
      <Chips label="ทิศทาง" items={DIRS} value={dir} onChange={setDir} />
      <Chips label="ชุดคำ" items={SETS} value={set} onChange={setSet} />
      <LessonPick value={lsn} onChange={setLsn} count={countIn} />
      <RoundNote size={pool.length} total={source.length} wrong={wrongInSource} />
      <ScoreBar right={right} wrong={wrong} />

      <div className="card card-pad drill">
        <div className="drill-num">
          ข้อ {idx + 1} / {pool.length}
        </div>

        {dir === 'zh2th' && (
          // ตัวจีน+พินอินทั้งก้อนคือปุ่มฟังเสียง
          <TapToSpeak zh={q!.zh}>
            <div className="quiz-zh zh">{q!.zh}</div>
            <div className="quiz-py py">{q!.py}</div>
          </TapToSpeak>
        )}
        {dir === 'th2py' && (
          <>
            <div className="quiz-prompt-th">{q!.th}</div>
            <div className="muted">เลือกพินอินที่ถูก</div>
          </>
        )}
        {dir === 'listen' && (
          <>
            <SpeakButton zh={q!.zh} size="xl" label="ฟังเสียงคำนี้" hint="แตะฟังอีกครั้ง" />
            {picked && (
              <div className="reveal">
                <b className="zh">{q!.zh}</b> · <b className="py">{q!.py}</b>
              </div>
            )}
          </>
        )}

        <div className="choices">
          {choices.map((c) => {
            const state = !picked ? '' : c === correct ? 'ok' : c === picked ? 'bad' : 'dim'
            return (
              <button
                key={c}
                type="button"
                className={`choice ${field === 'py' ? 'py' : ''} ${state}`}
                disabled={!!picked}
                onClick={() => answer(c)}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      <Progress value={idx} max={pool.length} />
    </div>
  )
}
