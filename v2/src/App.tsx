import { useEffect, useState } from 'react'
import { GROUPS, initialTab, isTab, itemOf, groupOf, rememberTab, tabForGroup, type TabId } from './nav'
import { warmVoices } from './lib/tts'
import { LessonScreen } from './screens/LessonScreen'
import { QuizScreen } from './screens/QuizScreen'
import { SentenceScreen } from './screens/SentenceScreen'
import { TypingScreen } from './screens/TypingScreen'
import { ListenScreen } from './screens/ListenScreen'
import { VocabScreen } from './screens/VocabScreen'
import { NotesScreen } from './screens/NotesScreen'
import { PinyinScreen } from './screens/PinyinScreen'
import { TonesScreen } from './screens/TonesScreen'

/** หน้าที่เป็นตาราง/เนื้อหายาว ให้กว้างกว่าหน้าแบบฝึกบนจอใหญ่ */
const WIDE: TabId[] = ['vocab', 'allnotes', 'pinyin', 'bu']

export default function App() {
  const [tab, setTab] = useState<TabId>(initialTab)

  useEffect(() => {
    warmVoices()
  }, [])

  useEffect(() => {
    rememberTab(tab)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab])

  // กดปุ่ม back ของเบราว์เซอร์ให้กลับแท็บก่อนหน้า (hash เปลี่ยน)
  useEffect(() => {
    const onHash = () => {
      const h = location.hash.replace(/^#/, '')
      if (isTab(h)) setTab(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const group = groupOf(tab)

  return (
    <div className="app">
      <nav className="sidebar" aria-label="เมนูหลัก">
        <div className="sidebar-brand">
          <img src="./icon.svg" alt="" />
          <div>
            鑫越
            <small>เรียนภาษาจีน</small>
          </div>
        </div>
        {GROUPS.map((g) => (
          <div key={g.key}>
            <div className="sidebar-group">
              {g.icon} {g.label}
            </div>
            {g.items.map((it) => (
              <button
                key={it.t}
                type="button"
                aria-current={tab === it.t ? 'page' : undefined}
                onClick={() => setTab(it.t)}
              >
                <span aria-hidden>{it.icon}</span>
                {it.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div>
        <header className="header">
          <img className="header-logo" src="./icon.svg" alt="" />
          <div className="header-title">
            {itemOf(tab).icon} {itemOf(tab).label}
          </div>
          <div className="header-sub">鑫越</div>
        </header>

        <main className={`content ${WIDE.includes(tab) ? 'wide' : ''}`}>
          {group.items.length > 1 && (
            <div className="chips group-chips" role="tablist" aria-label={'เมนู' + group.label}>
              {group.items.map((it) => (
                <button
                  key={it.t}
                  role="tab"
                  type="button"
                  className="chip"
                  aria-selected={tab === it.t}
                  onClick={() => setTab(it.t)}
                >
                  {it.icon} {it.label}
                </button>
              ))}
            </div>
          )}

          {tab === 'lesson1' && <LessonScreen />}
          {tab === 'quiz' && <QuizScreen />}
          {tab === 'sentence' && <SentenceScreen />}
          {tab === 'typing' && <TypingScreen />}
          {tab === 'listen' && <ListenScreen />}
          {tab === 'vocab' && <VocabScreen />}
          {tab === 'allnotes' && <NotesScreen />}
          {tab === 'pinyin' && <PinyinScreen />}
          {tab === 'bu' && <TonesScreen />}
        </main>
      </div>

      <nav className="tabbar" aria-label="เมนูหลัก">
        {GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            aria-current={group.key === g.key ? 'page' : undefined}
            onClick={() => setTab(tabForGroup(g.key))}
          >
            <i aria-hidden>{g.icon}</i>
            {g.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
