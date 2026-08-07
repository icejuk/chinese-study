import type { Sentence } from './types'

/* ประโยคเพิ่มเติมสำหรับคำ HSK 1 ที่หนังสือ 15 บทไม่มี (ดู hsk1.ts) — 27 ประโยค
   เขียนเพราะแบบฝึกเรียงประโยคและฟังแปลดึงข้อจากประโยค ถ้าคำไหนไม่อยู่ในประโยคเลย
   คำนั้นก็ไม่เคยถูกฝึกใน 2 แบบฝึกนั้น (เทสคุมไว้ที่ lib/grade.test.ts)

   ใช้เฉพาะคำที่ผู้เรียนมีในคลัง (283 คำในบท + 45 คำ HSK 1) */
export const sentencesExtra: Sentence[] = [
  { th: 'ฉันชอบดื่มชา ไม่ชอบดื่มกาแฟ', cat: 'bu',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '喜欢', py: 'xǐhuan' }, { zh: '喝', py: 'hē' }, { zh: '茶，', py: 'chá,' }, { zh: '不', py: 'bù' }, { zh: '喜欢', py: 'xǐhuan' }, { zh: '喝', py: 'hē' }, { zh: '咖啡', py: 'kāfēi' }] },

  { th: 'ฉันรักลูกชายและลูกสาวของฉันมาก', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '很', py: 'hěn' }, { zh: '爱', py: 'ài' }, { zh: '我', py: 'wǒ' }, { zh: '的', py: 'de' }, { zh: '儿子', py: 'érzi' }, { zh: '和', py: 'hé' }, { zh: '女儿', py: "nǚ'ér" }] },

  { th: 'ฉันอยากไปเรียนภาษาจีนที่ประเทศจีน', cat: 'life',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '想', py: 'xiǎng' }, { zh: '去', py: 'qù' }, { zh: '中国', py: 'Zhōngguó' }, { zh: '学习', py: 'xuéxí' }, { zh: '汉语', py: 'Hànyǔ' }] },

  { th: 'ตอนนี้กี่โมงแล้ว', cat: 'ask', note: '几点了 = กี่โมงแล้ว · 点 = โมง',
    tokens: [{ zh: '现在', py: 'xiànzài' }, { zh: '几', py: 'jǐ' }, { zh: '点', py: 'diǎn' }, { zh: '了', py: 'le' }] },

  { th: 'ฉันรอมาสิบนาทีแล้ว', cat: 'life', note: '分钟 = นาที (ต่างจาก 分 ที่เป็นหน่วยเงิน)',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '等', py: 'děng' }, { zh: '了', py: 'le' }, { zh: '十', py: 'shí' }, { zh: '分钟', py: 'fēnzhōng' }] },

  { th: 'วันนี้อากาศร้อนมาก เมื่อวานหนาวมาก', cat: 'mix',
    tokens: [{ zh: '今天', py: 'jīntiān' }, { zh: '天气', py: 'tiānqì' }, { zh: '很', py: 'hěn' }, { zh: '热，', py: 'rè,' }, { zh: '昨天', py: 'zuótiān' }, { zh: '很', py: 'hěn' }, { zh: '冷', py: 'lěng' }] },

  { th: 'ตอนบ่ายฝนตกแล้ว ฉันไม่ไปร้านค้า', cat: 'bu',
    tokens: [{ zh: '下午', py: 'xiàwǔ' }, { zh: '下雨', py: 'xiàyǔ' }, { zh: '了，', py: 'le,' }, { zh: '我', py: 'wǒ' }, { zh: '不', py: 'bú' }, { zh: '去', py: 'qù' }, { zh: '商店', py: 'shāngdiàn' }] },

  { th: 'บนโต๊ะมีแก้วหนึ่งใบ', cat: 'mw', note: 'คำนาม + 上 = บน… (桌子上 = บนโต๊ะ)',
    tokens: [{ zh: '桌子', py: 'zhuōzi' }, { zh: '上', py: 'shàng' }, { zh: '有', py: 'yǒu' }, { zh: '一', py: 'yí' }, { zh: '个', py: 'gè' }, { zh: '杯子', py: 'bēizi' }] },

  { th: 'เก้าอี้อยู่ด้านหลังโต๊ะ', cat: 'mix',
    tokens: [{ zh: '椅子', py: 'yǐzi' }, { zh: '在', py: 'zài' }, { zh: '桌子', py: 'zhuōzi' }, { zh: '后面', py: 'hòumiàn' }] },

  { th: 'แมวอยู่ใต้เก้าอี้ หมาอยู่ด้านหน้าโต๊ะ', cat: 'mix', note: '下 = ใต้/ล่าง · 前面 = ด้านหน้า',
    tokens: [{ zh: '猫', py: 'māo' }, { zh: '在', py: 'zài' }, { zh: '椅子', py: 'yǐzi' }, { zh: '下，', py: 'xià,' }, { zh: '狗', py: 'gǒu' }, { zh: '在', py: 'zài' }, { zh: '桌子', py: 'zhuōzi' }, { zh: '前面', py: 'qiánmiàn' }] },

  { th: 'ฉันเห็นมือถือของคุณอยู่บนเก้าอี้', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '看见', py: 'kànjiàn' }, { zh: '你', py: 'nǐ' }, { zh: '的', py: 'de' }, { zh: '手机', py: 'shǒujī' }, { zh: '在', py: 'zài' }, { zh: '椅子', py: 'yǐzi' }, { zh: '上', py: 'shàng' }] },

  { th: 'คอมพิวเตอร์ของฉันใหม่มาก ทีวีเก่ามาก', cat: 'de',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '的', py: 'de' }, { zh: '电脑', py: 'diànnǎo' }, { zh: '很', py: 'hěn' }, { zh: '新，', py: 'xīn,' }, { zh: '电视', py: 'diànshì' }, { zh: '很', py: 'hěn' }, { zh: '旧', py: 'jiù' }] },

  { th: 'ฉันอยากดูหนังจีน', cat: 'life',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '想', py: 'xiǎng' }, { zh: '看', py: 'kàn' }, { zh: '中国', py: 'Zhōngguó' }, { zh: '电影', py: 'diànyǐng' }] },

  { th: 'ของพวกนี้สวยมาก และก็ไม่แพง', cat: 'shop',
    tokens: [{ zh: '这些', py: 'zhèxiē' }, { zh: '东西', py: 'dōngxi' }, { zh: '很', py: 'hěn' }, { zh: '漂亮，', py: 'piàoliang,' }, { zh: '也', py: 'yě' }, { zh: '不', py: 'bú' }, { zh: '贵', py: 'guì' }] },

  { th: 'ฉันจะโทรศัพท์หาหมอ', cat: 'life', note: '给 + คน = หา/ให้ (打电话给… = โทรหา…)',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '要', py: 'yào' }, { zh: '打电话', py: 'dǎ diànhuà' }, { zh: '给', py: 'gěi' }, { zh: '医生', py: 'yīshēng' }] },

  { th: 'ฮัลโหล ขอถามหน่อย ครูอยู่ไหม', cat: 'ask', note: '喂 = ฮัลโหล (ใช้ตอนรับ/โทรศัพท์)',
    tokens: [{ zh: '喂，', py: 'wèi,' }, { zh: '请问', py: 'qǐngwèn' }, { zh: '老师', py: 'lǎoshī' }, { zh: '在', py: 'zài' }, { zh: '吗', py: 'ma' }] },

  { th: 'ฉันพูดภาษาจีนได้ พูดภาษาอังกฤษไม่ได้', cat: 'bu', note: '会 = ทำได้เพราะเรียนมา',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '会', py: 'huì' }, { zh: '说', py: 'shuō' }, { zh: '汉语，', py: 'Hànyǔ,' }, { zh: '不', py: 'bú' }, { zh: '会', py: 'huì' }, { zh: '说', py: 'shuō' }, { zh: '英语', py: 'Yīngyǔ' }] },

  { th: 'คุณมาบ้านฉันได้ไหม', cat: 'ask', note: '能 = สามารถ (มีเงื่อนไข/โอกาสให้ทำได้)',
    tokens: [{ zh: '你', py: 'nǐ' }, { zh: '能', py: 'néng' }, { zh: '来', py: 'lái' }, { zh: '我', py: 'wǒ' }, { zh: '家', py: 'jiā' }, { zh: '吗', py: 'ma' }] },

  { th: 'ลูกชายฉันปีนี้เจ็ดขวบ', cat: 'mix', note: '今年 = ปีนี้ · 岁 = ขวบ/ปี (บอกอายุ)',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '儿子', py: 'érzi' }, { zh: '今年', py: 'jīnnián' }, { zh: '七', py: 'qī' }, { zh: '岁', py: 'suì' }] },

  { th: 'ลูกสาวฉันสามขวบแล้ว', cat: 'mix',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '女儿', py: "nǚ'ér" }, { zh: '三', py: 'sān' }, { zh: '岁', py: 'suì' }, { zh: '了', py: 'le' }] },

  { th: 'ตอนที่ฉันนอนหลับ คุณกำลังดูทีวี', cat: 'mix', note: '…的时候 = ตอนที่…',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '睡觉', py: 'shuìjiào' }, { zh: '的', py: 'de' }, { zh: '时候，', py: 'shíhou,' }, { zh: '你', py: 'nǐ' }, { zh: '在', py: 'zài' }, { zh: '看', py: 'kàn' }, { zh: '电视', py: 'diànshì' }] },

  { th: 'ฉันอยากดื่มน้ำ ไม่อยากดื่มเหล้า', cat: 'bu',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '想', py: 'xiǎng' }, { zh: '喝', py: 'hē' }, { zh: '水，', py: 'shuǐ,' }, { zh: '不', py: 'bù' }, { zh: '想', py: 'xiǎng' }, { zh: '喝', py: 'hē' }, { zh: '酒', py: 'jiǔ' }] },

  { th: 'กับข้าวของร้านอาหารนี้อร่อยมาก', cat: 'de', note: '好吃 = อร่อย (好 + กริยา = ทำสิ่งนั้นแล้วดี)',
    tokens: [{ zh: '这个', py: 'zhège' }, { zh: '饭馆', py: 'fànguǎn' }, { zh: '的', py: 'de' }, { zh: '菜', py: 'cài' }, { zh: '很', py: 'hěn' }, { zh: '好吃', py: 'hǎochī' }] },

  { th: 'ฉันนั่งเครื่องบินไปปักกิ่ง', cat: 'life',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '坐', py: 'zuò' }, { zh: '飞机', py: 'fēijī' }, { zh: '去', py: 'qù' }, { zh: '北京', py: 'Běijīng' }] },

  { th: 'เดือนนี้ฉันยุ่งมาก เดือนหน้าไม่ยุ่ง', cat: 'mix', note: '这个月 = เดือนนี้ · 下个月 = เดือนหน้า',
    tokens: [{ zh: '这个', py: 'zhège' }, { zh: '月', py: 'yuè' }, { zh: '我', py: 'wǒ' }, { zh: '很', py: 'hěn' }, { zh: '忙，', py: 'máng,' }, { zh: '下个', py: 'xiàge' }, { zh: '月', py: 'yuè' }, { zh: '不', py: 'bù' }, { zh: '忙', py: 'máng' }] },

  { th: 'นักเรียนห้องนี้น้อยมาก', cat: 'de',
    tokens: [{ zh: '这个', py: 'zhège' }, { zh: '班', py: 'bān' }, { zh: '的', py: 'de' }, { zh: '学生', py: 'xuésheng' }, { zh: '很', py: 'hěn' }, { zh: '少', py: 'shǎo' }] },

  { th: 'ฉันไม่รู้จักตัวอักษรตัวนี้', cat: 'bu',
    tokens: [{ zh: '我', py: 'wǒ' }, { zh: '不', py: 'bú' }, { zh: '认识', py: 'rènshi' }, { zh: '这个', py: 'zhège' }, { zh: '字', py: 'zì' }] },
]
