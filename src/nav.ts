/* โครง navigation 2 ระดับ — id เดิมจาก v1 ทั้งหมด
   (hash เดิม #quiz / #listen ยังใช้ได้ และ xy-nav ที่เคยบันทึกไว้ยังอ่านออก) */
import { KEYS, readJson, writeJson } from './lib/storage'

export type TabId =
  | 'lesson1' | 'quiz' | 'sentence' | 'typing' | 'listen'
  | 'vocab' | 'allnotes' | 'pinyin' | 'bu'

export type GroupKey = 'learn' | 'drill' | 'bank' | 'base'

export type NavItem = { t: TabId; label: string; icon: string }
export type NavGroup = { key: GroupKey; label: string; icon: string; items: NavItem[] }

export const GROUPS: NavGroup[] = [
  { key: 'learn', label: 'เรียน', icon: '📖', items: [{ t: 'lesson1', label: 'บทเรียน', icon: '📖' }] },
  {
    key: 'drill', label: 'ฝึก', icon: '🎯',
    items: [
      { t: 'quiz', label: 'ควิซคำศัพท์', icon: '🎯' },
      { t: 'sentence', label: 'เรียงประโยค', icon: '🧩' },
      { t: 'typing', label: 'พิมพ์พินอิน', icon: '⌨️' },
      { t: 'listen', label: 'ฟัง → แปลไทย', icon: '👂' },
    ],
  },
  {
    key: 'bank', label: 'คลังคำ', icon: '📚',
    items: [
      { t: 'vocab', label: 'คำศัพท์ทุกบท', icon: '📚' },
      { t: 'allnotes', label: 'สรุปไวยากรณ์', icon: '📝' },
    ],
  },
  {
    key: 'base', label: 'พื้นฐาน', icon: '🔤',
    items: [
      { t: 'pinyin', label: 'พินอิน', icon: '🔤' },
      { t: 'bu', label: 'ผันเสียง', icon: '🎵' },
    ],
  },
]

const ALL_TABS = GROUPS.flatMap((g) => g.items.map((i) => i.t))

export const isTab = (v: unknown): v is TabId => typeof v === 'string' && ALL_TABS.includes(v as TabId)
export const groupOf = (t: TabId) => GROUPS.find((g) => g.items.some((i) => i.t === t))!
export const itemOf = (t: TabId) => GROUPS.flatMap((g) => g.items).find((i) => i.t === t)!

type NavState = { tab?: string; mode?: string; last?: Partial<Record<GroupKey, TabId>> }

export function loadNav(): NavState {
  return readJson<NavState>(KEYS.nav, {})
}

export function saveNav(patch: NavState) {
  writeJson(KEYS.nav, { ...loadNav(), ...patch })
}

/** แท็บเริ่มต้น: hash ก่อน (แชร์ลิงก์ได้) แล้วค่อยของที่เปิดไว้ล่าสุด */
export function initialTab(): TabId {
  const hash = location.hash.replace(/^#/, '')
  if (isTab(hash)) return hash
  const saved = loadNav().tab
  return isTab(saved) ? saved : 'lesson1'
}

/** จำแท็บล่าสุดของแต่ละกลุ่ม — กดไอคอนกลุ่มแล้วกลับไปที่แบบฝึกเดิม ไม่ใช่ตัวแรกเสมอ */
export function rememberTab(t: TabId) {
  const g = groupOf(t)
  const last = { ...(loadNav().last ?? {}), [g.key]: t }
  saveNav({ tab: t, last })
  if (location.hash.replace(/^#/, '') !== t) history.replaceState(null, '', '#' + t)
}

export function tabForGroup(key: GroupKey): TabId {
  const g = GROUPS.find((x) => x.key === key)!
  const last = loadNav().last?.[key]
  return last && g.items.some((i) => i.t === last) ? last : g.items[0].t
}
