import type { ToneGroup, T3Group } from './types'

export const buGroups: ToneGroup[] = [
 {
  "tone": 1,
  "label": "不 + เสียง 1 (¯)",
  "note": "bù ปกติ (เสียง 4)",
  "special": false,
  "items": [
   {
    "zh": "不喝",
    "py": "bù hē",
    "th": "ไม่ดื่ม"
   },
   {
    "zh": "不吃",
    "py": "bù chī",
    "th": "ไม่กิน"
   },
   {
    "zh": "不说",
    "py": "bù shuō",
    "th": "ไม่พูด"
   },
   {
    "zh": "不开",
    "py": "bù kāi",
    "th": "ไม่เปิด"
   }
  ]
 },
 {
  "tone": 2,
  "label": "不 + เสียง 2 (´)",
  "note": "bù ปกติ (เสียง 4)",
  "special": false,
  "items": [
   {
    "zh": "不来",
    "py": "bù lái",
    "th": "ไม่มา"
   },
   {
    "zh": "不行",
    "py": "bù xíng",
    "th": "ไม่ได้"
   },
   {
    "zh": "不忙",
    "py": "bù máng",
    "th": "ไม่ยุ่ง"
   },
   {
    "zh": "不难",
    "py": "bù nán",
    "th": "ไม่ยาก"
   }
  ]
 },
 {
  "tone": 3,
  "label": "不 + เสียง 3 (ˇ)",
  "note": "bù ปกติ (เสียง 4)",
  "special": false,
  "items": [
   {
    "zh": "不好",
    "py": "bù hǎo",
    "th": "ไม่ดี"
   },
   {
    "zh": "不买",
    "py": "bù mǎi",
    "th": "ไม่ซื้อ"
   },
   {
    "zh": "不想",
    "py": "bù xiǎng",
    "th": "ไม่อยากจะ"
   },
   {
    "zh": "不少",
    "py": "bù shǎo",
    "th": "ไม่น้อย"
   }
  ]
 },
 {
  "tone": 4,
  "label": "不 + เสียง 4 (`) — เปลี่ยนเป็น bú!",
  "note": "⚠️ bù → bú (เสียง 2)",
  "special": true,
  "items": [
   {
    "zh": "不是",
    "py": "bú shì",
    "th": "ไม่ใช่"
   },
   {
    "zh": "不去",
    "py": "bú qù",
    "th": "ไม่ไป"
   },
   {
    "zh": "不要",
    "py": "bú yào",
    "th": "ไม่เอา"
   },
   {
    "zh": "不会",
    "py": "bú huì",
    "th": "ไม่เป็น/ไม่สามารถ"
   },
   {
    "zh": "不对",
    "py": "bú duì",
    "th": "ไม่ถูก"
   },
   {
    "zh": "不看",
    "py": "bú kàn",
    "th": "ไม่ดู"
   },
   {
    "zh": "不大",
    "py": "bú dà",
    "th": "ไม่ใหญ่"
   },
   {
    "zh": "不在",
    "py": "bú zài",
    "th": "ไม่อยู่"
   }
  ]
 }
]

export const yiGroups: ToneGroup[] = [
 {
  "tone": 0,
  "label": "一 เดี่ยว / ท้ายคำ",
  "note": "yī (เสียง 1 — เดิม)",
  "special": false,
  "items": [
   {
    "zh": "一",
    "py": "yī",
    "th": "หนึ่ง (อ่านเลข)"
   },
   {
    "zh": "第一",
    "py": "dì yī",
    "th": "ที่หนึ่ง / ที่ 1"
   },
   {
    "zh": "星期一",
    "py": "xīngqī yī",
    "th": "วันจันทร์"
   },
   {
    "zh": "十一",
    "py": "shí yī",
    "th": "สิบเอ็ด"
   }
  ]
 },
 {
  "tone": 1,
  "label": "一 + เสียง 1 (¯)",
  "note": "⚠️ yī → yì (เสียง 4)",
  "special": true,
  "items": [
   {
    "zh": "一天",
    "py": "yì tiān",
    "th": "หนึ่งวัน"
   },
   {
    "zh": "一些",
    "py": "yì xiē",
    "th": "บ้าง / นิดหน่อย"
   },
   {
    "zh": "一边",
    "py": "yì biān",
    "th": "ด้าน / ข้าง"
   },
   {
    "zh": "一杯",
    "py": "yì bēi",
    "th": "หนึ่งแก้ว"
   }
  ]
 },
 {
  "tone": 2,
  "label": "一 + เสียง 2 (´)",
  "note": "⚠️ yī → yì (เสียง 4)",
  "special": true,
  "items": [
   {
    "zh": "一年",
    "py": "yì nián",
    "th": "หนึ่งปี"
   },
   {
    "zh": "一回",
    "py": "yì huí",
    "th": "หนึ่งครั้ง"
   },
   {
    "zh": "一人",
    "py": "yì rén",
    "th": "หนึ่งคน"
   },
   {
    "zh": "一直",
    "py": "yì zhí",
    "th": "ตลอด / ตรง"
   }
  ]
 },
 {
  "tone": 3,
  "label": "一 + เสียง 3 (ˇ)",
  "note": "⚠️ yī → yì (เสียง 4)",
  "special": true,
  "items": [
   {
    "zh": "一起",
    "py": "yì qǐ",
    "th": "ด้วยกัน"
   },
   {
    "zh": "一点",
    "py": "yì diǎn",
    "th": "นิดหนึ่ง"
   },
   {
    "zh": "一百",
    "py": "yì bǎi",
    "th": "หนึ่งร้อย"
   },
   {
    "zh": "一手",
    "py": "yì shǒu",
    "th": "มือเดียว"
   }
  ]
 },
 {
  "tone": 4,
  "label": "一 + เสียง 4 (`)",
  "note": "🔴 yī → yí (เสียง 2!)",
  "special": true,
  "danger": true,
  "items": [
   {
    "zh": "一个",
    "py": "yí ge",
    "th": "หนึ่งอัน/ชิ้น"
   },
   {
    "zh": "一定",
    "py": "yí dìng",
    "th": "แน่นอน"
   },
   {
    "zh": "一样",
    "py": "yí yàng",
    "th": "เหมือนกัน"
   },
   {
    "zh": "一半",
    "py": "yí bàn",
    "th": "ครึ่งหนึ่ง"
   },
   {
    "zh": "一岁",
    "py": "yí suì",
    "th": "หนึ่งขวบ"
   },
   {
    "zh": "一次",
    "py": "yí cì",
    "th": "หนึ่งครั้ง"
   }
  ]
 }
]

/** A-不-A และรูปพิเศษอื่น */
export const specialToneGroups: ToneGroup[] = [
 {
  "tone": "A",
  "label": "A-不-A คำถาม",
  "note": "不 → bu (เบา)",
  "special": true,
  "items": [
   {
    "zh": "是不是",
    "py": "shì bu shì",
    "th": "ใช่หรือไม่"
   },
   {
    "zh": "好不好",
    "py": "hǎo bu hǎo",
    "th": "ดีไหม"
   },
   {
    "zh": "去不去",
    "py": "qù bu qù",
    "th": "ไปไหม"
   },
   {
    "zh": "来不来",
    "py": "lái bu lái",
    "th": "มาไหม"
   },
   {
    "zh": "吃不吃",
    "py": "chī bu chī",
    "th": "กินไหม"
   },
   {
    "zh": "要不要",
    "py": "yào bu yào",
    "th": "เอาไหม"
   }
  ]
 },
 {
  "tone": "B",
  "label": "ทำได้ / ทำไม่ได้ (potential)",
  "note": "不 → bu (เบา)",
  "special": true,
  "items": [
   {
    "zh": "看不见",
    "py": "kàn bu jiàn",
    "th": "มองไม่เห็น"
   },
   {
    "zh": "听不懂",
    "py": "tīng bu dǒng",
    "th": "ฟังไม่เข้าใจ"
   },
   {
    "zh": "买不起",
    "py": "mǎi bu qǐ",
    "th": "ซื้อไม่ไหว"
   },
   {
    "zh": "吃不下",
    "py": "chī bu xià",
    "th": "กินไม่ลง"
   },
   {
    "zh": "说不出",
    "py": "shuō bu chū",
    "th": "พูดไม่ออก"
   },
   {
    "zh": "走不动",
    "py": "zǒu bu dòng",
    "th": "เดินไม่ไหว"
   }
  ]
 }
]

export const t3Groups: T3Group[] = [
 {
  "tone": "★",
  "label": "คำที่ใช้บ่อย (HSK1)",
  "note": "◌̌◌̌ → ◌́◌̌",
  "special": true,
  "items": [
   {
    "zh": "你好",
    "write": "nǐ hǎo",
    "spoken": "ní hǎo",
    "th": "สวัสดี"
   },
   {
    "zh": "很好",
    "write": "hěn hǎo",
    "spoken": "hén hǎo",
    "th": "ดีมาก"
   },
   {
    "zh": "可以",
    "write": "kě yǐ",
    "spoken": "ké yǐ",
    "th": "ได้ / สามารถ"
   },
   {
    "zh": "你早",
    "write": "nǐ zǎo",
    "spoken": "ní zǎo",
    "th": "อรุณสวัสดิ์"
   },
   {
    "zh": "我也",
    "write": "wǒ yě",
    "spoken": "wó yě",
    "th": "ฉันก็"
   },
   {
    "zh": "你有",
    "write": "nǐ yǒu",
    "spoken": "ní yǒu",
    "th": "คุณมี"
   }
  ]
 },
 {
  "tone": "A",
  "label": "คำคู่ทั่วไป",
  "note": "◌̌◌̌ → ◌́◌̌",
  "special": false,
  "items": [
   {
    "zh": "水果",
    "write": "shuǐ guǒ",
    "spoken": "shuí guǒ",
    "th": "ผลไม้"
   },
   {
    "zh": "老板",
    "write": "lǎo bǎn",
    "spoken": "láo bǎn",
    "th": "เจ้านาย"
   },
   {
    "zh": "小狗",
    "write": "xiǎo gǒu",
    "spoken": "xiáo gǒu",
    "th": "หมา (เล็ก)"
   },
   {
    "zh": "美好",
    "write": "měi hǎo",
    "spoken": "méi hǎo",
    "th": "สวยงาม"
   },
   {
    "zh": "勇敢",
    "write": "yǒng gǎn",
    "spoken": "yóng gǎn",
    "th": "กล้าหาญ"
   },
   {
    "zh": "友好",
    "write": "yǒu hǎo",
    "spoken": "yóu hǎo",
    "th": "เป็นมิตร"
   }
  ]
 },
 {
  "tone": "B",
  "label": "ทั้งวลี / 3+3+3",
  "note": "ตัวที่ 1 และ 2 → เสียง 2",
  "special": false,
  "items": [
   {
    "zh": "我也好",
    "write": "wǒ yě hǎo",
    "spoken": "wó yé hǎo",
    "th": "ฉันก็ดี"
   },
   {
    "zh": "请你买",
    "write": "qǐng nǐ mǎi",
    "spoken": "qíng ní mǎi",
    "th": "โปรดซื้อ"
   },
   {
    "zh": "很好买",
    "write": "hěn hǎo mǎi",
    "spoken": "hén háo mǎi",
    "th": "ซื้อได้ง่าย"
   },
   {
    "zh": "小姐姐",
    "write": "xiǎo jiě jie",
    "spoken": "xiáo jiě jie",
    "th": "พี่สาว (น่ารัก)"
   }
  ]
 }
]
