import { useEffect, useMemo, useRef, useState } from 'react'
import type { Word } from '../data/types'
import { allWords, addStar, dueWords, srsUpdate, starsGet, weakWords } from '../lib/srs'
import { shuffle } from '../lib/pools'
import { pickDistractors } from '../lib/quiz'
import { playSound } from '../lib/tts'
import { Chips, DoneCard, EmptyNote, Progress, ScoreBar } from '../components/ui'
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
  const [nonce, setNonce] = useState(0)

  const pool = useMemo(() => {
    const stars = starsGet()
    const src = set === 'star' ? allWords().filter((w) => stars.has(w.zh)) : set === 'due' ? dueWords() : allWords()
    return shuffle(src)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, nonce])

  const [idx, setIdx] = useState(0)
  const [right, setRight] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const timer = useRef<number | null>(null)
  /** ธงว่า "ข้อถัดไปให้อ่านให้ฟังเอง" — ตั้งเมื่อตอบถูก */
  const playNext = useRef(false)

  const restart = () => {
    if (timer.current) window.clearTimeout(timer.current)
    playNext.current = false
    setIdx(0)
    setRight(0)
    setWrong(0)
    setPicked(null)
    setNonce((n) => n + 1)
  }

  // เปลี่ยนชุด/ทิศทาง = เริ่มใหม่ (ล้างธงเสียงด้วย ไม่งั้นสลับโหมดแล้วมีเสียงเด้งค้างมา)
  useEffect(() => {
    playNext.current = false
    setIdx(0)
    setRight(0)
    setWrong(0)
    setPicked(null)
  }, [dir, set])

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

  /* อ่านให้ฟังเองเมื่อขึ้นข้อใหม่ ใน 2 กรณี
     · โหมดฟัง — เสียงคือตัวโจทย์
     · ตอบถูกแล้วไปข้อถัดไป (โหมดจีน→ไทย) — ตอบถูกไม่ต้องฟังคำเดิมซ้ำ เอาเวลาไปฟังคำใหม่เลย
     ห้ามทำในโหมดไทย→พินอิน เพราะเสียงคือคำตอบ จะเฉลยให้ฟรี */
  useEffect(() => {
    if (!q) return
    if (dir === 'listen' || (playNext.current && dir === 'zh2th')) playSound(q.zh)
    playNext.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, dir, pool])

  if (!pool.length) {
    return (
      <div className="stack">
        <Chips label="ชุดคำ" items={SETS} value={set} onChange={setSet} />
        <EmptyNote>
          {set === 'star' ? (
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
    // ตอบผิด: อ่านคำที่ถูกให้ฟังทันที · ตอบถูก: ข้ามไปอ่านคำของข้อถัดไปแทน (ตั้งธงไว้)
    if (ok) playNext.current = true
    else playSound(q!.zh)
    timer.current = window.setTimeout(() => {
      setPicked(null)
      setIdx((i) => i + 1)
    }, ok ? 900 : 1900)
  }

  return (
    <div className="stack">
      <Chips label="ทิศทาง" items={DIRS} value={dir} onChange={setDir} />
      <Chips label="ชุดคำ" items={SETS} value={set} onChange={setSet} />
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
