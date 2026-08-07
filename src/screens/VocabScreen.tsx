import { useEffect, useMemo, useState } from 'react'
import { lessons } from '../data/lessons'
import { hsk1Extra } from '../data/hsk1'
import { WORD_CATS, catOf } from '../data/wordCats'
import type { Word } from '../data/types'
import { starsGet, toggleStar } from '../lib/srs'
import { useSpeak } from '../components/SpeakButton'
import { Chips } from '../components/ui'
import { thNorm } from '../lib/thai'
import { pyNorm } from '../lib/pinyin'

type Row = Word & { lesson: number }
type GroupBy = 'lesson' | 'cat'

/** คลังคำศัพท์ทุกบท — ค้นหาได้ทั้งไทยและพินอิน (ไม่ต้องพิมพ์วรรณยุกต์)
    ดูได้ 2 แบบ: ตามบท (ตามหนังสือ) หรือตามหมวดการใช้งาน (วันเวลา/ที่ทำงาน/โรงเรียน…) */
export function VocabScreen() {
  const [q, setQ] = useState('')
  const [onlyStar, setOnlyStar] = useState(false)
  const [groupBy, setGroupBy] = useState<GroupBy>('lesson')
  const [lesson, setLesson] = useState<'all' | number>('all')
  const [cat, setCat] = useState<'all' | string>('all')
  const [stars, setStars] = useState<Set<string>>(() => starsGet())
  const { playingKey, speak } = useSpeak()

  useEffect(() => setStars(starsGet()), [])

  // lesson 0 = คำ HSK 1 ที่หนังสือไม่มี (โชว์เป็นกลุ่มท้ายสุด)
  const all: Row[] = useMemo(
    () => [
      ...lessons.flatMap((L, i) => L.vocab.map((w) => ({ ...w, lesson: i + 1 }))),
      ...hsk1Extra.map((w) => ({ ...w, lesson: 0 })),
    ],
    [],
  )

  const rows = useMemo(() => {
    const needleTh = thNorm(q)
    const needlePy = pyNorm(q)
    return all.filter((w) => {
      if (groupBy === 'lesson' && lesson !== 'all' && w.lesson !== lesson) return false
      if (groupBy === 'cat' && cat !== 'all' && catOf(w.zh)?.k !== cat) return false
      if (onlyStar && !stars.has(w.zh)) return false
      if (!q.trim()) return true
      return (
        (!!needleTh && (thNorm(w.th).includes(needleTh) || thNorm(w.thr ?? '').includes(needleTh))) ||
        (!!needlePy && pyNorm(w.py).includes(needlePy)) ||
        w.zh.includes(q.trim())
      )
    })
  }, [all, q, onlyStar, groupBy, lesson, cat, stars])

  /** จัดกลุ่มเพื่อโชว์หัวข้อคั่น — ท่องเป็นชุดๆ จำง่ายกว่ากองเดียวยาว 285 คำ */
  const groups = useMemo(() => {
    if (groupBy === 'cat') {
      return WORD_CATS.map((c) => ({
        key: c.k,
        title: `${c.icon} ${c.label}`,
        items: rows.filter((w) => catOf(w.zh)?.k === c.k),
      })).filter((g) => g.items.length > 0)
    }
    return [
      ...lessons.map((L, i) => ({
        key: 'L' + i,
        title: `บทที่ ${i + 1} · ${L.thTitle}`,
        items: rows.filter((w) => w.lesson === i + 1),
      })),
      { key: 'hsk1', title: '🅰 HSK 1 · คำที่หนังสือไม่มี', items: rows.filter((w) => w.lesson === 0) },
    ].filter((g) => g.items.length > 0)
  }, [rows, groupBy])

  const toggle = (zh: string) => {
    toggleStar(zh)
    setStars(starsGet())
  }

  return (
    <div className="stack">
      <input
        className="input"
        type="search"
        placeholder="ค้นหา… (ไทย / พินอิน / ฮั่นจื่อ)"
        value={q}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-label="ค้นหาคำศัพท์"
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="voc-bar">
        <Chips
          label="จัดกลุ่ม"
          items={[
            { v: 'lesson', label: '📖 ตามบท' },
            { v: 'cat', label: '🗂 ตามหมวด' },
          ]}
          value={groupBy}
          onChange={setGroupBy}
        />
        <button
          type="button"
          className="chip"
          aria-selected={onlyStar}
          onClick={() => setOnlyStar((v) => !v)}
        >
          ⭐ ยังไม่แม่น ({stars.size})
        </button>
      </div>

      {groupBy === 'lesson' ? (
        <Chips
          label="เลือกบท"
          variant="num"
          items={[
            { v: 'all', label: 'ทุกบท' },
            ...lessons.map((_, i) => ({ v: String(i + 1), label: String(i + 1) })),
            { v: '0', label: 'HSK 1' },
          ]}
          value={lesson === 'all' ? 'all' : String(lesson)}
          onChange={(v) => setLesson(v === 'all' ? 'all' : Number(v))}
        />
      ) : (
        <Chips
          label="เลือกหมวด"
          items={[
            { v: 'all', label: 'ทุกหมวด' },
            ...WORD_CATS.map((c) => ({ v: c.k, label: `${c.icon} ${c.label}` })),
          ]}
          value={cat}
          onChange={setCat}
        />
      )}

      <div className="muted">{rows.length} คำ</div>

      {groups.map((g) => (
        <section key={g.key} className="stack">
          <div className="voc-group-hd">
            {g.title} <span className="muted">({g.items.length})</span>
          </div>
          <div className="grid-cards">
            {g.items.map((w) => (
              <div
                key={w.lesson + w.zh + w.py}
                className={`card word ${playingKey === w.zh + w.lesson ? 'playing' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => speak(w.zh, w.zh + w.lesson)}
                onKeyDown={(e) => e.key === 'Enter' && speak(w.zh, w.zh + w.lesson)}
              >
                <button
                  type="button"
                  className={`word-star ${stars.has(w.zh) ? 'on' : ''}`}
                  aria-label="ติดดาวว่ายังไม่แม่น"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(w.zh)
                  }}
                >
                  {stars.has(w.zh) ? '★' : '☆'}
                </button>
                {/* ดูตามหมวดแล้วยังต้องรู้ว่าอยู่บทไหน / ดูตามบทแล้วอยากรู้ว่าหมวดอะไร */}
                <div className="word-lesson">
                  {groupBy === 'cat' ? (w.lesson === 0 ? 'HSK 1' : `บท ${w.lesson}`) : catOf(w.zh)?.icon}
                </div>
                <div className="word-py py">{w.py}</div>
                <div className="word-zh zh">{w.zh}</div>
                {w.thr && <div className="word-thr">{w.thr}</div>}
                <div className="word-th">{w.th}</div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {rows.length === 0 && <div className="card card-pad muted">ไม่เจอคำที่ค้นหา</div>}
    </div>
  )
}
