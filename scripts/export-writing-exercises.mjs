/* สร้าง endpoint แบบ static ให้แอป radical.icejuk.dev ดึงคำศัพท์ไปฝึกเขียน
   ข้อมูลต้นทางยังอยู่ที่ src/data/lessons.ts แห่งเดียว ไฟล์ JSON นี้เป็น build artifact ที่ commit ไว้
   เพื่อให้ URL ใช้งานได้ทันทีและตรวจ diff ของข้อมูลที่เผยแพร่ได้ */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'src/data/lessons.ts'), 'utf8')
const javascript = ts
  .transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  .outputText.replace(/^import .*$/gm, '')

const moduleUrl = `data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`
const { lessons } = await import(moduleUrl)

const clean = (item, kind) => ({
  zh: item.zh,
  py: item.py,
  th: item.th,
  kind,
})

const payload = {
  version: 1,
  source: 'chinese-study',
  lessons: lessons.map((lesson, index) => ({
    id: index + 1,
    title: lesson.title,
    zh: lesson.zh,
    py: lesson.py,
    th: lesson.thTitle,
    vocab: lesson.vocab.map((item) => clean(item, 'vocab')),
    phrases: lesson.phrases.map((item) => clean(item, 'phrase')),
  })),
}

const output = join(root, 'public/api/writing-exercises.json')
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`)

const rows = payload.lessons.reduce((total, lesson) => total + lesson.vocab.length + lesson.phrases.length, 0)
console.log(`✓ export แบบฝึกเขียน ${payload.lessons.length} บท · ${rows} รายการ → public/api/writing-exercises.json`)
