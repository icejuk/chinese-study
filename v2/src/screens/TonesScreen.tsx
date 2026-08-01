import { useState } from 'react'
import { buGroups, specialToneGroups, t3Groups, yiGroups } from '../data/tones'
import type { ToneGroup } from '../data/types'
import { useSpeak } from '../components/SpeakButton'
import { Chips } from '../components/ui'

type View = 'bu' | 'yi' | 'sp' | 't3'

export function TonesScreen() {
  const [view, setView] = useState<View>('bu')
  const { playingKey, speak } = useSpeak()

  const plain = (groups: ToneGroup[], prefix: string) =>
    groups.map((g) => (
      <section key={prefix + g.label} className="stack">
        <div className={`tone-hd ${g.special ? 'special' : ''}`}>
          <b>{g.label}</b>
          <span>{g.note}</span>
        </div>
        <div className="grid-sounds">
          {g.items.map((it) => (
            <button
              key={prefix + it.zh}
              type="button"
              className={`card sound ${playingKey === prefix + it.zh ? 'playing' : ''}`}
              onClick={() => speak(it.zh, prefix + it.zh)}
            >
              <div className="sound-p py">{it.py}</div>
              <div className="sound-zh zh">{it.zh}</div>
              <div className="sound-th">{it.th}</div>
            </button>
          ))}
        </div>
      </section>
    ))

  return (
    <div className="stack">
      <Chips
        label="กฎ"
        items={[
          { v: 'bu', label: '不 (bù)' },
          { v: 'yi', label: '一 (yī)' },
          { v: 'sp', label: 'A-不-A' },
          { v: 't3', label: 'เสียง 3 + 3' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'bu' && plain(buGroups, 'bu')}
      {view === 'yi' && plain(yiGroups, 'yi')}
      {view === 'sp' && plain(specialToneGroups, 'sp')}

      {view === 't3' &&
        t3Groups.map((g) => (
          <section key={g.label} className="stack">
            <div className={`tone-hd ${g.special ? 'special' : ''}`}>
              <b>{g.label}</b>
              <span>{g.note}</span>
            </div>
            <div className="grid-sounds">
              {g.items.map((it) => (
                <button
                  key={'t3' + it.zh}
                  type="button"
                  className={`card sound ${playingKey === 't3' + it.zh ? 'playing' : ''}`}
                  onClick={() => speak(it.zh, 't3' + it.zh)}
                >
                  {/* เขียนแบบหนึ่ง แต่ปากอ่านอีกแบบ — ต้องเห็นทั้งคู่ */}
                  <div className="sound-before">เขียน {it.write}</div>
                  <div className="sound-p py">{it.spoken}</div>
                  <div className="sound-zh zh">{it.zh}</div>
                  <div className="sound-th">{it.th}</div>
                </button>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
