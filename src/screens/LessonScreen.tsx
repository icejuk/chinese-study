import { useEffect, useMemo, useState } from 'react'
import { lessons, speakerTh } from '../data/lessons'
import { KEYS, readRaw, writeRaw } from '../lib/storage'
import { loadNav, saveNav } from '../nav'
import { lessonDrillPool } from '../lib/pools'
import { isStarred, toggleStar } from '../lib/srs'
import { useSpeak } from '../components/SpeakButton'
import { Chips } from '../components/ui'
import { TypeDrill } from '../components/TypeDrill'
import { Hsk1Screen } from './Hsk1Screen'

type Mode = 'vocab' | 'dialogue' | 'notes' | 'drill'

/** จำนวนบรรทัดที่ "มีคนพูด" จริง — หัวข้อคั่นฉาก ({ sec }) ไม่ใช่บทสนทนา
    (บทที่มี 2 ฉากเคยโชว์เกินไป 2 บรรทัด) */
const dialogueLines = (L: typeof lessons[number]) => L.dialogue.filter((d) => !('sec' in d)).length
type LessonChoice = number | 'hsk1'

const MODES: { v: Mode; label: string }[] = [
  { v: 'vocab', label: '📇 คำศัพท์' },
  { v: 'dialogue', label: '💬 บทสนทนา' },
  { v: 'notes', label: '📝 โน้ต' },
  { v: 'drill', label: '🎯 ฝึกพิมพ์' },
]

const isMode = (v: unknown): v is Mode => MODES.some((m) => m.v === v)

export function LessonScreen() {
  const [idx, setIdx] = useState<LessonChoice>(() => {
    const saved = readRaw(KEYS.lesson)
    if (saved === 'hsk1') return 'hsk1'
    const n = parseInt(saved ?? '0', 10)
    return Number.isFinite(n) && n >= 0 && n < lessons.length ? n : 0
  })
  const [mode, setMode] = useState<Mode>(() => {
    const m = loadNav().mode
    return isMode(m) ? m : 'vocab'
  })
  const [drillSrc, setDrillSrc] = useState<'vocab' | 'phrase' | 'both'>('both')

  useEffect(() => writeRaw(KEYS.lesson, String(idx)), [idx])
  useEffect(() => saveNav({ mode }), [mode])

  const L = idx === 'hsk1' ? null : lessons[idx]
  const pool = useMemo(() => (L ? lessonDrillPool(L, drillSrc) : []), [L, drillSrc])

  return (
    <div className="stack">
      <Chips
        label="เลือกบท"
        variant="num"
        items={[
          ...lessons.map((_, i) => ({ v: String(i), label: String(i + 1) })),
          { v: 'hsk1', label: 'HSK 1', className: 'chip-hsk1' },
        ]}
        value={String(idx)}
        onChange={(v) => setIdx(v === 'hsk1' ? 'hsk1' : Number(v))}
      />

      {idx === 'hsk1' ? <Hsk1Screen /> : L && (
        <>
          <div className="card card-pad lesson-hd">
            <div className="lesson-hd-py py">{L.py}</div>
            <div className="lesson-hd-zh zh">{L.zh}</div>
            <div className="lesson-hd-th">
              บทที่ {idx + 1} · {L.thTitle}
            </div>
            <div className="lesson-hd-meta muted">
              {L.vocab.length} คำ · {L.phrases.length} วลี · {dialogueLines(L)} บรรทัดสนทนา · {L.notes.length} โน้ต
            </div>
          </div>

          <Chips label="โหมด" items={MODES.map((m) => ({ v: m.v, label: m.label }))} value={mode} onChange={setMode} />

          {mode === 'vocab' && <VocabGrid words={L.vocab} phrases={L.phrases} />}
          {mode === 'dialogue' && <Dialogue lines={L.dialogue} />}
          {mode === 'notes' && <Notes notes={L.notes} />}
          {mode === 'drill' && (
            <div className="stack">
              <Chips
                label="ชุดคำ"
                items={[
                  { v: 'both', label: `ทั้งหมด (${lessonDrillPool(L, 'both').length})` },
                  { v: 'vocab', label: `คำศัพท์ (${L.vocab.length})` },
                  { v: 'phrase', label: `วลี (${L.phrases.length})` },
                ]}
                value={drillSrc}
                onChange={(v) => setDrillSrc(v as typeof drillSrc)}
              />
              <TypeDrill pool={pool} resetKey={`${idx}-${drillSrc}`} emptyMsg="บทนี้ไม่มีคำในชุดนี้" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function VocabGrid({ words, phrases }: { words: typeof lessons[number]['vocab']; phrases: typeof lessons[number]['phrases'] }) {
  const { playingKey, speak } = useSpeak()
  const [stars, setStars] = useState<Set<string>>(new Set())

  // อ่านดาวครั้งเดียวตอนเข้า แล้ว sync ใน state (อ่าน localStorage ทุกการ์ดจะอืด)
  useEffect(() => {
    setStars(new Set(words.filter((w) => isStarred(w.zh)).map((w) => w.zh)))
  }, [words])

  return (
    <div className="stack">
      <div className="grid-cards">
        {words.map((w) => (
          <div
            key={w.zh + w.py}
            className={`card word ${playingKey === w.zh ? 'playing' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => speak(w.zh)}
            onKeyDown={(e) => e.key === 'Enter' && speak(w.zh)}
          >
            <button
              type="button"
              className={`word-star ${stars.has(w.zh) ? 'on' : ''}`}
              aria-label="ติดดาวว่ายังไม่แม่น"
              onClick={(e) => {
                e.stopPropagation()
                const on = toggleStar(w.zh)
                setStars((s) => {
                  const n = new Set(s)
                  if (on) n.add(w.zh)
                  else n.delete(w.zh)
                  return n
                })
              }}
            >
              {stars.has(w.zh) ? '★' : '☆'}
            </button>
            <div className="word-py py">{w.py}</div>
            <div className="word-zh zh">{w.zh}</div>
            {w.thr && <div className="word-thr">{w.thr}</div>}
            <div className="word-th">{w.th}</div>
          </div>
        ))}
      </div>

      {phrases.length > 0 && (
        <>
          <div className="section-title">วลีในบทนี้ ({phrases.length})</div>
          <div className="stack">
            {phrases.map((p) => (
              <div
                key={p.zh + p.py}
                className={`card phrase ${playingKey === p.zh ? 'playing' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => speak(p.zh)}
                onKeyDown={(e) => e.key === 'Enter' && speak(p.zh)}
              >
                <div>
                  <div className="py">{p.py}</div>
                  <div className="phrase-zh zh">{p.zh}</div>
                </div>
                <div className="phrase-th">{p.th}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Dialogue({ lines }: { lines: typeof lessons[number]['dialogue'] }) {
  const { playingKey, speak } = useSpeak()
  // ตัวละครแต่ละคนได้สีต่างกัน — ไล่ตามลำดับที่โผล่ในบท (ข้ามหัวข้อคั่นฉากที่ไม่มี sp)
  const speakers = [...new Set(lines.flatMap((l) => ('sec' in l ? [] : [l.sp])))]

  return (
    <div className="stack">
      {lines.map((l, i) => {
        // บทสนทนายาวบางบทแบ่งเป็นหลายฉาก (เช่น "ที่สนามบิน" / "ที่ด่านศุลกากร") — โชว์เป็นหัวข้อคั่น ไม่ใช่บรรทัดพูด
        if ('sec' in l) {
          return (
            <div key={i} className="dlg-sec">
              {l.sec}
            </div>
          )
        }
        const ci = speakers.indexOf(l.sp) % 4
        const th = speakerTh[l.sp] ?? l.sp
        const isCode = /^[A-Z]$/.test(l.sp)
        return (
          <div
            key={i}
            className={`card dlg ${playingKey === l.zh + i ? 'playing' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => speak(l.zh, l.zh + i)}
            onKeyDown={(e) => e.key === 'Enter' && speak(l.zh, l.zh + i)}
          >
            <div className={`dlg-sp c${ci}`}>
              {th}
              {!isCode && <small className="zh">{l.sp}</small>}
            </div>
            <div className="dlg-body">
              <div className="py">{l.py}</div>
              <div className="dlg-zh zh">{l.zh}</div>
              <div className="dlg-th">{l.th}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Notes({ notes }: { notes: typeof lessons[number]['notes'] }) {
  return (
    <div className="stack">
      {notes.map((n, i) => (
        <div key={i} className="card card-pad note">
          <div className="note-hd">
            <span aria-hidden>{n.ic}</span>
            <b>{n.t}</b>
          </div>
          <div className="note-b">{n.b}</div>
          {n.ex && <div className="note-ex">📝 {n.ex}</div>}
        </div>
      ))}
    </div>
  )
}
