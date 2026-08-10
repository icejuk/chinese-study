import { useMemo, useState } from 'react'
import { hsk1Words } from '../data/hsk1'
import { thNorm } from '../lib/thai'
import { pyNorm } from '../lib/pinyin'
import { starsGet, toggleStar } from '../lib/srs'
import { useSpeak } from '../components/SpeakButton'

/** ชุด HSK 1 จากชีตผู้เรียน — แยกจากคำศัพท์ที่กระจายอยู่ในบทเรียน 1–15 */
export function Hsk1Screen() {
  const [q, setQ] = useState('')
  const [onlyStar, setOnlyStar] = useState(false)
  const [stars, setStars] = useState<Set<string>>(() => starsGet())
  const { playingKey, speak } = useSpeak()

  const words = useMemo(() => {
    const needleTh = thNorm(q)
    const needlePy = pyNorm(q)
    return hsk1Words.filter((word) => {
      if (onlyStar && !stars.has(word.zh)) return false
      if (!q.trim()) return true
      return (
        (!!needleTh && thNorm(word.th).includes(needleTh)) ||
        (!!needlePy && pyNorm(word.py).includes(needlePy)) ||
        word.zh.includes(q.trim())
      )
    })
  }, [q, onlyStar, stars])

  const toggle = (zh: string) => {
    toggleStar(zh)
    setStars(starsGet())
  }

  return (
    <div className="stack">
      <div className="card card-pad lesson-hd">
        <div className="lesson-hd-py py">HSK 1 Vocabulary</div>
        <div className="lesson-hd-zh zh">汉语水平考试 一级</div>
        <div className="lesson-hd-th">คำศัพท์ HSK 1</div>
        <div className="lesson-hd-meta muted">{hsk1Words.length} คำ · กดการ์ดเพื่อฟังเสียง</div>
      </div>

      <input
        className="input"
        type="search"
        placeholder="ค้นหา… (ไทย / พินอิน / ฮั่นจื่อ)"
        value={q}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-label="ค้นหาคำศัพท์ HSK 1"
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="voc-bar">
        <div className="muted">{words.length} / {hsk1Words.length} คำ</div>
        <button
          type="button"
          className="chip"
          aria-selected={onlyStar}
          onClick={() => setOnlyStar((value) => !value)}
        >
          ⭐ ยังไม่แม่น ({stars.size})
        </button>
      </div>

      <div className="grid-cards">
        {words.map((word) => (
          <div
            key={word.zh}
            className={`card word ${playingKey === word.zh ? 'playing' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => speak(word.zh)}
            onKeyDown={(event) => event.key === 'Enter' && speak(word.zh)}
          >
            <button
              type="button"
              className={`word-star ${stars.has(word.zh) ? 'on' : ''}`}
              aria-label="ติดดาวว่ายังไม่แม่น"
              onClick={(event) => {
                event.stopPropagation()
                toggle(word.zh)
              }}
            >
              {stars.has(word.zh) ? '★' : '☆'}
            </button>
            <div className="word-py py">{word.py}</div>
            <div className="word-zh zh">{word.zh}</div>
            {word.thr && <div className="word-thr">{word.thr}</div>}
            <div className="word-th">{word.th}</div>
          </div>
        ))}
      </div>

      {words.length === 0 && <div className="card card-pad muted">ไม่เจอคำที่ค้นหา</div>}
    </div>
  )
}
