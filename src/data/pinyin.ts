import type { VowelData, ConsonantGroup, SpecialRule, ExampleGroup } from './types'

export const vowels: VowelData = {
 "single": [
  {
   "p": "a",
   "th": "อา",
   "zh": "啊"
  },
  {
   "p": "o",
   "th": "โอ",
   "zh": "哦"
  },
  {
   "p": "e",
   "th": "เออ (ลึก)",
   "zh": "鹅"
  },
  {
   "p": "i",
   "th": "อี",
   "zh": "一"
  },
  {
   "p": "u",
   "th": "อู",
   "zh": "乌"
  },
  {
   "p": "ü",
   "th": "อวี (ห่อปาก)",
   "zh": "鱼"
  }
 ],
 "compound": [
  {
   "p": "ai",
   "th": "อ้าย",
   "zh": "爱"
  },
  {
   "p": "ei",
   "th": "เอย",
   "zh": "诶"
  },
  {
   "p": "ao",
   "th": "เอา",
   "zh": "熬"
  },
  {
   "p": "ou",
   "th": "โอว",
   "zh": "欧"
  },
  {
   "p": "ia",
   "th": "อีอา",
   "zh": "呀"
  },
  {
   "p": "ie",
   "th": "อีเอ",
   "zh": "耶"
  },
  {
   "p": "ua",
   "th": "อัวอา",
   "zh": "蛙"
  },
  {
   "p": "uo",
   "th": "อัวโอ",
   "zh": "窝"
  },
  {
   "p": "üe",
   "th": "อวีเอ",
   "zh": "约"
  },
  {
   "p": "iao",
   "th": "อีเอา",
   "zh": "要"
  },
  {
   "p": "iou",
   "th": "อีโอว",
   "zh": "优"
  },
  {
   "p": "uai",
   "th": "อัวไอ",
   "zh": "外"
  },
  {
   "p": "uei",
   "th": "อัวเอย",
   "zh": "威"
  }
 ],
 "nasal": [
  {
   "p": "an",
   "th": "อาน",
   "zh": "安"
  },
  {
   "p": "en",
   "th": "เอิน",
   "zh": "恩"
  },
  {
   "p": "ang",
   "th": "อาง",
   "zh": "昂"
  },
  {
   "p": "eng",
   "th": "เอิง",
   "zh": "鞥"
  },
  {
   "p": "ong",
   "th": "อง",
   "zh": "翁"
  },
  {
   "p": "er",
   "th": "เอ้อร์",
   "zh": "儿"
  },
  {
   "p": "in",
   "th": "อิน",
   "zh": "因"
  },
  {
   "p": "ing",
   "th": "อิง",
   "zh": "英"
  },
  {
   "p": "ian",
   "th": "อีเยน",
   "zh": "烟"
  },
  {
   "p": "iang",
   "th": "อีอาง",
   "zh": "央"
  },
  {
   "p": "iong",
   "th": "อีอง",
   "zh": "用"
  },
  {
   "p": "uan",
   "th": "อัวอาน",
   "zh": "弯"
  },
  {
   "p": "uang",
   "th": "อัวอาง",
   "zh": "旺"
  },
  {
   "p": "un",
   "th": "อัวน",
   "zh": "温"
  },
  {
   "p": "üan",
   "th": "อวีเยน",
   "zh": "元"
  },
  {
   "p": "ün",
   "th": "อวีน",
   "zh": "晕"
  }
 ]
}

export const consonantGroups: ConsonantGroup[] = [
 {
  "name": "ริมฝีปาก",
  "color": "blue",
  "noteClass": "cn-blue",
  "badges": [
   {
    "text": "✓ a o u i",
    "cls": "badge-ok"
   },
   {
    "text": "✗ ü",
    "cls": "badge-err"
   }
  ],
  "note": "<b>b p</b> ต่างกันที่ลม: b ไม่พ่นลม / p พ่นลม (เหมือน ป vs พ ในไทย) — <b>f</b> ใช้ได้แค่กับ a, o, u (ไม่มี fi)",
  "items": [
   {
    "p": "b",
    "th": "บ (ไม่พ่นลม)",
    "zh": "爸"
   },
   {
    "p": "p",
    "th": "พ (พ่นลม)",
    "zh": "怕"
   },
   {
    "p": "m",
    "th": "ม",
    "zh": "妈"
   },
   {
    "p": "f",
    "th": "ฝ",
    "zh": "发"
   }
  ]
 },
 {
  "name": "ปุ่มเหงือก",
  "color": "purple",
  "noteClass": "cn-purple",
  "badges": [
   {
    "text": "✓ a o e u i",
    "cls": "badge-ok"
   },
   {
    "text": "n,l + ü ✓",
    "cls": "badge-ok"
   },
   {
    "text": "d,t + ü ✗",
    "cls": "badge-warn"
   }
  ],
  "note": "<b>n</b> และ <b>l</b> ใช้กับ ü ได้ → nü (หนู), lü (สีเขียว) — <b>d t</b> ไม่มีคำที่ใช้กับ ü",
  "items": [
   {
    "p": "d",
    "th": "ด (ไม่พ่นลม)",
    "zh": "大"
   },
   {
    "p": "t",
    "th": "ท (พ่นลม)",
    "zh": "他"
   },
   {
    "p": "n",
    "th": "น",
    "zh": "你"
   },
   {
    "p": "l",
    "th": "ล",
    "zh": "来"
   }
  ]
 },
 {
  "name": "เพดานอ่อน",
  "color": "green",
  "noteClass": "cn-green",
  "badges": [
   {
    "text": "✓ a o e u",
    "cls": "badge-ok"
   },
   {
    "text": "✗ i และ ü",
    "cls": "badge-err"
   }
  ],
  "note": "<b>g k h</b> ใช้กับ a/o/e/u เท่านั้น — ไม่มี gi, ki, hi, gü, kü, hü ในภาษาจีน",
  "items": [
   {
    "p": "g",
    "th": "ก (ไม่พ่นลม)",
    "zh": "个"
   },
   {
    "p": "k",
    "th": "ข (พ่นลม)",
    "zh": "可"
   },
   {
    "p": "h",
    "th": "ฮ (เสียดแทรก)",
    "zh": "好"
   }
  ]
 },
 {
  "name": "เพดานแข็ง",
  "color": "orange",
  "noteClass": "cn-orange",
  "badges": [
   {
    "text": "✓ i และ ü เท่านั้น",
    "cls": "badge-warn"
   },
   {
    "text": "ü → เขียนเป็น u",
    "cls": "badge-special"
   }
  ],
  "note": "<b>j q x</b> ใช้กับ i และ ü เท่านั้น — เมื่อเจอ ü จะเขียน u แต่ออกเสียง ü: ju = จวี, qu = ชวี, xu = ซวี — <b>ไม่มี</b> ja, jo, je, ju(อู)",
  "items": [
   {
    "p": "j",
    "th": "จ (ไม่พ่นลม)",
    "zh": "家"
   },
   {
    "p": "q",
    "th": "ช (พ่นลม)",
    "zh": "去"
   },
   {
    "p": "x",
    "th": "ซ (เสียดแทรก)",
    "zh": "西"
   }
  ]
 },
 {
  "name": "ม้วนลิ้น (Retroflex)",
  "color": "red",
  "noteClass": "cn-red",
  "badges": [
   {
    "text": "✓ a o e u",
    "cls": "badge-ok"
   },
   {
    "text": "✗ ü",
    "cls": "badge-err"
   },
   {
    "text": "i = เสียงพิเศษ",
    "cls": "badge-special"
   }
  ],
  "note": "<b>zh ch sh r</b> ต้องม้วนลิ้นขึ้นแตะเพดาน — เสียง i ใน zhi/chi/shi/ri ไม่ใช่ \"อี\" ปกติ แต่เป็นเสียงหึ่งที่เกิดจากการม้วนลิ้น",
  "items": [
   {
    "p": "zh",
    "th": "จ (ม้วนลิ้น)",
    "zh": "这"
   },
   {
    "p": "ch",
    "th": "ช (ม้วนลิ้น)",
    "zh": "吃"
   },
   {
    "p": "sh",
    "th": "ช (เสียดแทรก+ม้วน)",
    "zh": "是"
   },
   {
    "p": "r",
    "th": "ร (ม้วนลิ้น)",
    "zh": "人"
   }
  ]
 },
 {
  "name": "ไม่ม้วนลิ้น (Sibilant)",
  "color": "teal",
  "noteClass": "cn-teal",
  "badges": [
   {
    "text": "✓ a o e u",
    "cls": "badge-ok"
   },
   {
    "text": "✗ ü",
    "cls": "badge-err"
   },
   {
    "text": "i = เสียงพิเศษ",
    "cls": "badge-special"
   }
  ],
  "note": "<b>z c s</b> ลิ้นอยู่ข้างหน้า ไม่ม้วน — เสียง i ใน zi/ci/si เป็นเสียงหึ่งที่เกิดจากการดึงลิ้น ต่างจากกลุ่มม้วนลิ้น",
  "items": [
   {
    "p": "z",
    "th": "จ (ไม่ม้วน)",
    "zh": "字"
   },
   {
    "p": "c",
    "th": "ช (ไม่ม้วน)",
    "zh": "次"
   },
   {
    "p": "s",
    "th": "ซ (ไม่ม้วน)",
    "zh": "四"
   }
  ]
 }
]

export const specialRules: SpecialRule[] = [
 {
  "title": "一 (yī) เปลี่ยนเสียงตามพยางค์ถัดไป",
  "desc": "ปกติออกเสียง yī (เสียง 1) แต่เปลี่ยนตามสิ่งที่ตามมา",
  "bg": "bg-violet",
  "col": "col-violet",
  "items": [
   {
    "before": "yī",
    "after": "yí",
    "zh": "一个",
    "mean": "หนึ่งอัน",
    "label": "ก่อนเสียงที่ 4",
    "play": "一个"
   },
   {
    "before": "yī",
    "after": "yì",
    "zh": "一天",
    "mean": "หนึ่งวัน",
    "label": "ก่อนเสียงที่ 1",
    "play": "一天"
   },
   {
    "before": "yī",
    "after": "yì",
    "zh": "一起",
    "mean": "ด้วยกัน",
    "label": "ก่อนเสียงที่ 2/3",
    "play": "一起"
   },
   {
    "before": "",
    "after": "yī",
    "zh": "第一",
    "mean": "อันดับหนึ่ง",
    "label": "ท้ายคำ = เสียง 1",
    "play": "第一"
   },
   {
    "before": "",
    "after": "yī",
    "zh": "统一",
    "mean": "รวมกัน",
    "label": "ท้ายคำ = เสียง 1",
    "play": "统一"
   },
   {
    "before": "yī",
    "after": "yí",
    "zh": "一样",
    "mean": "เหมือนกัน",
    "label": "ก่อนเสียงที่ 4",
    "play": "一样"
   }
  ]
 },
 {
  "title": "不 (bù) เปลี่ยนเสียงก่อนเสียงที่ 4",
  "desc": "ปกติออกเสียง bù (เสียง 4) แต่ถ้าพยางค์ถัดไปเป็นเสียง 4 เปลี่ยนเป็น bú (เสียง 2)",
  "bg": "bg-indigo",
  "col": "col-indigo",
  "items": [
   {
    "before": "bù",
    "after": "bú duì",
    "zh": "不对",
    "mean": "ไม่ถูก",
    "label": "duì = เสียง 4",
    "play": "不对"
   },
   {
    "before": "bù",
    "after": "bú shì",
    "zh": "不是",
    "mean": "ไม่ใช่",
    "label": "shì = เสียง 4",
    "play": "不是"
   },
   {
    "before": "bù",
    "after": "bú yòng",
    "zh": "不用",
    "mean": "ไม่ต้อง",
    "label": "yòng = เสียง 4",
    "play": "不用"
   },
   {
    "before": "",
    "after": "bù hǎo",
    "zh": "不好",
    "mean": "ไม่ดี",
    "label": "hǎo = เสียง 3 ไม่เปลี่ยน",
    "play": "不好"
   },
   {
    "before": "",
    "after": "bù lái",
    "zh": "不来",
    "mean": "ไม่มา",
    "label": "lái = เสียง 2 ไม่เปลี่ยน",
    "play": "不来"
   },
   {
    "before": "",
    "after": "bù chī",
    "zh": "不吃",
    "mean": "ไม่กิน",
    "label": "chī = เสียง 1 ไม่เปลี่ยน",
    "play": "不吃"
   }
  ]
 },
 {
  "title": "เสียงที่ 3 + เสียงที่ 3 → เสียงที่ 2 + เสียงที่ 3",
  "desc": "พยางค์เสียง 3 สองตัวติดกัน ตัวแรกเปลี่ยนเป็นเสียง 2 เพื่อพูดง่ายขึ้น",
  "bg": "bg-teal2",
  "col": "col-teal2",
  "items": [
   {
    "before": "nǐ hǎo",
    "after": "ní hǎo",
    "zh": "你好",
    "mean": "สวัสดี",
    "label": "3+3 → 2+3",
    "play": "你好"
   },
   {
    "before": "kě yǐ",
    "after": "ké yǐ",
    "zh": "可以",
    "mean": "ได้/อนุญาต",
    "label": "3+3 → 2+3",
    "play": "可以"
   },
   {
    "before": "wǒ yě",
    "after": "wó yě",
    "zh": "我也",
    "mean": "ฉันก็เช่นกัน",
    "label": "3+3 → 2+3",
    "play": "我也"
   },
   {
    "before": "lǎo shǔ",
    "after": "láo shǔ",
    "zh": "老鼠",
    "mean": "หนู (สัตว์)",
    "label": "3+3 → 2+3",
    "play": "老鼠"
   },
   {
    "before": "měi hǎo",
    "after": "méi hǎo",
    "zh": "美好",
    "mean": "งดงาม",
    "label": "3+3 → 2+3",
    "play": "美好"
   },
   {
    "before": "yǐ wǎng",
    "after": "yí wǎng",
    "zh": "以往",
    "mean": "ในอดีต",
    "label": "3+3 → 2+3",
    "play": "以往"
   }
  ]
 },
 {
  "title": "ü ปลอมตัวเป็น u หลัง j / q / x / y",
  "desc": "j q x y ตามด้วย ü จะเขียน u แต่ต้องออกเสียง ü (ห่อปาก) เสมอ",
  "bg": "bg-pink",
  "col": "col-pink",
  "items": [
   {
    "before": "jü",
    "after": "ju",
    "zh": "居",
    "mean": "อาศัย",
    "label": "เขียน ju ออกเสียง jü",
    "play": "居"
   },
   {
    "before": "qü",
    "after": "qu",
    "zh": "去",
    "mean": "ไป",
    "label": "เขียน qu ออกเสียง qü",
    "play": "去"
   },
   {
    "before": "xü",
    "after": "xu",
    "zh": "需",
    "mean": "ต้องการ",
    "label": "เขียน xu ออกเสียง xü",
    "play": "需"
   },
   {
    "before": "yü",
    "after": "yu",
    "zh": "鱼",
    "mean": "ปลา",
    "label": "เขียน yu ออกเสียง yü",
    "play": "鱼"
   },
   {
    "before": "nü",
    "after": "nü",
    "zh": "女",
    "mean": "ผู้หญิง",
    "label": "n,l ยังมีจุด (ไม่เปลี่ยน)",
    "play": "女"
   },
   {
    "before": "lü",
    "after": "lü",
    "zh": "旅",
    "mean": "ท่องเที่ยว",
    "label": "n,l ยังมีจุด (ไม่เปลี่ยน)",
    "play": "旅"
   }
  ]
 },
 {
  "title": "เสียง i มี 3 แบบ ออกเสียงต่างกัน",
  "desc": "ตัวอักษร i เดียวกัน แต่เสียงแตกต่างกันตามพยัญชนะนำ",
  "bg": "bg-brown",
  "col": "col-brown",
  "items": [
   {
    "before": "",
    "after": "bī",
    "zh": "逼",
    "mean": "บังคับ",
    "label": "i แท้ = อี (ริมฝีปาก)",
    "play": "逼"
   },
   {
    "before": "",
    "after": "mī",
    "zh": "咪",
    "mean": "แมว (เสียง)",
    "label": "i แท้ = อี (ริมฝีปาก)",
    "play": "咪"
   },
   {
    "before": "",
    "after": "zhī",
    "zh": "知",
    "mean": "รู้",
    "label": "i ม้วนลิ้น = เสียงหึ่ง",
    "play": "知"
   },
   {
    "before": "",
    "after": "shī",
    "zh": "师",
    "mean": "อาจารย์",
    "label": "i ม้วนลิ้น = เสียงหึ่ง",
    "play": "师"
   },
   {
    "before": "",
    "after": "zī",
    "zh": "字",
    "mean": "อักษร",
    "label": "i ดึงลิ้น = เสียงหึ่ง",
    "play": "字"
   },
   {
    "before": "",
    "after": "sī",
    "zh": "丝",
    "mean": "ไหม",
    "label": "i ดึงลิ้น = เสียงหึ่ง",
    "play": "丝"
   }
  ]
 },
 {
  "title": "iou / uei / uen ตัดสั้นเมื่อมีพยัญชนะนำ",
  "desc": "เขียนสั้นลงในพินอิน แต่ยังออกเสียงครบ เสียงกลางจะเบาลง",
  "bg": "bg-bluegrey",
  "col": "col-bluegrey",
  "items": [
   {
    "before": "liou",
    "after": "liú",
    "zh": "六",
    "mean": "หก",
    "label": "iou → iu (สระกลางเบา)",
    "play": "六"
   },
   {
    "before": "niou",
    "after": "niú",
    "zh": "牛",
    "mean": "วัว",
    "label": "iou → iu",
    "play": "牛"
   },
   {
    "before": "duei",
    "after": "duì",
    "zh": "对",
    "mean": "ถูก/คู่",
    "label": "uei → ui (สระกลางเบา)",
    "play": "对"
   },
   {
    "before": "guei",
    "after": "guì",
    "zh": "贵",
    "mean": "แพง",
    "label": "uei → ui",
    "play": "贵"
   },
   {
    "before": "luen",
    "after": "lùn",
    "zh": "论",
    "mean": "กล่าวถึง",
    "label": "uen → un (สระกลางเบา)",
    "play": "论"
   },
   {
    "before": "cuen",
    "after": "cún",
    "zh": "存",
    "mean": "เก็บ/ฝาก",
    "label": "uen → un",
    "play": "存"
   }
  ]
 },
 {
  "title": "สระขึ้นต้นคำเปลี่ยนเป็น y / w",
  "desc": "สระ i/ü series ที่ไม่มีพยัญชนะนำ จะเติม y หน้า / สระ u series เติม w หน้า",
  "bg": "bg-deeporange",
  "col": "col-deeporange",
  "items": [
   {
    "before": "i",
    "after": "yi",
    "zh": "一",
    "mean": "หนึ่ง",
    "label": "i → yi",
    "play": "一"
   },
   {
    "before": "in",
    "after": "yīn",
    "zh": "因",
    "mean": "เพราะ",
    "label": "in → yin",
    "play": "因"
   },
   {
    "before": "ing",
    "after": "yīng",
    "zh": "英",
    "mean": "อังกฤษ/ดอกไม้",
    "label": "ing → ying",
    "play": "英"
   },
   {
    "before": "u",
    "after": "wu",
    "zh": "五",
    "mean": "ห้า",
    "label": "u → wu",
    "play": "五"
   },
   {
    "before": "uan",
    "after": "wān",
    "zh": "弯",
    "mean": "โค้ง",
    "label": "uan → wan",
    "play": "弯"
   },
   {
    "before": "ü",
    "after": "yú",
    "zh": "鱼",
    "mean": "ปลา",
    "label": "ü → yu",
    "play": "鱼"
   }
  ]
 }
]

export const examples: ExampleGroup[] = [
 {
  "con": "b",
  "color": "blue",
  "th": "บ",
  "items": [
   {
    "py": "bā",
    "zh": "八",
    "mean": "แปด"
   },
   {
    "py": "bǐ",
    "zh": "笔",
    "mean": "ปากกา"
   },
   {
    "py": "bù",
    "zh": "不",
    "mean": "ไม่"
   },
   {
    "py": "bái",
    "zh": "白",
    "mean": "ขาว"
   }
  ]
 },
 {
  "con": "p",
  "color": "blue",
  "th": "พ",
  "items": [
   {
    "py": "pá",
    "zh": "爬",
    "mean": "ปีน"
   },
   {
    "py": "pí",
    "zh": "皮",
    "mean": "ผิวหนัง"
   },
   {
    "py": "pǔ",
    "zh": "普",
    "mean": "ทั่วไป"
   },
   {
    "py": "pào",
    "zh": "泡",
    "mean": "ฟอง"
   }
  ]
 },
 {
  "con": "m",
  "color": "blue",
  "th": "ม",
  "items": [
   {
    "py": "mā",
    "zh": "妈",
    "mean": "แม่"
   },
   {
    "py": "mǐ",
    "zh": "米",
    "mean": "ข้าว"
   },
   {
    "py": "mù",
    "zh": "木",
    "mean": "ไม้"
   },
   {
    "py": "měi",
    "zh": "美",
    "mean": "สวยงาม"
   }
  ]
 },
 {
  "con": "f",
  "color": "blue",
  "th": "ฝ",
  "items": [
   {
    "py": "fā",
    "zh": "发",
    "mean": "ส่ง/ผม"
   },
   {
    "py": "fēng",
    "zh": "风",
    "mean": "ลม"
   },
   {
    "py": "fù",
    "zh": "富",
    "mean": "รวย"
   },
   {
    "py": "fàn",
    "zh": "饭",
    "mean": "ข้าว/อาหาร"
   }
  ]
 },
 {
  "con": "d",
  "color": "purple",
  "th": "ด",
  "items": [
   {
    "py": "dà",
    "zh": "大",
    "mean": "ใหญ่"
   },
   {
    "py": "dì",
    "zh": "地",
    "mean": "พื้นดิน"
   },
   {
    "py": "dū",
    "zh": "都",
    "mean": "ทั้งหมด"
   },
   {
    "py": "diǎn",
    "zh": "点",
    "mean": "จุด/นาที"
   }
  ]
 },
 {
  "con": "t",
  "color": "purple",
  "th": "ท",
  "items": [
   {
    "py": "tā",
    "zh": "他",
    "mean": "เขา"
   },
   {
    "py": "tǐ",
    "zh": "体",
    "mean": "ร่างกาย"
   },
   {
    "py": "tū",
    "zh": "突",
    "mean": "ทันที"
   },
   {
    "py": "tiān",
    "zh": "天",
    "mean": "ฟ้า/วัน"
   }
  ]
 },
 {
  "con": "n",
  "color": "purple",
  "th": "น",
  "items": [
   {
    "py": "nǎ",
    "zh": "哪",
    "mean": "ที่ไหน"
   },
   {
    "py": "nǐ",
    "zh": "你",
    "mean": "คุณ"
   },
   {
    "py": "nǚ",
    "zh": "女",
    "mean": "ผู้หญิง"
   },
   {
    "py": "niú",
    "zh": "牛",
    "mean": "วัว"
   }
  ]
 },
 {
  "con": "l",
  "color": "purple",
  "th": "ล",
  "items": [
   {
    "py": "lái",
    "zh": "来",
    "mean": "มา"
   },
   {
    "py": "lǐ",
    "zh": "里",
    "mean": "ข้างใน"
   },
   {
    "py": "lǚ",
    "zh": "旅",
    "mean": "ท่องเที่ยว"
   },
   {
    "py": "liǎn",
    "zh": "脸",
    "mean": "ใบหน้า"
   }
  ]
 },
 {
  "con": "g",
  "color": "green",
  "th": "ก",
  "items": [
   {
    "py": "gǎo",
    "zh": "搞",
    "mean": "ทำ/จัดการ"
   },
   {
    "py": "gè",
    "zh": "个",
    "mean": "(ลักษณนาม)"
   },
   {
    "py": "gǒu",
    "zh": "狗",
    "mean": "หมา"
   },
   {
    "py": "guó",
    "zh": "国",
    "mean": "ประเทศ"
   }
  ]
 },
 {
  "con": "k",
  "color": "green",
  "th": "ข",
  "items": [
   {
    "py": "kā",
    "zh": "咖",
    "mean": "(กาแฟ)"
   },
   {
    "py": "kě",
    "zh": "可",
    "mean": "ได้"
   },
   {
    "py": "kū",
    "zh": "哭",
    "mean": "ร้องไห้"
   },
   {
    "py": "kuài",
    "zh": "快",
    "mean": "เร็ว"
   }
  ]
 },
 {
  "con": "h",
  "color": "green",
  "th": "ฮ",
  "items": [
   {
    "py": "hǎo",
    "zh": "好",
    "mean": "ดี"
   },
   {
    "py": "hé",
    "zh": "和",
    "mean": "และ"
   },
   {
    "py": "hū",
    "zh": "呼",
    "mean": "หายใจออก"
   },
   {
    "py": "huā",
    "zh": "花",
    "mean": "ดอกไม้"
   }
  ]
 },
 {
  "con": "j",
  "color": "orange",
  "th": "จ",
  "items": [
   {
    "py": "jī",
    "zh": "鸡",
    "mean": "ไก่"
   },
   {
    "py": "jiā",
    "zh": "家",
    "mean": "บ้าน"
   },
   {
    "py": "jiǔ",
    "zh": "酒",
    "mean": "เหล้า"
   },
   {
    "py": "jú",
    "zh": "局",
    "mean": "สำนักงาน (jü)"
   }
  ]
 },
 {
  "con": "q",
  "color": "orange",
  "th": "ช",
  "items": [
   {
    "py": "qī",
    "zh": "七",
    "mean": "เจ็ด"
   },
   {
    "py": "qián",
    "zh": "钱",
    "mean": "เงิน"
   },
   {
    "py": "qǐng",
    "zh": "请",
    "mean": "กรุณา"
   },
   {
    "py": "qú",
    "zh": "渠",
    "mean": "คลอง (qü)"
   }
  ]
 },
 {
  "con": "x",
  "color": "orange",
  "th": "ซ",
  "items": [
   {
    "py": "xī",
    "zh": "西",
    "mean": "ตะวันตก"
   },
   {
    "py": "xiǎo",
    "zh": "小",
    "mean": "เล็ก"
   },
   {
    "py": "xué",
    "zh": "学",
    "mean": "เรียน"
   },
   {
    "py": "xū",
    "zh": "须",
    "mean": "จำเป็น (xü)"
   }
  ]
 },
 {
  "con": "zh",
  "color": "red",
  "th": "จ(ม้วน)",
  "items": [
   {
    "py": "zhè",
    "zh": "这",
    "mean": "นี้"
   },
   {
    "py": "zhī",
    "zh": "知",
    "mean": "รู้"
   },
   {
    "py": "zhōng",
    "zh": "中",
    "mean": "กลาง/จีน"
   },
   {
    "py": "zhǔ",
    "zh": "主",
    "mean": "หลัก"
   }
  ]
 },
 {
  "con": "ch",
  "color": "red",
  "th": "ช(ม้วน)",
  "items": [
   {
    "py": "chī",
    "zh": "吃",
    "mean": "กิน"
   },
   {
    "py": "chá",
    "zh": "茶",
    "mean": "ชา"
   },
   {
    "py": "chē",
    "zh": "车",
    "mean": "รถ"
   },
   {
    "py": "chū",
    "zh": "出",
    "mean": "ออก"
   }
  ]
 },
 {
  "con": "sh",
  "color": "red",
  "th": "ช(เสียด+ม้วน)",
  "items": [
   {
    "py": "shì",
    "zh": "是",
    "mean": "เป็น/ใช่"
   },
   {
    "py": "shū",
    "zh": "书",
    "mean": "หนังสือ"
   },
   {
    "py": "shé",
    "zh": "蛇",
    "mean": "งู"
   },
   {
    "py": "shān",
    "zh": "山",
    "mean": "ภูเขา"
   }
  ]
 },
 {
  "con": "r",
  "color": "red",
  "th": "ร(ม้วน)",
  "items": [
   {
    "py": "rén",
    "zh": "人",
    "mean": "คน"
   },
   {
    "py": "rì",
    "zh": "日",
    "mean": "วัน/อาทิตย์"
   },
   {
    "py": "rú",
    "zh": "如",
    "mean": "เหมือน"
   },
   {
    "py": "ròu",
    "zh": "肉",
    "mean": "เนื้อ"
   }
  ]
 },
 {
  "con": "z",
  "color": "teal",
  "th": "จ(ดึงลิ้น)",
  "items": [
   {
    "py": "zì",
    "zh": "字",
    "mean": "ตัวอักษร"
   },
   {
    "py": "zǎo",
    "zh": "早",
    "mean": "เช้า"
   },
   {
    "py": "zé",
    "zh": "则",
    "mean": "กฎ"
   },
   {
    "py": "zū",
    "zh": "租",
    "mean": "เช่า"
   }
  ]
 },
 {
  "con": "c",
  "color": "teal",
  "th": "ช(ดึงลิ้น)",
  "items": [
   {
    "py": "cì",
    "zh": "次",
    "mean": "ครั้ง"
   },
   {
    "py": "cài",
    "zh": "菜",
    "mean": "ผัก/กับข้าว"
   },
   {
    "py": "cè",
    "zh": "册",
    "mean": "เล่ม"
   },
   {
    "py": "cū",
    "zh": "粗",
    "mean": "หยาบ"
   }
  ]
 },
 {
  "con": "s",
  "color": "teal",
  "th": "ซ(ดึงลิ้น)",
  "items": [
   {
    "py": "sì",
    "zh": "四",
    "mean": "สี่"
   },
   {
    "py": "sān",
    "zh": "三",
    "mean": "สาม"
   },
   {
    "py": "sè",
    "zh": "色",
    "mean": "สี"
   },
   {
    "py": "sū",
    "zh": "苏",
    "mean": "ฟื้นคืน"
   }
  ]
 }
]
