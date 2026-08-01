/* ตรวจคำตอบพินอิน — เทียบแค่ตัวอักษร ไม่คิดวรรณยุกต์
   zuijin / zui4jin4 / zuìjìn / ZUIJIN ผ่านเหมือนกันหมด */

/**
 * ⚠️ กับดักที่เคยทำพังมาแล้ว: ห้าม strip `[\u0300-\u036f]` รวบเดียวเพื่อตัดวรรณยุกต์
 * เพราะจะกิน U+0308 (¨) ไปด้วย → nǚ กลายเป็น nu, lǜshī กลายเป็น lushi
 * ในข้อมูลไม่มี ü เดี่ยว มีแต่ ǚ/ǜ แบบอักขระประกอบ จึงต้องจับ ̈ แยกเองแล้วแปลงเป็น v
 */
export function pyNorm(s: unknown): string {
  const src = String(s ?? '').normalize('NFD').toLowerCase().replace(/u:/g, 'v')
  let out = ''
  for (const ch of src) {
    if (ch === '\u0308') {
      if (out) out = out.slice(0, -1) + 'v'
      continue
    }
    const c = ch === '\u00fc' ? 'v' : ch
    if (c >= 'a' && c <= 'z') out += c
  }
  return out
}

/** วงเล็บในเฉลย = ใส่หรือไม่ใส่ก็ได้ เช่น yǒu(yì)diǎnr */
export function pyVariants(py: string): string[] {
  if (!/[()]/.test(py)) return [py]
  return [py.replace(/[()]/g, ''), py.replace(/\([^)]*\)/g, '')]
}

export type PyResult = { ok: true } | { ok: false; why: 'empty' | 'umlaut' | 'letters' }

export function pyCheck(input: string, answerPy: string): PyResult {
  const u = pyNorm(input)
  if (!u) return { ok: false, why: 'empty' }
  let near: PyResult | null = null
  for (const v of pyVariants(answerPy)) {
    const a = pyNorm(v)
    if (u === a) return { ok: true }
    // ต่างกันแค่ ü ↔ u — บอกให้พิมพ์ v/u: แทนที่จะบอกว่าผิดเฉยๆ
    if (!near && u.replace(/v/g, 'u') === a.replace(/v/g, 'u')) near = { ok: false, why: 'umlaut' }
  }
  return near ?? { ok: false, why: 'letters' }
}
