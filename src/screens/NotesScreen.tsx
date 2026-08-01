import { useState } from 'react'
import { summary } from '../data/summary'
import { lessons } from '../data/lessons'
import { Chips } from '../components/ui'

type View = 'summary' | 'lesson'

export function NotesScreen() {
  const [view, setView] = useState<View>('summary')

  return (
    <div className="stack">
      <Chips
        label="มุมมอง"
        items={[
          { v: 'summary', label: '📚 สรุปรวมทุกบท' },
          { v: 'lesson', label: '📖 โน้ตรายบท' },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'summary'
        ? summary.map((sec) => (
            <section key={sec.title} className="stack">
              <div className="sum-hd">
                <span aria-hidden>{sec.ic}</span> {sec.title}
              </div>
              {sec.intro && <div className="muted">{sec.intro}</div>}
              {sec.items.map((it, i) => (
                <div key={i} className="card card-pad note">
                  <div className="note-hd">
                    <b>{it.t}</b>
                  </div>
                  <div className="note-b">{it.b}</div>
                  {it.ex && <div className="note-ex">📝 {it.ex}</div>}
                </div>
              ))}
            </section>
          ))
        : lessons.map((L, i) => (
            <section key={L.title} className="stack">
              <div className="sum-hd">
                บทที่ {i + 1} · {L.thTitle}
              </div>
              {L.notes.map((n, j) => (
                <div key={j} className="card card-pad note">
                  <div className="note-hd">
                    <span aria-hidden>{n.ic}</span> <b>{n.t}</b>
                  </div>
                  <div className="note-b">{n.b}</div>
                </div>
              ))}
            </section>
          ))}
    </div>
  )
}
