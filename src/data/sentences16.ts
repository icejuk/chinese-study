import type { Sentence } from './types'

/* ประโยคเรียงคำของบทที่ 16 (你常去图书馆吗) — 29 ประโยค
   เขียนเพิ่มเพราะแบบฝึกเรียงประโยค/ฟังแปลดึงข้อจากประโยคเท่านั้น
   ถ้าคำใหม่ของบทไม่โผล่ในประโยคเลย คำนั้นจะไม่เคยถูกฝึกใน 2 แบบฝึกนั้น
   (เทสคุมไว้ที่ lib/grade.test.ts — "คำศัพท์ทุกคำต้องมีอยู่ในประโยค")

   ใช้เฉพาะคำที่อยู่ในคลังแล้ว (324 คำในบท + 39 คำ HSK 1) */
export const sentences16: Sentence[] = [
  { th: 'ตอนนี้ฉันจะไปห้องสมุด', cat: 'life',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '现在', py: 'xiànzài' }, { zh: '去', py: 'qù' }, { zh: '图书馆', py: 'túshūguǎn' }] },

  { th: 'คุณไปกับฉันด้วยกันไหม', cat: 'ask', note: 'เรียง: ใคร + 跟 + ใคร + 一起 + กริยา',
    tokens: [{ zh: '你', py: 'nǐ' }, { zh: '跟', py: 'gēn' }, { zh: '我', py: 'wǒ' }, { zh: '一起', py: 'yìqǐ' }, { zh: '去', py: 'qù' }, { zh: '吗', py: 'ma' }] },

  { th: 'พวกเราไปกันเถอะ', cat: 'life', note: '咱们 = พวกเราที่รวมคนฟังด้วย',
    tokens: [{ zh: '咱们', py: 'zánmen' }, { zh: '走', py: 'zǒu' }, { zh: '吧', py: 'ba' }] },

  { th: 'คุณไปห้องสมุดบ่อยไหม', cat: 'ask',
    tokens: [{ zh: '你', py: 'nǐ' }, { zh: '常', py: 'cháng' }, { zh: '去', py: 'qù' }, { zh: '图书馆', py: 'túshūguǎn' }, { zh: '吗', py: 'ma' }] },

  { th: 'ฉันยืมหนังสือที่ห้องสมุดบ่อย', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '常', py: 'cháng' }, { zh: '在', py: 'zài' }, { zh: '图书馆', py: 'túshūguǎn' }, { zh: '借', py: 'jiè' }, { zh: '书', py: 'shū' }] },

  { th: 'บางครั้งฉันเล่นเน็ตค้นข้อมูล', cat: 'life',
    tokens: [{ zh: '有时候', py: 'yǒu shíhou' }, { zh: '我', py: 'wǒ' }, { zh: '上网', py: 'shàng wǎng' }, { zh: '查', py: 'chá' }, { zh: '资料', py: 'zīliào' }] },

  { th: 'ฉันอ่านหนังสือที่หอพักเสมอ', cat: 'mix', note: 'ลำดับ: ใคร + 总 + 在 + สถานที่ + กริยา',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '总', py: 'zǒng' }, { zh: '在', py: 'zài' }, { zh: '宿舍', py: 'sùshè' }, { zh: '看', py: 'kàn' }, { zh: '书', py: 'shū' }] },

  { th: 'หอพักของฉันเงียบมาก', cat: 'de',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '的', py: 'de' }, { zh: '宿舍', py: 'sùshè' }, { zh: '很', py: 'hěn' }, { zh: '安静', py: 'ānjìng' }] },

  { th: 'ห้องสมุดเงียบไหม', cat: 'ask',
    tokens: [{ zh: '图书馆', py: 'túshūguǎn' }, { zh: '安静', py: 'ānjìng' }, { zh: '吗', py: 'ma' }] },

  { th: 'ตอนเย็นคุณทำอะไรบ่อย', cat: 'mix',
    tokens: [{ zh: '晚上', py: 'wǎnshang' }, { zh: '你', py: 'nǐ' }, { zh: '常', py: 'cháng' }, { zh: '做', py: 'zuò' }, { zh: '什么', py: 'shénme' }] },

  { th: 'ฉันทบทวนบทเรียนแล้วเตรียมคำศัพท์ใหม่', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '复习', py: 'fùxí' }, { zh: '课文，', py: 'kèwén,' }, { zh: '预习', py: 'yùxí' }, { zh: '生词', py: 'shēngcí' }] },

  { th: 'ตอนเย็นฉันทำแบบฝึกหัดหรือดูทีวี', cat: 'mix', note: '或者 = หรือ ใช้ในประโยคบอกเล่า (คำถามใช้ 还是)',
    tokens: [{ zh: '晚上', py: 'wǎnshang' }, { zh: '我', py: 'wǒ' }, { zh: '做', py: 'zuò' }, { zh: '练习', py: 'liànxí' }, { zh: '或者', py: 'huòzhě' }, { zh: '看', py: 'kàn' }, { zh: '电视', py: 'diànshì' }] },

  { th: 'คุณทำแบบฝึกหัดหรือดูซีรีส์', cat: 'or', note: 'คำถามให้เลือกใช้ 还是 ไม่ใช่ 或者',
    tokens: [{ zh: '你', py: 'nǐ' }, { zh: '做', py: 'zuò' }, { zh: '练习', py: 'liànxí' }, { zh: '还是', py: 'háishi' }, { zh: '看', py: 'kàn' }, { zh: '电视剧', py: 'diànshìjù' }] },

  { th: 'บางครั้งฉันเล่นเน็ตคุยเล่นกับเพื่อน', cat: 'life',
    tokens: [{ zh: '有时候', py: 'yǒu shíhou' }, { zh: '我', py: 'wǒ' }, { zh: '上网', py: 'shàng wǎng' }, { zh: '跟', py: 'gēn' }, { zh: '朋友', py: 'péngyou' }, { zh: '聊天儿', py: 'liáo tiānr' }] },

  { th: 'ฉันส่งวีแชทให้เพื่อน', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '发', py: 'fā' }, { zh: '微信', py: 'wēixìn' }, { zh: '给', py: 'gěi' }, { zh: '朋友', py: 'péngyou' }] },

  { th: 'ตอนเย็นฉันรับส่งอีเมล', cat: 'mix',
    tokens: [{ zh: '晚上', py: 'wǎnshang' }, { zh: '我', py: 'wǒ' }, { zh: '收发', py: 'shōufā' }, { zh: '邮件', py: 'yóujiàn' }] },

  { th: 'ฉันชอบดูหนังจีนและซีรีส์', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '喜欢', py: 'xǐhuan' }, { zh: '看', py: 'kàn' }, { zh: '中文', py: 'Zhōngwén' }, { zh: '电影', py: 'diànyǐng' }, { zh: '和', py: 'hé' }, { zh: '电视剧', py: 'diànshìjù' }] },

  { th: 'ฉันดูซีรีส์น้อยมาก', cat: 'mix', note: '很少 + กริยา = แทบไม่… / น้อยครั้ง',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '很', py: 'hěn' }, { zh: '少', py: 'shǎo' }, { zh: '看', py: 'kàn' }, { zh: '电视剧', py: 'diànshìjù' }] },

  { th: 'วันอาทิตย์ฉันพักผ่อนที่หอพัก', cat: 'life',
    tokens: [{ zh: '星期天', py: 'xīngqītiān' }, { zh: '我', py: 'wǒ' }, { zh: '在', py: 'zài' }, { zh: '宿舍', py: 'sùshè' }, { zh: '休息', py: 'xiūxi' }] },

  { th: 'บางครั้งฉันไปเที่ยวสวนสาธารณะกับเพื่อน', cat: 'life',
    tokens: [{ zh: '有时候', py: 'yǒu shíhou' }, { zh: '我', py: 'wǒ' }, { zh: '跟', py: 'gēn' }, { zh: '朋友', py: 'péngyou' }, { zh: '一起', py: 'yìqǐ' }, { zh: '去', py: 'qù' }, { zh: '公园', py: 'gōngyuán' }, { zh: '玩儿', py: 'wánr' }] },

  { th: 'ฉันไปซื้อของที่ซูเปอร์มาร์เก็ต', cat: 'shop',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '去', py: 'qù' }, { zh: '超市', py: 'chāoshì' }, { zh: '买', py: 'mǎi' }, { zh: '东西', py: 'dōngxi' }] },

  { th: 'ฉันไปห้องสมุดบ่อย แต่ไม่ค่อยอ่านหนังสือที่นั่น', cat: 'bu', note: '但 = แต่ (สั้นกว่า 但是 ใช้แทนกันได้)',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '常', py: 'cháng' }, { zh: '去', py: 'qù' }, { zh: '图书馆，', py: 'túshūguǎn,' }, { zh: '但', py: 'dàn' }, { zh: '不', py: 'bù' }, { zh: '常', py: 'cháng' }, { zh: '在', py: 'zài' }, { zh: '那儿', py: 'nàr' }, { zh: '看', py: 'kàn' }, { zh: '书', py: 'shū' }] },

  { th: 'เพื่อนของฉันไม่ค่อยเล่นเน็ต', cat: 'bu',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '的', py: 'de' }, { zh: '朋友', py: 'péngyou' }, { zh: '不', py: 'bù' }, { zh: '常', py: 'cháng' }, { zh: '上网', py: 'shàng wǎng' }] },

  { th: 'ตอนเด็กฉันชอบเล่นมาก', cat: 'de', note: 'adj + 的时候 = ตอนที่… (小的时候 = ตอนเด็ก)',
    tokens: [{ zh: '小', py: 'xiǎo' }, { zh: '的', py: 'de' }, { zh: '时候', py: 'shíhou' }, { zh: '我', py: 'wǒ' }, { zh: '很', py: 'hěn' }, { zh: '喜欢', py: 'xǐhuan' }, { zh: '玩儿', py: 'wánr' }] },

  { th: 'ตอนกินข้าวฉันชอบดูทีวี', cat: 'de', note: 'กริยา + 的时候 = ตอนที่ทำสิ่งนั้น',
    tokens: [{ zh: '吃', py: 'chī' }, { zh: '饭', py: 'fàn' }, { zh: '的', py: 'de' }, { zh: '时候', py: 'shíhou' }, { zh: '我', py: 'wǒ' }, { zh: '喜欢', py: 'xǐhuan' }, { zh: '看', py: 'kàn' }, { zh: '电视', py: 'diànshì' }] },

  { th: 'ตอนเย็นพวกเราไปดูหนังกันไหม', cat: 'ask', note: 'ตัวอย่างของหนังสือ — ประโยคบอกเล่า + 好吗？= ชวน',
    tokens: [{ zh: '晚上', py: 'wǎnshang' }, { zh: '咱们', py: 'zánmen' }, { zh: '去', py: 'qù' }, { zh: '看', py: 'kàn' }, { zh: '电影，', py: 'diànyǐng,' }, { zh: '好吗', py: 'hǎo ma' }] },

  { th: 'พวกเราไปซูเปอร์มาร์เก็ตด้วยกันไหม', cat: 'ask', note: 'ตัวอย่างของหนังสือ — 我们一起去…，好吗？',
    tokens: [{ zh: '我们', py: 'wǒmen' }, { zh: '一起', py: 'yìqǐ' }, { zh: '去', py: 'qù' }, { zh: '超市，', py: 'chāoshì,' }, { zh: '好吗', py: 'hǎo ma' }] },

  { th: 'ฉันคุยเล่นกับเพื่อนในวีแชท', cat: 'mix', note: '在 + ช่องทาง + กริยา (在微信聊天儿 = คุยในวีแชท)',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '跟', py: 'gēn' }, { zh: '朋友', py: 'péngyou' }, { zh: '在', py: 'zài' }, { zh: '微信', py: 'wēixìn' }, { zh: '聊天儿', py: 'liáo tiānr' }] },

  { th: 'ฉันรับอีเมลของเพื่อน', cat: 'de',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '收', py: 'shōu' }, { zh: '朋友', py: 'péngyou' }, { zh: '的', py: 'de' }, { zh: '邮件', py: 'yóujiàn' }] },
]
