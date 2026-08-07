/* คุมชุดคำ HSK 1 ที่เพิ่มเข้ามา — กันเพิ่มคำซ้ำกับในบท และกันข้อมูลไม่ครบ */
import { describe, expect, it } from 'vitest'
import { hsk1Extra } from './hsk1'
import { lessons } from './lessons'
import { pyCheck } from '../lib/pinyin'

const inLessons = new Set(lessons.flatMap((L) => L.vocab.map((w) => w.zh)))

describe('คำศัพท์ HSK 1 ที่เพิ่มเข้ามา', () => {
  it('ต้องไม่ซ้ำกับคำในหนังสือ 15 บท', () => {
    expect(hsk1Extra.filter((w) => inLessons.has(w.zh)).map((w) => w.zh)).toEqual([])
  })

  it('ต้องไม่ซ้ำกันเอง', () => {
    const seen = new Set<string>()
    const dup = hsk1Extra.filter((w) => (seen.has(w.zh) ? true : (seen.add(w.zh), false)))
    expect(dup.map((w) => w.zh)).toEqual([])
  })

  it('ทุกคำต้องมี zh / py / th / en ครบ', () => {
    const bad = hsk1Extra.filter((w) => !w.zh || !w.py || !w.th || !w.en)
    expect(bad.map((w) => w.zh)).toEqual([])
  })

  it('พินอินต้องตรวจผ่านตัวเอง (กันพิมพ์ตกวรรณยุกต์/อักขระแปลก)', () => {
    const bad = hsk1Extra.filter((w) => !pyCheck(w.py, w.py).ok)
    expect(bad.map((w) => `${w.zh} ${w.py}`)).toEqual([])
  })
})
