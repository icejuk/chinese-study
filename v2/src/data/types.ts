/* รูปข้อมูลทั้งหมดของแอป — ยกมาจาก index.html เดิมตรงๆ ไม่ได้แปลงโครงสร้าง
   หมายเหตุ: `base`/`tone` บนคำศัพท์เป็นซากจากควิซวรรณยุกต์ที่ลบไปแล้ว
   ห้ามเอามาใช้เป็นแหล่งความจริง (คงไว้เพราะยังไม่อยากแก้ข้อมูล 285 รายการ) */

export type Word = {
  zh: string
  py: string
  base?: string
  tone?: number
  thr?: string   // คำอ่านไทย
  th: string
  en: string
}

export type Phrase = { zh: string; py: string; th: string; en: string }

export type DialogueLine = { sp: string; zh: string; py: string; th: string }

export type Note = { ic: string; t: string; b: string }

export type Lesson = {
  title: string
  zh: string
  py: string
  thTitle: string
  vocab: Word[]
  dialogue: DialogueLine[]
  notes: Note[]
  phrases: Phrase[]
}

export type SbToken = { zh: string; py: string }

/** ประโยคของแบบฝึกเรียงคำ — token แยกคำ (เครื่องหมายวรรคตอนติดท้าย token) */
export type Sentence = { th: string; cat: string; note?: string; tokens: SbToken[] }

export type SbCat = { k: string; label: string }

/* ----- หน้าพินอิน ----- */
export type VowelItem = { p: string; th: string; zh: string }
export type VowelData = Record<'single' | 'compound' | 'nasal', VowelItem[]>

export type Badge = { text: string; cls: string }
export type ConsonantGroup = {
  name: string
  color: string
  noteClass: string
  badges: Badge[]
  note: string      // มี <b> ปนอยู่ — เป็นข้อความคงที่ของเราเอง
  items: VowelItem[]
}

export type SpecialItem = {
  before: string; after: string; zh: string; mean: string; label: string; play: string
}
export type SpecialRule = {
  title: string; desc: string; bg: string; col: string; items: SpecialItem[]
}

export type ExampleGroup = {
  con: string; color: string; th: string
  items: { py: string; zh: string; mean: string }[]
}

/* ----- หน้าผันเสียง ----- */
export type ToneItem = { zh: string; py: string; th: string }
export type ToneGroup = {
  tone: number | string
  label: string
  note: string
  special: boolean
  items: ToneItem[]
}
/** กลุ่มเสียง 3 + เสียง 3 มีทั้งคำที่ "เขียน" และ "อ่าน" */
export type T3Item = { zh: string; write: string; spoken: string; th: string }
export type T3Group = Omit<ToneGroup, 'items'> & { items: T3Item[] }

/* ----- สรุปไวยากรณ์รวม ----- */
export type SummaryItem = { t: string; b: string; ex?: string }
export type SummarySection = { ic: string; title: string; intro: string; items: SummaryItem[] }
