import { Fragment, useState } from 'react'
import { consonantGroups, examples, specialRules, vowels } from '../data/pinyin'
import { useSpeak } from '../components/SpeakButton'
import { Chips } from '../components/ui'

type View = 'vowel' | 'consonant' | 'rule' | 'example'

const VOWEL_SECTIONS: { k: keyof typeof vowels; label: string }[] = [
  { k: 'single', label: 'สระเดี่ยว' },
  { k: 'compound', label: 'สระประสม' },
  { k: 'nasal', label: 'สระนาสิก (ลงจมูก)' },
]

/** เน้น <b>…</b> ในข้อความอธิบาย — ข้อความคงที่ของเราเอง แต่ไม่ใช้ innerHTML ให้ติดนิสัย */
function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/<b>|<\/b>/).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>))}
    </>
  )
}

export function PinyinScreen() {
  const [view, setView] = useState<View>('vowel')
  const { playingKey, speak } = useSpeak()

  const soundCard = (p: string, th: string, zh: string, key: string) => (
    <button
      key={key}
      type="button"
      className={`card sound ${playingKey === key ? 'playing' : ''}`}
      onClick={() => speak(zh, key)}
    >
      <div className="sound-p py">{p}</div>
      <div className="sound-th">{th}</div>
      <div className="sound-zh zh">{zh}</div>
    </button>
  )

  return (
    <div className="stack">
      <Chips
        label="หมวด"
        items={[
          { v: 'vowel', label: 'สระ' },
          { v: 'consonant', label: 'พยัญชนะ' },
          { v: 'rule', label: 'กฎพิเศษ' },
          { v: 'example', label: 'ตัวอย่างคำ' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'vowel' &&
        VOWEL_SECTIONS.map((s) => (
          <section key={s.k} className="stack">
            <div className="section-title">{s.label}</div>
            <div className="grid-sounds">{vowels[s.k].map((v) => soundCard(v.p, v.th, v.zh, s.k + v.p))}</div>
          </section>
        ))}

      {view === 'consonant' &&
        consonantGroups.map((g) => (
          <section key={g.name} className="stack">
            <div className="section-title">
              {g.name}{' '}
              {g.badges.map((b) => (
                <span key={b.text} className={`badge ${b.cls === 'badge-ok' ? 'ok' : 'err'}`}>
                  {b.text}
                </span>
              ))}
            </div>
            <div className="grid-sounds">{g.items.map((v) => soundCard(v.p, v.th, v.zh, g.name + v.p))}</div>
            <div className="card card-pad muted">
              <Bold text={g.note} />
            </div>
          </section>
        ))}

      {view === 'rule' &&
        specialRules.map((r) => (
          <section key={r.title} className="stack">
            <div className="rule-hd">
              <b>{r.title}</b>
              <div>{r.desc}</div>
            </div>
            <div className="grid-sounds">
              {r.items.map((it) => (
                <button
                  key={r.title + it.zh + it.after}
                  type="button"
                  className={`card sound ${playingKey === r.title + it.zh ? 'playing' : ''}`}
                  onClick={() => speak(it.play, r.title + it.zh)}
                >
                  {it.before && <div className="sound-before">{it.before}</div>}
                  <div className="sound-p py">{it.after}</div>
                  <div className="sound-zh zh">{it.zh}</div>
                  <div className="sound-th">{it.mean}</div>
                  <div className="sound-label">{it.label}</div>
                </button>
              ))}
            </div>
          </section>
        ))}

      {view === 'example' &&
        examples.map((g) => (
          <section key={g.con} className="stack">
            <div className="section-title">
              <b className="py">{g.con}</b> · {g.th}
            </div>
            <div className="grid-sounds">
              {g.items.map((it) => soundCard(it.py, it.mean, it.zh, g.con + it.py))}
            </div>
          </section>
        ))}
    </div>
  )
}
