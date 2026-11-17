/**
 * 2026 考公/教资高频陷阱错题本 + 手机沉浸刷题引擎 (#15 exam-trap-cards)
 * 同构零依赖：同时运行于 Node.js (ESM 单测) 与现代手机/桌面浏览器 (<script type="module">)。
 *
 * 覆盖四大核心失分重灾区（共 40 道真题级精选题，每题含出题人挖坑点 + 5 秒秒杀口诀）：
 * 1. verbal_logic  : 行测言语与判断逻辑高频偷换概念陷阱 (10 题)
 * 2. data_analysis : 资料分析基期/比重/增长率速算易错坑 (10 题)
 * 3. shenlun_format: 申论公文与贯彻执行格式硬伤 (10 题)
 * 4. teacher_law   : 教资综合素质法条数字与核心理念易混点 (10 题)
 */

export const PUBLIC_SPKI_BASE64 = "MCowBQYDK2VwAyEAP5NCVP7CT0tgaGLSGMe4r87SjYRWTM6gN6igBZYSXys=";
export const PRODUCT_SLUG = "exam-trap-cards";
export const FREE_QUESTION_LIMIT = 12;

export const ORDER_CHANNELS = {
  priceText: "¥19.9",
  emailPrimary: "3152557994@qq.com",
  emailSecondary: "a3152557994@gmail.com",
};

/**
 * 艾宾浩斯 6 轮黄金复习间隔（毫秒）：
 * 第 1 轮：5 分钟后立即回看防瞬时遗忘
 * 第 2 轮：1 天后 ｜ 第 3 轮：2 天后 ｜ 第 4 轮：4 天后 ｜ 第 5 轮：7 天后 ｜ 第 6 轮：15 天后
 */
export const EBBINGHAUS_STAGES = [
  { stage: 0, label: "第1轮 · 5分钟闪回", delayMs: 5 * 60 * 1000 },
  { stage: 1, label: "第2轮 · 24小时巩固", delayMs: 24 * 3600 * 1000 },
  { stage: 2, label: "第3轮 · 2天抗遗忘", delayMs: 2 * 24 * 3600 * 1000 },
  { stage: 3, label: "第4轮 · 4天强化", delayMs: 4 * 24 * 3600 * 1000 },
  { stage: 4, label: "第5轮 · 7天定型", delayMs: 7 * 24 * 3600 * 1000 },
  { stage: 5, label: "第6轮 · 15天封神", delayMs: 15 * 24 * 3600 * 1000 },
];

export const MODULES = [
  {
    id: "verbal_logic",
    name: "言语逻辑偷换概念",
    shortName: "言语逻辑",
    badge: "行测必考",
    desc: "专治主客体颠倒、必要条件变充分条件、集合推理逆推误区与意图过度引申",
  },
  {
    id: "data_analysis",
    name: "资料分析速算深坑",
    shortName: "资料速算",
    badge: "提分最快",
    desc: "专治同比环比看串、两期比重与平均数增速公式混用、间隔增速回落坑与千分号陷阱",
  },
  {
    id: "shenlun_format",
    name: "申论公文格式硬伤",
    shortName: "申论公文",
    badge: "白捡格式分",
    desc: "专治倡议书/短评/汇报提纲/讲话稿称谓落款乱加、成文日期不规范与对策空洞",
  },
  {
    id: "teacher_law",
    name: "教资法条数字易混",
    shortName: "教资法条",
    badge: "科一救命",
    desc: "专治未保法/预防犯罪法/教师法/教育法责任主体、申诉期限、丧失vs撤销资格混淆",
  },
];

/**
 * 40 道精编高频陷阱题：
 * 前 12 题（Q01–Q12，四大模块各精选 3 题）开放公网免激活流畅试刷，积累错题本体验后无缝引导解锁全 40 题！
 */
export const QUESTIONS = [
  // ==================== 免费体验区 Q01–Q12（4 大模块 × 3 题） ====================
  {
    id: "Q01",
    module: "verbal_logic",
    examTag: "行测言语 · 细节判断题",
    errorRate: "76%",
    stem: "原文：“基层数字化减负要想真正落地，关键在于打通省市县三级数据壁垒，实现表格‘一次采集、多方复用’。” 下列说法与原文相符的一项是：",
    options: {
      A: "只要打通省市县三级数据壁垒，就能彻底实现基层数字化减负",
      B: "打通三级数据壁垒是基层数字化减负真正落地的必要前提",
      C: "目前基层表格尚无法实现任何跨部门的数据共享复用",
      D: "省市县数据壁垒比考核机制过多更容易导致基层负担加重",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "出题人把原文的“关键在于/前提是”（必要条件：只有A才B）在 A 项偷换成“只要……就……”（充分条件：A→B），还塞进绝对化词“彻底”！C 项“尚无法实现任何”属于无中生有；D 项无关对比（原文根本没提考核机制比较）。",
    mnemonic: "“关键/基础/前提”全是必要词，选项变成“只要……就……”闭眼排；无端比高低（更/最）十有九坑！",
  },
  {
    id: "Q02",
    module: "verbal_logic",
    examTag: "行测判断 · 翻译推理逆否坑",
    errorRate: "74%",
    stem: "某单位规定：“除非通过年度安全生产实操考核，否则不得晋升技术主管。” 由此可以必然推出的是：",
    options: {
      A: "老周通过了年度安全生产实操考核，因此老周一定能晋升技术主管",
      B: "小陈未能晋升技术主管，说明小陈一定没有通过安全生产实操考核",
      C: "小赵成功晋升了技术主管，说明小赵一定通过了年度安全生产实操考核",
      D: "只要未通过安全生产实操考核，连普通技术员岗位也不能聘任",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "“除非 A，否则不 B”标准翻译是“B → A”（晋升技术主管 → 通过实操考核），而不是“A → B”！A 项犯了“肯后推肯前”错误（过了考核未必一定晋升，还可能有其他条件）；B 项犯了“否前推否后”错误；C 项“肯前必肯后”完全严密。",
    mnemonic: "“除非A否则不B”，后推前（B→A）锁死！肯前必肯后，否后必否前；否前肯后全白给！",
  },
  {
    id: "Q03",
    module: "verbal_logic",
    examTag: "行测言语 · 意图判断对策坑",
    errorRate: "71%",
    stem: "微短剧行业爆发式增长的同时，同质化“爽文”扎堆、盗版切片泛滥等问题凸显。经验表明，仅靠事后下架难以根治乱象，建立剧本原创备案激励与平台分账信用挂钩机制已迫在眉睫。作者意在强调：",
    options: {
      A: "微短剧行业正面临同质化与盗版泛滥的双重危机",
      B: "事后下架监管对微短剧行业治理完全失去了作用",
      C: "微短剧未来将逐步取代传统长视频成为主流娱乐方式",
      D: "治理微短剧乱象亟需构建原创激励与分账信用长效机制",
    },
    answer: "D",
    commonWrong: "A",
    trapPoint: "典型“背景+问题+否定旧对策+给出精准新对策”结构！A 项只是转折前后的问题表述（非重点），大批考生求稳误选 A；B 项把“难以根治”偷换成“完全失去作用”；原文尾句已经给出明确对策，意图题首选针对性对策项 D。",
    mnemonic: "文段自带好对策，千万别选纯问题；“难以根治”非“无效”，程度偷换一眼毙！",
  },
  {
    id: "Q04",
    module: "data_analysis",
    examTag: "资料分析 · 间隔增长率回落坑",
    errorRate: "82%",
    stem: "2025年某省锂电池出口额同比增长 30%，增速较上年同期回落 10 个百分点。问 2025 年该省锂电池出口额比 2023 年增长了约多少？",
    options: {
      A: "56%",
      B: "70%",
      C: "82%",
      D: "60%",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "双连环巨坑！第一坑：“增速较上年回落 10 个百分点”，说明 2024 年增速比 2025 年高，即 r₁ = 30% + 10% = 40%（70% 考生顺手减成 20%，算出 20%+30%+6%=56% 掉进 A 项！）；第二坑：间隔增长率 R = r₁ + r₂ + r₁×r₂ = 40% + 30% + 12% = 82%，漏算乘积项会误选 B(70%)！",
    mnemonic: "“回落/减缓”基期要加回，“提高/加快”基期要减去；间隔增速 r₁+r₂ 别忘尾巴加乘积！",
  },
  {
    id: "Q05",
    module: "data_analysis",
    examTag: "资料分析 · 两期比重升降秒杀",
    errorRate: "75%",
    stem: "2025年全国网上零售额 15.5 万亿元，同比增长 8.0%；其中实物商品网上零售额 13.0 万亿元，同比增长 6.0%。2025 年实物商品网上零售额占全国网上零售额的比重较上年：",
    options: {
      A: "上升约 1.55 个百分点",
      B: "下降约 2.00 个百分点",
      C: "下降约 1.55 个百分点",
      D: "上升约 2.00 个百分点",
    },
    answer: "C",
    commonWrong: "B",
    trapPoint: "两步秒杀题根本不用死算！第一步看升降：部分增速 a(6.0%) < 整体增速 b(8.0%)，比重必然下降（排除 A、D）；第二步看幅度：两期比重差绝对值 |(A/B)×(a-b)/(1+a)| 一定小于 |a-b| = |6%-8%| = 2 个百分点（因为 A/B < 1 且 1+a > 1），直接秒选 C！选 B 的考生直接拿 6%-8% 作答了。",
    mnemonic: "小a大b看升降（a>b升，a<b降），差值必小于 |a-b|，十秒不列式直接勾！",
  },
  {
    id: "Q06",
    module: "data_analysis",
    examTag: "资料分析 · 同比vs环比时间坑",
    errorRate: "79%",
    stem: "2025年7月，某市社会消费品零售总额为 378 亿元，同比增长 5.0%，环比增长 0.8%。问 2025 年 6 月该市社会消费品零售总额约为多少亿元？",
    options: {
      A: "360.0 亿元",
      B: "375.0 亿元",
      C: "359.1 亿元",
      D: "381.0 亿元",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "材料给了“2025年7月”，题目问的是紧挨着的上个月“2025年6月”（求环比基期：378 / (1 + 0.8%) ≈ 375.0 亿元）！出题人把最好算的 378 / (1 + 5.0%) = 360.0 亿元放在 A 选项当头号诱饵，专抓不圈时间的快手党！",
    mnemonic: "动笔前先画时间圈：上年同月用同比，紧邻上月用环比；A项整除太顺手，八成时间挖了坑！",
  },
  {
    id: "Q07",
    module: "shenlun_format",
    examTag: "申论贯彻执行 · 短评/时评格式",
    errorRate: "73%",
    stem: "申论题目要求：“请围绕给定资料中‘老字号跨界焕新’现象，为某报社专栏写一篇不少于 500 字的短评。” 关于该文种格式，下列做法正确的是：",
    options: {
      A: "必须顶格写“各位读者朋友：”，并在右下角署报社评论员姓名与日期",
      B: "只需拟定醒目文章标题并分段撰写正文，不写称谓，也不写落款与日期",
      C: "无需拟定标题，但必须在文末右下角写明“××报社 2026年×月×日”",
      D: "必须按照公文红头格式标注发文字号、签发人与抄送单位",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "每年申论阅卷都有大量考生把所有贯彻执行题一律套上“尊敬的各位领导/市民：+ 右下角落款日期”，白白倒扣格式分且浪费格子！短评、时评、新闻稿、编者按属于媒体发表文体，只有【标题 + 正文】，严禁画蛇添足写称谓和书信落款！",
    mnemonic: "短评时评新闻稿，有头（标题）有身（正文）没手脚（无称谓无落款）；乱加书信壳，格子白丢分还扣！",
  },
  {
    id: "Q08",
    module: "shenlun_format",
    examTag: "申论贯彻执行 · 发言稿/讲话稿",
    errorRate: "69%",
    stem: "题目要求：“假如你是街道办工作人员，拟在社区物业治理座谈会上作交流发言，请写一份发言稿。” 其规范外在格式应当是：",
    options: {
      A: "标题 + 顶格称谓（如“各位代表、居民朋友们：”）+ 正文，末尾不写右下角落款和日期",
      B: "标题 + 顶格称谓 + 正文 + 右下角署名“××街道办”及成文日期",
      C: "不写标题与称谓，直接写正文并在结尾加盖公章位置",
      D: "主送机关写“区住建局：”，正文后附联系人及电话",
    },
    answer: "A",
    commonWrong: "B",
    trapPoint: "讲话稿、发言稿、演讲稿是现场口头念出来的稿子（尾段通常以“我的发言完毕，谢谢大家！”自然收束），现场听众已经在台下看着你，绝不需要像书信/通知那样在右下角写署名和日期！B 项是考场最高频画蛇添足错法。",
    mnemonic: "现场开口讲（发言/演讲/讲话稿）：标题称谓加问候，谢谢大家就收口，右下落款千万别留！",
  },
  {
    id: "Q09",
    module: "shenlun_format",
    examTag: "申论公文 · 成文日期硬伤",
    errorRate: "68%",
    stem: "撰写政府部门正式《关于开展冬季消防安全隐患排查的通知》时，右下角成文日期书写完全符合《党政机关公文格式》国家标准的是：",
    options: {
      A: "二〇二六年十一月十七日",
      B: "2026.11.17",
      C: "2026年11月17日",
      D: "2026年11月07日",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "2012版《党政机关公文格式》（GB/T 9704）早就废止了汉字大写日期（A 项是十几年前的旧习惯，至今仍有大量旧网课误导）！标准写法必须使用阿拉伯数字，年、月、日标全，“年”写4位，月、日不编虚位（即不加前导0，排除 D 项“07日”），也严禁偷懒写成小数点 B 项。",
    mnemonic: "公文日期阿拉伯，年月日字不能落；月日绝不补零位，汉字圆圈早作废！",
  },
  {
    id: "Q10",
    module: "teacher_law",
    examTag: "教资科一 · 未保法直播年龄红线",
    errorRate: "81%",
    stem: "根据修订后的《中华人民共和国未成年人保护法》，初中生小林（15周岁）想在某短视频平台注册成为网络直播发布者（主播），平台依法应当：",
    options: {
      A: "在征得小林父母书面同意后为其开通主播账号",
      B: "一律不得为其提供网络直播发布者账号注册服务",
      C: "允许其注册，但限制每日22:00至次日8:00不得开播",
      D: "经小林所在初中学校班主任签字同意后予以注册",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "《未成年人保护法》第76条死卡两个年龄档：① **未满16周岁**：绝对禁止注册网络直播发布者账号（哪怕爸妈签字同意也违法！小林15周岁直接适用本条）；② **年满16周岁未满18周岁**：征得父母或其他监护人同意后方可注册主播账号。80%考生记混成“监护人同意即可”误选 A！",
    mnemonic: "直播当主播，十六是铁锁：未满十六爸妈点头也不行，十六到十八监护同意才放行！",
  },
  {
    id: "Q11",
    module: "teacher_law",
    examTag: "教资科一 · 丧失vs撤销教师资格",
    errorRate: "84%",
    stem: "某公办小学教师郭某因周末驾车疏忽大意发生交通事故，被人民法院以交通肇事罪（过失犯罪）判处有期徒刑一年、缓刑一年。关于郭某的教师资格，依法应当：",
    options: {
      A: "丧失教师资格，终身不得重新取得",
      B: "由教育行政部门撤销教师资格，5年内不得重考",
      C: "不因此丧失教师资格（仅故意犯罪受有期徒刑以上刑罚才丧失）",
      D: "暂停教师资格3年，缓刑期满自动恢复",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "教资综合素质头号法条杀手！《教师法》第14条规定丧失教师资格的两个硬条件是：① 受到**剥夺政治权利**；② **故意犯罪**受到**有期徒刑以上**刑事处罚！郭某所犯交通肇事罪属于**过失犯罪**且未剥夺政治权利，虽然可能受公职处分，但依法**不会丧失教师资格**！选 A 的考生全漏看了“故意”二字！",
    mnemonic: "剥夺政权必丧格，有期徒刑看“故意”；过失判刑不丧格，弄虚骗证撤五年！",
  },
  {
    id: "Q12",
    module: "teacher_law",
    examTag: "教资科一 · 预防未成年人犯罪法",
    errorRate: "77%",
    stem: "14周岁的初中生张某多次实施严重不良行为，父母和所在学校反复管教无效，拟送其进入专门学校接受专门教育。经专门教育指导委员会评估同意后，依法作出送入专门学校决定的主体是：",
    options: {
      A: "当地人民法院少年法庭",
      B: "当地人民检察院会同民政部门",
      C: "教育行政部门会同公安机关",
      D: "所在学校校长办公会会同居委会",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "《预防未成年人犯罪法》第43、44条高频数字与主体坑：专门教育并非刑事审判，不归法院判！申请送专门学校的，经专门教育指导委员会评估同意后，由**教育行政部门会同公安机关**决定！考生一看到“严重不良行为+强制送入”就条件反射选法院 A，逢考必错。",
    mnemonic: "送进专门校，不找法检院；评估委员会点头后，“教（教育局）公（公安局）联手”定乾坤！",
  },

  // ==================== 完整库解锁区 Q13–Q40（共 28 题深度陷阱） ====================
  // --- 模块 1 续：行测言语与判断逻辑 (Q13–Q19，共凑齐 10 题) ---
  {
    id: "Q13",
    module: "verbal_logic",
    examTag: "行测判断 · 集合推理换位陷阱",
    errorRate: "78%",
    stem: "已知：“有的青年科研人员是人工智能伦理委员会成员。” 仅凭这一前提，下列哪项一定为真？",
    options: {
      A: "有的青年科研人员不是人工智能伦理委员会成员",
      B: "有的人工智能伦理委员会成员是青年科研人员",
      C: "所有人工智能伦理委员会成员都是青年科研人员",
      D: "有的人工智能伦理委员会成员不是青年科研人员",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "日常说话里说“有的是”，潜台词好像“有的不是”；但在行测逻辑推理中，“有的”表示“至少有一个，至多全部（1～100%）”！如果全部青年科研人员都是委员，“有的是”依然为真，此时 A 项“有的不是”就是假话！“有的A是B”只能等价换位成“有的B是A”（B项）。",
    mnemonic: "逻辑“有的”含全部，“有的是”推不出“有的非”；“有的A是B”只能正翻“有的B是A”！",
  },
  {
    id: "Q14",
    module: "verbal_logic",
    examTag: "行测言语 · 主客体颠倒陷阱",
    errorRate: "70%",
    stem: "原文：“古籍数字化并非简单扫描成像，而是利用语义识别技术让沉睡的文献主动适配现代学者的跨学科检索习惯。” 对文意理解正确的一项是：",
    options: {
      A: "现代学者应当主动改变检索习惯以适应古籍数字化系统",
      B: "扫描成像是古籍数字化过程中完全多余的落后环节",
      C: "古籍数字化应借助语义技术使文献契合学者的跨学科检索需求",
      D: "跨学科研究只有依靠古籍数字化才能取得突破",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "A 项把原文“让文献主动适配学者习惯”悄悄颠倒成了“让学者改变习惯适应系统”，这是细节题极阴险的**主客体互换**！B 项把“并非简单扫描（不止于此）”曲解成“扫描完全多余”；D 项“只有……才”无中生有必要条件。",
    mnemonic: "看到“适配/服务/围绕/制约”，先盯谁追谁；主宾掉个头，字字眼熟也是坑！",
  },
  {
    id: "Q15",
    module: "verbal_logic",
    examTag: "行测判断 · 削弱论证“他因”力度坑",
    errorRate: "72%",
    stem: "某研究发现：每天饮用两杯黑咖啡的受访者，患2型糖尿病的比例比不喝咖啡者低25%。研究者据此得出结论：黑咖啡中的绿原酸能有效预防2型糖尿病。以下哪项如果为真，最能削弱上述结论？",
    options: {
      A: "绿原酸在深度烘焙咖啡豆中的含量会流失约30%",
      B: "该调查中每天喝两杯黑咖啡的人群普遍保持每周4次有氧运动且极少摄入含糖饮料",
      C: "部分受访者在饮用黑咖啡后出现了短暂心率加快与失眠现象",
      D: "绿茶中也含有一定量的茶多酚，同样具有抗氧化作用",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "结论从“相关性（喝黑咖啡的人患病率低）”强推“因果性（绿原酸防糖尿病）”。A 项只说深度烘焙流失30%，没说剩下的70%不能预防，削弱极弱；C 项副作用与防糖尿病无关；D 项绿茶属无关类比；B 项指出两个组本身存在**根本混杂变量（运动与控糖差异）**，直接拆穿因果倒置/另有他因，力度最强！",
    mnemonic: "对比实验看起点，样本不公（混杂他因）直接掀桌；副作用与别人家，统统无关别瞎抓！",
  },
  {
    id: "Q16",
    module: "verbal_logic",
    examTag: "行测言语 · 并列结构片面概括坑",
    errorRate: "67%",
    stem: "在西北荒漠光伏基地，板上发电输送绿电；板下种植耐旱牧草锁住流沙；板间养殖肉羊实现粪肥还田。曾经寸草不生的戈壁滩，如今走出了一条生态修复与产业增收协同发展的新路。这段文字主要说明：",
    options: {
      A: "板间肉羊养殖成为西北戈壁农户增收的最主要来源",
      B: "耐旱牧草种植有效解决了光伏面板积沙磨损难题",
      C: "西北荒漠通过“板上发电、板下治沙、板间养殖”立体模式实现生态与经济双赢",
      D: "我国光伏发电装机重心正加速向西北荒漠戈壁转移",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "分号“；”隔开“板上、板下、板间”三个并列维度，尾句宏观总结“生态修复+产业增收双赢”。A 项只抓“板间养殖”，B 项只抓“板下牧草”，均犯了**以偏概全**大忌！主旨题遇并列+尾句总结，必须选提取共性或全覆盖项 C。",
    mnemonic: "分号并列三兄弟，单拎老三必片面；最大公约数加尾句，全面概括才是王！",
  },
  {
    id: "Q17",
    module: "verbal_logic",
    examTag: "行测判断 · 前提假设“搭桥法”",
    errorRate: "73%",
    stem: "考古学家在某遗址出土的陶器内壁检测到了高浓度的酒石酸残留，据此断定：该遗址先民在距今8000年前就已经掌握了葡萄或山楂等果实的发酵酿酒技术。上述推理成立必须补充的前提是：",
    options: {
      A: "该遗址周边至今仍生长着大量野生山楂树",
      B: "高浓度酒石酸残留只能通过葡萄或山楂等果实经人工发酵酿酒产生，自然腐烂无法形成该残留特征",
      C: "同期其他地区的遗址中也曾出土过造型相似的小口尖底陶瓶",
      D: "现代光谱化学检测技术对有机残留物的识别准确率超过95%",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "论据只有“陶器有酒石酸残留”，论点跳到了“掌握发酵酿酒技术”。前提假设题必选**在论据核心词（酒石酸残留）与论点核心词（人工发酵酿酒）之间建立唯一必然联系并排除自然形成干扰**的“搭桥项” B！A 项“至今生长”推不出8000年前且未提酿酒，属于弱支持而非必要前提。",
    mnemonic: "论据论点两张皮，前提必找“搭桥句”；去同存异连两端，没它推理就断气！",
  },
  {
    id: "Q18",
    module: "verbal_logic",
    examTag: "行测言语 · 成语望文生义高频坑",
    errorRate: "76%",
    stem: "在行测逻辑填空与成语辨析中，望文生义是高频丢分重灾区。下列各句中，加引号的成语使用完全正确的一项是：",
    options: {
      A: "面对突如其来的暴雨洪峰，堤坝巡查员“首当其冲”，第一个跳入水中封堵管涌，值得全县表彰",
      B: "两家百年药企虽然经营理念“差强人意”，分歧巨大，但仍未放弃谈判",
      C: "这篇行业报告数据详实、逻辑严密，堪称“不刊之论”，具有重要参考价值",
      D: "博物馆展出的微雕作品“巧夺天工”，连天然琥珀内部自然凝结的气泡纹理都如此逼真",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "四个国省考死磕10年的成语坑一次集齐！①“首当其冲”指**最先受到攻击或遭遇灾难**，绝不是“冲在最前面带头干”（A错，76%考生中招！）；②“差强人意”指**大体上还能让人满意**，不是“让人不满意或差距大”（B错）；③“不刊之论”中“刊”指古代削竹简修改，意为**不可磨灭、不可改动的正确言论**，非“不能刊登”（C完全正确！）；④“巧夺天工”只能形容**人工技艺**胜过天然，不能修饰“天然琥珀本身”（D错）。",
    mnemonic: "首当其冲是遭殃，差强人意还算行；不刊之论改不得，巧夺天工必人工！",
  },
  {
    id: "Q19",
    module: "verbal_logic",
    examTag: "行测判断 · 摩根定律否定联言坑",
    errorRate: "69%",
    stem: "某项目评审组长说：“并非此次申报的A方案既具备成本优势又具备技术原创性。” 这一判断等价于：",
    options: {
      A: "A方案既不具备成本优势，也不具备技术原创性",
      B: "如果A方案具备成本优势，那么它一定不具备技术原创性",
      C: "如果A方案不具备成本优势，那么它一定具备技术原创性",
      D: "A方案具备成本优势，但不具备技术原创性",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "摩根定律必考变形！“并非（成本 且 原创）” = “¬成本 或 ¬原创”（至少缺一样，未必两样全缺，所以 A 项错！）。再由“或关系否定一支必肯定另一支（否一推一）”：“¬成本 或 ¬原创” 等价于 “成本 → ¬原创”，完全对应 B 项！",
    mnemonic: "并非（A且B），等于（非A或非B）；“或”变“如果”用否一，肯了A就必非B！",
  },

  // --- 模块 2 续：资料分析速算深坑 (Q20–Q26，共凑齐 10 题) ---
  {
    id: "Q20",
    module: "data_analysis",
    examTag: "资料分析 · 平均数增长率公式混用",
    errorRate: "83%",
    stem: "2025年某市商品房销售额为 2400 亿元，同比增长 15%；商品房销售面积为 1200 万平方米，同比增长 25%。问 2025 年该市商品房平均销售价格较上年同期：",
    options: {
      A: "下降约 8.7%",
      B: "下降 8.0%",
      C: "下降 10.0%",
      D: "上升 8.0%",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "十考九错的公式张冠李戴！两期比重差公式分母是 (1+整体增速)，而**平均数增长率公式是 (a - b) / (1 + b)**，其中 a 是分子（销售额）增速 15%，b 是分母（面积）增速 25%！代入得 (15% - 25%) / (1 + 25%) = -10% / 1.25 = -8.0%！误选 A(-8.7%) 的考生把分母除成了 (1 + 15%)！",
    mnemonic: "平均数增长率 = (分子a - 分母b) ÷ (1 + 分母b)；分母永远跟着分母走，别拿分子1+a凑！",
  },
  {
    id: "Q21",
    module: "data_analysis",
    examTag: "资料分析 · 多几倍 vs 是几倍",
    errorRate: "77%",
    stem: "2025年某智算中心算力规模达 96 EFLOPS，是 2021 年的 4 倍。按规划，2030 年算力规模将比 2025 年“多 3 倍”，届时算力规模是 2021 年的多少倍？",
    options: {
      A: "12 倍",
      B: "15 倍",
      C: "16 倍",
      D: "7 倍",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "“比2025年多3倍” = 增长300% = **是2025年的 (1 + 3) = 4 倍**（绝不是 3 倍！）。而 2025 年本身是 2021 年的 4 倍，故 2030 年是 2021 年的 4 × 4 = 16 倍！A 项 12 倍专坑把“多3倍”直接乘 3 的粗心考生。",
    mnemonic: "“是N倍”直接乘N，“多N倍”必须乘 (N+1)；翻N番是乘 2ⁿ，字眼一差全白算！",
  },
  {
    id: "Q22",
    module: "data_analysis",
    examTag: "资料分析 · 混合增长率正中诱饵坑",
    errorRate: "76%",
    stem: "2025年上半年（1—6月）某港货物吞吐量 10000 万吨，同比增长 9.2%。其中一季度（1—3月）吞吐量 4000 万吨，同比增长 6.0%；二季度（4—6月）吞吐量 6000 万吨，则二季度同比增速约为：",
    options: {
      A: "8.0%",
      B: "11.4%",
      C: "12.4%",
      D: "13.8%",
    },
    answer: "B",
    commonWrong: "C",
    trapPoint: "混合增长率三大铁律：① 整体增速(9.2%)介于两部分(6.0% 与 r₂)之间 → r₂ > 9.2%（排A）；② 若两季度基数相等，正中间才是 9.2% + (9.2% - 6.0%) = 12.4%（出题人故意设 C 项 12.4% 钓鱼！）；③ 二季度量(6000)明显大于一季度(4000)，整体增速必偏向基数大的二季度，故 r₂ 与 9.2% 的距离一定小于 3.2%，即 9.2% < r₂ < 12.4%，唯一符合的是 B(11.4%)！",
    mnemonic: "混合增速居中间，谁的量大往谁偏；算术平均是诱饵，区间卡死秒答案！",
  },
  {
    id: "Q23",
    module: "data_analysis",
    examTag: "资料分析 · 五年规划年均增长量基期坑",
    errorRate: "80%",
    stem: "已知 2020—2025 年某市高新技术产业产值依次为：500、580、650、740、830、950 亿元。按照国家统计局五年规划常规口径，“十四五”时期（2021—2025年）该市高新技术产值年均增长量为：",
    options: {
      A: "92.5 亿元",
      B: "74.0 亿元",
      C: "90.0 亿元",
      D: "112.5 亿元",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "只要题干问“十三五/十四五/十五五时期”且材料给出了上五年规划收官年（2020年）数据，算这5年的总增长量必须**往前推一年以2020年为基期**，年份差除以 5：(950 - 500) ÷ 5 = 90.0 亿元！A 项 (950 - 580) ÷ 4 = 92.5 亿元是未推基期的经典错解。",
    mnemonic: "五年规划共五年，基期往前推一年（2025减2020除以5）；普通区间不外推，末减首除年份差！",
  },
  {
    id: "Q24",
    module: "data_analysis",
    examTag: "资料分析 · 拉动增长vs增长贡献率",
    errorRate: "74%",
    stem: "2024年某集团总营收为 1000 亿元，2025年总营收增至 1200 亿元；其中海外业务营收 2025 年比 2024 年增加了 80 亿元。问 2025 年海外业务拉动集团总营收增长多少个百分点？",
    options: {
      A: "40.0 个百分点",
      B: "6.7 个百分点",
      C: "8.0 个百分点",
      D: "16.7 个百分点",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "两个双胞胎概念极易颠倒：① **拉动增长（百分点）= 部分增长量 ÷ 整体基期量** = 80 ÷ 1000 = 8.0 个百分点（选C）；② **增长贡献率（%）= 部分增长量 ÷ 整体增长量** = 80 ÷ (1200 - 1000) = 40%（A项陷阱！）；B 项 80 ÷ 1200 = 6.7% 则是除成了整体现期量。",
    mnemonic: "拉动增长除“整体基期”，贡献率除“整体增量”；看清百分点还是贡献率，分子同是部分增量！",
  },
  {
    id: "Q25",
    module: "data_analysis",
    examTag: "资料分析 · 千分号(‰)单位视觉盲区",
    errorRate: "72%",
    stem: "2025年某省年末常住人口为 8000 万人，全年人口出生率为 6.5‰，死亡率为 7.0‰。2025年该省全年出生人口约为（忽略年内人口微小波动）：",
    options: {
      A: "520 万人",
      B: "52 万人",
      C: "5.2 万人",
      D: "4 万人",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "人口出生率、死亡率、自然增长率在统计公报中一律用**千分号（‰，即 0.001）**而非百分号（%）！8000 万 × 6.5‰ = 8000 × 0.0065 = 52 万人。考场上高压扫读把 ‰ 看成 % 直接算成 520 万人（A项），连常识都没反应过来（一省一年不可能生520万人）！",
    mnemonic: "出生死亡自然增，右下两个小圆圈（‰千分号）；小数点多挪一位，再拿常识验真伪！",
  },
  {
    id: "Q26",
    module: "data_analysis",
    examTag: "资料分析 · 累计与当月拆解坑",
    errorRate: "68%",
    stem: "统计表显示：2025年6月（当月）某电网售电量为 760 亿千瓦时，1—6月（累计）售电量为 4400 亿千瓦时。则 2025 年 1—5 月该电网月均售电量为：",
    options: {
      A: "733.3 亿千瓦时",
      B: "880.0 亿千瓦时",
      C: "728.0 亿千瓦时",
      D: "606.7 亿千瓦时",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "折线图/表格把“6月当月”和“1—6月累计”并排放置时，问“1—5月月均”，必须先用【1—6月累计(4400) - 6月当月(760) = 3640】剥离出1—5月总量，再除以 5 得 728.0 亿千瓦时！A 项直接拿 4400 ÷ 6 = 733.3，B 项直接拿 4400 ÷ 5 = 880，全掉进累计陷阱。",
    mnemonic: "问前五月先剥六月（累计减当月），算完总量再除五；看清表头“累计/当月”再按笔！",
  },

  // --- 模块 3 续：申论公文与贯彻执行格式硬伤 (Q27–Q33，共凑齐 10 题) ---
  {
    id: "Q27",
    module: "shenlun_format",
    examTag: "申论贯彻执行 · 倡议书落款顺序坑",
    errorRate: "66%",
    stem: "题目要求：“以市文明办名义，就‘文明养犬、共建和谐社区’向全市居民写一份倡议书（400字左右）。” 关于倡议书的完整格式要素及顺序，完全规范的是：",
    options: {
      A: "标题 + 顶格称谓“广大市民朋友们：” + 正文（背景意义+具体倡议条列+呼吁结尾） + 右下角先写署名“××市文明办”、下一行写日期",
      B: "标题 + 空两格写称谓 + 正文 + 右下角先写日期、下一行写署名“××市文明办”",
      C: "无需称谓，直接写正文，末尾附上举报罚款金额标准",
      D: "标题必须写成《关于强制市民文明养犬的倡议通知》",
    },
    answer: "A",
    commonWrong: "B",
    trapPoint: "倡议书属于完整五要素书信体公文：① 标题居中；② 称谓必须**顶格写加冒号**（空两格扣格式分！）；③ 正文“倡议原因+分条具体做法+号召结语”；④ 右下角落款铁律**“上署下期”**（上一行发文单位，下一行阿拉伯数字日期，B项颠倒了且称谓空两格）；另外倡议书是柔性号召，无行政强制罚款权（C、D错）。",
    mnemonic: "书信倡议五件套：标题居中称顶格，正文号召重实操，右下“上署下日期”颠倒必挨刀！",
  },
  {
    id: "Q28",
    module: "shenlun_format",
    examTag: "申论贯彻执行 · 汇报提纲/情况反映",
    errorRate: "71%",
    stem: "题目要求：“假如你是县农机局调研组成员，请根据给定资料整理一份《关于全县农机社会化服务痛点的调研汇报提纲》，供局党组会议讨论（不要求格式）。” 作答时最得高分的做法是：",
    options: {
      A: "尽管题干写了“不要求格式”，仍保险起见写上标题、称谓、问候语和右下角落款日期，占去4行格子",
      B: "不写称谓与落款，直接按“核心现状—突出痛点（分条前置关键词）—对策建议”逻辑层次紧凑展开，把字数全留给踩分词",
      C: "全篇用一段到底的散文抒情笔法呼吁重视农业机械化",
      D: "原封不动整句摘抄材料中某位老农的大白话抱怨充当提纲正文",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "申论题干明确出现**“不要求格式 / 仅写正文 / 写一份提纲要点”**时，阅卷赋分表里格式分为 0 分，全靠要点关键词给分！在 300–400 字严苛限字下，硬塞标题称谓落款会直接挤掉 60–80 字（约 2–3 个核心采分点，倒丢 4–6 分）！",
    mnemonic: "题干写明“不计格式/写提纲”，千万别穿书信衣；省下四行八十字，前置总括词拿满点！",
  },
  {
    id: "Q29",
    module: "shenlun_format",
    examTag: "申论公文 · 公文标题书名号滥用坑",
    errorRate: "65%",
    stem: "某区市场监管局拟转发市局制发的食品安全整治通知，下列公文标题拟制符合规范的一项是：",
    options: {
      A: "《××区市场监管局关于转发〈市市场监管局关于开展校园食品安全专项整治的通知〉的通知》",
      B: "××区市场监管局关于转发市市场监管局开展校园食品安全专项整治的通知",
      C: "××区市场监管局关于转发《开展校园食品安全专项整治的通知》的通知",
      D: "关于《校园食品安全专项整治》的工作通知",
    },
    answer: "B",
    commonWrong: "C",
    trapPoint: "公文标题两大格式铁律：① 公文自身的标题外侧**绝不加书名号《》**（排A）；② 转发通知时，被转发的公文（除法律法规、规章、国家标准外）**一般也不加书名号**，且应合并简化连续重复的“关于……的通知关于……的通知”叠床架屋现象（排C、D），B项简洁规范。",
    mnemonic: "公文标题裸着写，唯有法规戴书名；转发通知去叠词，“关于通知的通知”最招嫌！",
  },
  {
    id: "Q30",
    module: "shenlun_format",
    examTag: "申论提出对策 · 空洞套话零分坑",
    errorRate: "75%",
    stem: "材料反映：“老旧小区加装电梯卡在低层住户担心采光贬值、高层住户分摊比例谈不拢、后续维保资金无着落三个具体死结。” 下列哪条对策在申论阅卷中能拿到实质采分点？",
    options: {
      A: "切实提高政治站位，坚持以人民为中心，大力推进老旧小区加装电梯工作迈上新台阶",
      B: "相关部门要高度重视、加强领导、完善机制、形成合力，营造和谐邻里氛围",
      C: "制定阶梯式出资参考系数并对一楼受损户给予适度补偿；允许提取住宅专项维修资金与公积金并引入电梯养老保险解决维保难",
      D: "对不同意加装电梯的一楼住户采取停水停电及征信拉黑等强制惩戒措施",
    },
    answer: "C",
    commonWrong: "B",
    trapPoint: "申论提出对策题按“针对性 + 可行性 + 可操作性”踩词给分！A、B 两项是考场最泛滥的“万能正确的废话”（没主体、没手段、没解决材料三个死结中的任何一个，阅卷直接判 0–1 分）；D 项严重违法（违反《民法典》且滥用征信，直接扣分）；C 项精准一对一破解“低层补偿+分摊系数+维保资金来源”三大痛点，字字踩分！",
    mnemonic: "万能套话不给分，违法强拆倒扣分；材料痛点一配一，“主体+手段+落点”才得分！",
  },
  {
    id: "Q31",
    module: "shenlun_format",
    examTag: "申论归纳概括 · 俚语口语未转规范词",
    errorRate: "70%",
    stem: "材料中受访村支书说：“以前上面六个部门发六套表，天天蹲屋里填数拍照留痕，地里庄稼旱了都没空管；现在镇里搞了一张总清单，不在单子上的事儿谁来摊派我们都能直接顶回去。” 归纳该镇做法时最精准规范的表述是：",
    options: {
      A: "允许村干部直接顶回上级部门安排的一切工作任务",
      B: "取消基层所有数据统计报表与工作台账记录",
      C: "建立乡镇履职事项准入清单制度，清理多头重复报表与过度留痕，为基层减负松绑",
      D: "要求村支书每天必须下地浇水，不得使用电脑办公",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "归纳概括题严禁把基层受访者的口语大白话（“顶回去”）极端化成“拒绝一切上级工作”（A错），也不能极端化成“取消所有报表”（B错）。必须将口语现象提炼为机关规范上位词——**“建立履职事项准入清单 + 整治多头填表与指尖形式主义”**（C项）。",
    mnemonic: "村民大白话是现象，照抄口语必漏分；去极端化转术语，“清单准入+多头报表”是真金！",
  },
  {
    id: "Q32",
    module: "shenlun_format",
    examTag: "申论贯彻执行 · 编者按核心职能坑",
    errorRate: "72%",
    stem: "某政务内刊拟刊发一组“县域夜间经济精细化管理典型案例”，要求你在卷首撰写一段 250 字以内的“编者按”。下列写法最符合“编者按”文种定位的是：",
    options: {
      A: "顶格写“尊敬的市委领导：”，文末署“内刊编辑部 2026年11月17日”",
      B: "把三个县的全部案例细节流水账重抄一遍，不作任何提炼评价",
      C: "开门见山点明本期案例主题背景，高度提炼共性经验价值，并引导读者结合本地实际借鉴参考（无称谓、无落款）",
      D: "以第一人称“我”讲述自己昨晚逛夜市的美食体验",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "“编者按”是报刊编辑部在文章/案例前加的简短说明与点睛评介，字数短小精悍（通常200–300字），**无称谓、无落款**（排A），核心逻辑是**“交代背景缘由 + 概括核心看点/共性启示 + 表明刊发目的（供参阅借鉴）”**（C项）。",
    mnemonic: "编者按是引路牌，不写称谓不落款；背景看点加启示，“特刊此组供借鉴”稳收官！",
  },
  {
    id: "Q33",
    module: "shenlun_format",
    examTag: "申论贯彻执行 · 公开信vs内部通知对象坑",
    errorRate: "64%",
    stem: "题目要求：“针对近期电信网络诈骗高发态势，代区反诈中心给辖区老年居民写一封防骗公开信。” 下列语言风格与内容设计最契合行文对象的是：",
    options: {
      A: "大量堆砌“强化全链条侦查打击、压实属地网格包保责任制、严肃追责问责”等内部行政指令用语",
      B: "称谓写“全区各派出所、银行网点：”，要求3日内报送排查台账",
      C: "称谓亲切得体（如“尊敬的老年朋友们：”），用通俗易懂语言拆解“保健品返利、冒充公检法”常见套路，给出“不听不信不转账+拨打96110”实操提醒",
      D: "全文引用刑法诈骗罪量刑司法解释条文，不写任何防骗办法",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "贯彻执行题阅卷极看重**“身份定位与受众语体匹配”**！写给辖区老年居民的公开信，如果满篇抄材料里的政府内部工作部署黑话（“压实属地责任、严肃问责”，A项），属于完全搞错行文对象，直接降档判分！必须站在反诈中心对老年群众劝导提醒的角度通俗作答（C项）。",
    mnemonic: "动笔先看写给谁：对内部署讲权责，对外群众讲人话；给大爷写“压实问责”直接垮！",
  },

  // --- 模块 4 续：教资综合素质法条数字与核心理念易混点 (Q34–Q40，共凑齐 10 题) ---
  {
    id: "Q34",
    module: "teacher_law",
    examTag: "教资科一 · 教师申诉管辖与30日坑",
    errorRate: "78%",
    stem: "公办中学教师林某对学校无故克扣其绩效工资及年度考核定为不合格的处理不服，欲依法提出教师申诉。根据《中华人民共和国教师法》，林某应当向哪个机关提出，且该机关应在几日内作出处理？",
    options: {
      A: "向当地劳动争议仲裁委员会申诉，15日内作出处理",
      B: "向主管的县级以上教育行政部门提出申诉，接到申诉的30日内作出处理",
      C: "直接向当地基层人民法院提起行政诉讼，60日内审结",
      D: "向学校教职工代表大会申诉，7日内作出处理",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "《教师法》第39条高频双考点：① 教师对学校侵权或处理不服，受理机关是**教育行政部门**（教育局）；若对教育行政部门侵犯权益不服，则向**同级人民政府或上一级教育行政部门**申诉；② 法定处理期限是**30日内**（而非学生申诉常见的15日，也不是60日行政复议期）！",
    mnemonic: "学校侵权告教局，教局侵权找同府或上教；教师申诉三十天，十五六十全跑偏！",
  },
  {
    id: "Q35",
    module: "teacher_law",
    examTag: "教资科一 · 教育法侵占校舍责任坑",
    errorRate: "80%",
    stem: "个体老板赵某擅自推倒某乡镇小学围墙，强行占用学校操场一角堆放建筑砂石拒不退还。根据《中华人民共和国教育法》第七十二条规定，赵某侵占学校场地的行为依法应当承担：",
    options: {
      A: "刑事责任（一律判处三年以下有期徒刑）",
      B: "民事责任（停止侵害、返还原物、赔偿损失）",
      C: "教育行政处分（记大过并吊销教师资格）",
      D: "仅由村委会口头批评教育，不承担法律责任",
    },
    answer: "B",
    commonWrong: "A",
    trapPoint: "《教育法》第72条两句话拆开考了无数次：① 结伙斗殴、寻衅滋事**扰乱教学秩序**的 → 公安机关给予**治安管理处罚**，构成犯罪的追究刑事责任；② **侵占**学校校舍、场地及其他财产的 → 依法承担**民事责任**！考生看到“强行占用”情绪激动直接选 A 刑事责任，正中出题人下怀！",
    mnemonic: "闹事斗殴归治安（重则入刑），侵占校舍场地赔民事；法条定性看原词，别凭感觉判重刑！",
  },
  {
    id: "Q36",
    module: "teacher_law",
    examTag: "教资科一 · 义务教育法入学与重点班红线",
    errorRate: "71%",
    stem: "某公办初中为提高中考升学率，将初一新生按摸底测试成绩编入“清北火箭班”和“普通平行班”，并将多次违纪的初二学生周某作开除学籍处理。该校的做法违反《义务教育法》几处硬性禁止性规定？",
    options: {
      A: "完全合法，属于学校自主办学管理权范畴",
      B: "仅“开除学籍”违法，设“火箭班”属于因材施教合法行为",
      C: "两处均违法：学校既不得分设重点班和非重点班，也不得开除义务教育阶段学生",
      D: "仅设“火箭班”违法，对多次违纪学生经教育局备案后可以开除",
    },
    answer: "C",
    commonWrong: "B",
    trapPoint: "《义务教育法》第22条规定学校**不得分设重点班和非重点班**（无论改名叫实验班、火箭班、尖子班均违法，绝不能洗白成“因材施教”，排B！）；第27条规定对违纪学生应当批评教育，**不得开除**（义务教育阶段无论谁批都不能开除学籍，排D！）。",
    mnemonic: "义务教育两条铁律：分班不许设重点（换马甲也违法），违纪管教不开除！",
  },
  {
    id: "Q37",
    module: "teacher_law",
    examTag: "教资科一 · 宪法修改提议与通过比例坑",
    errorRate: "76%",
    stem: "根据《中华人民共和国宪法》第六十四条规定，宪法的修改由全国人大常委会或者一定比例以上的全国人大代表提议，并由全国人大以全体代表的一定比例以上多数通过。这两个法定比例依次是：",
    options: {
      A: "五分之一以上提议；全体代表的三分之二以上通过",
      B: "三分之一以上提议；出席代表的三分之二以上通过",
      C: "十分之一以上提议；全体代表的过半数通过",
      D: "四分之一以上提议；全体代表的四分之三以上通过",
    },
    answer: "A",
    commonWrong: "B",
    trapPoint: "两个致命细节坑：① 提议比例是**五分之一（1/5）以上**全国人大代表（或全国人大常委会），不是1/3或1/10；② 通过基数是**“全体代表”**的三分之二（2/3）以上，绝不是“出席代表”的2/3（B项同时挖了“1/3”和“出席代表”两个坑）！而普通法律只需全体代表**过半数**通过。",
    mnemonic: "修宪“五一”来提议，“全体二三”才通过；看清“全体”非“出席”，普通法律过半数！",
  },
  {
    id: "Q38",
    module: "teacher_law",
    examTag: "教资科一 · 刑法修正案(十一)12周岁核准坑",
    errorRate: "79%",
    stem: "根据现行《中华人民共和国刑法》第十七条规定，已满十二周岁不满十四周岁的人，犯故意杀人、故意伤害罪，致人死亡或者以特别残忍手段致人重伤造成严重残疾，情节恶劣，应当负刑事责任的法定核准程序是：",
    options: {
      A: "经省级高级人民法院核准追诉",
      B: "经最高人民法院核准追诉",
      C: "经最高人民检察院核准追诉",
      D: "经公安部会同教育部核准追诉",
    },
    answer: "C",
    commonWrong: "B",
    trapPoint: "注意看词尾是**“核准追诉”**！“追诉（提起公诉）”属于检察机关职权，因此法定机关是**最高人民检察院**（最高检），而不是最高人民法院（死刑复核才是最高法）！考场上十有八九考生顺手选了最高法 B 项。",
    mnemonic: "十二到十四犯重罪，“追诉”职权归检察；认准“最高检察院”，死刑复核才找最高法！",
  },
  {
    id: "Q39",
    module: "teacher_law",
    examTag: "教资科一 · 学生伤害事故学校免责边界",
    errorRate: "68%",
    stem: "周六学校放假闭校期间，初三学生郑某翻越锁闭的校门潜入篮球场打球，起跳落地时不慎扭伤脚踝骨折（学校围墙警示牌齐全、场地设施无缺陷，值班保安发现后第一时间拨打120并通知家长）。根据《学生伤害事故处理办法》，此次事故责任应由：",
    options: {
      A: "学校承担全部赔偿责任，因为事故发生在学校篮球场内",
      B: "学校与郑某监护人各承担50%的公平责任",
      C: "学校行为并无不当，依法不承担事故责任",
      D: "体育老师承担连带赔偿责任",
    },
    answer: "C",
    commonWrong: "B",
    trapPoint: "破除“只要伤在学校就得学校赔”的法盲直觉！《学生伤害事故处理办法》第13条明确规定：在放学后、节假日或者假期等学校工作时间以外，学生**自行滞留学校或者自行到校**发生的事故，若学校场地设施无隐患且管理救护行为并无不当，**学校不承担事故责任**！",
    mnemonic: "学校担责看“过错”，并非进了校门就背锅；假日翻墙自行来，设施合规校免责！",
  },
  {
    id: "Q40",
    module: "teacher_law",
    examTag: "教资科一 · 材料分析题“学生观vs教学观”答非所问坑",
    errorRate: "75%",
    stem: "科目一第30题（14分大题）题干问：“请结合材料，从【学生观】的角度，评析李老师的教育行为。” 下列考生默写的理论踩分点完全扣准【学生观】不跑偏的是：",
    options: {
      A: "教学从“教育者为中心”转向“学习者为中心”、重结论更重过程",
      B: "教师是课程的建设者和开发者、是教育教学的研究者",
      C: "“以人为本”的学生观认为：学生是发展的人、学生是独特的人、学生是具有独立意义的人",
      D: "素质教育是面向全体学生、促进学生全面发展与个性发展的教育",
    },
    answer: "C",
    commonWrong: "A",
    trapPoint: "科一材料大题最惨痛的失分：14分大题背得滚瓜烂熟，结果**张冠李戴背错帽子**，直接被判 0–3 分！务必严格对号入座：① 问**教育观** → 选D（全体/全面/个性/创新实践）；② 问**学生观** → 选C（两独一发：发展/独特/独立意义）；③ 问**教师观** → 选B（学生引导促进/课程建设开发/教学研究/社区开放）；④ 问**教学观** → 才是A（学习者/教会学习/重过程/关注人）！",
    mnemonic: "学生观背“两独一发”（发展独特加独立）；“学习者重过程”是教学观，戴错帽子十四分全泡汤！",
  },
];

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function base64UrlToBytes(b64url) {
  const normalized = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  return base64ToBytes(normalized + "=".repeat(padLen));
}

/**
 * 本地离线 Ed25519 公钥验签（支持 `OPC1.<payload>.<sig>`）。
 */
export async function verifyLicenseToken(token, options = {}) {
  const {
    expectedProduct = PRODUCT_SLUG,
    publicSpkiBase64 = PUBLIC_SPKI_BASE64,
    nowSec = Math.floor(Date.now() / 1000),
  } = options;

  if (typeof token !== "string" || !token.trim()) {
    return { valid: false, reason: "EMPTY_TOKEN", message: "请输入激活码" };
  }

  const parts = token.trim().split(".");
  if (parts.length !== 3 || parts[0] !== "OPC1" || !parts[1] || !parts[2]) {
    return { valid: false, reason: "BAD_FORMAT", message: "激活码格式应为 OPC1.<payload>.<sig>" };
  }

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    return { valid: false, reason: "NO_WEBCRYPTO", message: "当前环境不支持 WebCrypto" };
  }

  try {
    const [, payloadB64, sigB64] = parts;
    const spkiBytes = base64ToBytes(publicSpkiBase64);
    const sigBytes = base64UrlToBytes(sigB64);
    const signedBytes = new TextEncoder().encode(`OPC1.${payloadB64}`);

    const key = await subtle.importKey("spki", spkiBytes, { name: "Ed25519" }, false, ["verify"]);
    const verified = await subtle.verify("Ed25519", key, sigBytes, signedBytes);
    if (!verified) {
      return { valid: false, reason: "BAD_SIGNATURE", message: "Ed25519 数字签名校验未通过" };
    }

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payloadB64)));
    if (expectedProduct && payload.p !== expectedProduct && payload.p !== "*") {
      return {
        valid: false,
        reason: "PRODUCT_MISMATCH",
        message: `该激活码归属产品为 "${payload.p}"，不适用于 "${expectedProduct}"`,
        payload,
      };
    }

    if (payload.exp && Number(payload.exp) > 0 && nowSec > Number(payload.exp)) {
      return { valid: false, reason: "EXPIRED", message: "该激活码已过期", payload };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, reason: "VERIFY_ERROR", message: err?.message || "验签解析失败" };
  }
}

/**
 * 创建初始刷题与错题本学习状态。
 */
export function createInitialStudyState() {
  return {
    attempts: {}, // { [questionId]: { choice, correct, count, wrongCount, updatedAt } }
    mistakes: {}, // { [questionId]: { addedAt, stage, nextReviewAt, lastReviewedAt, note, mastered } }
  };
}

/**
 * 判断某道题在当前解锁状态下是否可刷（前 12 题 Q01–Q12 免费解锁）。
 */
export function isQuestionAccessible(questionIndex, unlocked = false) {
  if (unlocked) return true;
  return questionIndex >= 0 && questionIndex < FREE_QUESTION_LIMIT;
}

/**
 * 获取筛选后的题目列表及每题的解锁标记。
 */
export function getFilteredDeck({ moduleId = "all", unlocked = false } = {}) {
  return QUESTIONS.map((q, globalIndex) => ({
    ...q,
    globalIndex,
    locked: !isQuestionAccessible(globalIndex, unlocked),
  })).filter((q) => moduleId === "all" || q.module === moduleId);
}

/**
 * 判分并自动维护错题本与艾宾浩斯复习计划。
 */
export function submitAnswer(state, { questionId, choice, unlocked = false, nowMs = Date.now() }) {
  const globalIndex = QUESTIONS.findIndex((q) => q.id === questionId);
  if (globalIndex === -1) {
    throw new Error(`Unknown questionId: ${questionId}`);
  }
  if (!isQuestionAccessible(globalIndex, unlocked)) {
    return { allowed: false, reason: "LOCKED_PRO_QUESTION" };
  }

  const question = QUESTIONS[globalIndex];
  const normalizedChoice = String(choice || "").trim().toUpperCase();
  const isCorrect = normalizedChoice === question.answer;
  const hitBait = normalizedChoice === question.commonWrong;

  const prevAttempt = state.attempts[questionId] || { count: 0, wrongCount: 0 };
  const nextAttempts = {
    ...state.attempts,
    [questionId]: {
      choice: normalizedChoice,
      correct: isCorrect,
      hitBait,
      count: prevAttempt.count + 1,
      wrongCount: prevAttempt.wrongCount + (isCorrect ? 0 : 1),
      updatedAt: nowMs,
    },
  };

  const nextMistakes = { ...state.mistakes };
  if (!isCorrect) {
    // 答错自动收录进个人错题本，重置到艾宾浩斯第 1 轮（5 分钟后闪回）
    const existing = nextMistakes[questionId];
    nextMistakes[questionId] = {
      addedAt: existing?.addedAt || nowMs,
      stage: 0,
      nextReviewAt: nowMs + EBBINGHAUS_STAGES[0].delayMs,
      lastReviewedAt: nowMs,
      mastered: false,
    };
  }

  return {
    allowed: true,
    isCorrect,
    hitBait,
    correctAnswer: question.answer,
    trapPoint: question.trapPoint,
    mnemonic: question.mnemonic,
    state: {
      ...state,
      attempts: nextAttempts,
      mistakes: nextMistakes,
    },
  };
}

/**
 * 手动加入或移出艾宾浩斯错题复习本。
 */
export function toggleMistakeBookmark(state, { questionId, nowMs = Date.now() }) {
  const nextMistakes = { ...state.mistakes };
  if (nextMistakes[questionId]) {
    delete nextMistakes[questionId];
  } else {
    nextMistakes[questionId] = {
      addedAt: nowMs,
      stage: 0,
      nextReviewAt: nowMs + EBBINGHAUS_STAGES[0].delayMs,
      lastReviewedAt: nowMs,
      mastered: false,
    };
  }
  return { ...state, mistakes: nextMistakes };
}

/**
 * 艾宾浩斯记忆打卡反馈：
 * - remembered = true  -> 推进到下一轮间隔；完成第 6 轮后标记 mastered = true
 * - remembered = false -> 重新回到第 0 轮（5 分钟后再次闪回巩固）
 */
export function recordEbbinghausReview(state, { questionId, remembered, nowMs = Date.now() }) {
  const entry = state.mistakes[questionId];
  if (!entry) return state;

  let nextStage = 0;
  let mastered = false;
  let nextReviewAt = nowMs + EBBINGHAUS_STAGES[0].delayMs;

  if (remembered) {
    if (entry.stage + 1 >= EBBINGHAUS_STAGES.length) {
      nextStage = EBBINGHAUS_STAGES.length - 1;
      mastered = true;
      nextReviewAt = 0;
    } else {
      nextStage = entry.stage + 1;
      nextReviewAt = nowMs + EBBINGHAUS_STAGES[nextStage].delayMs;
    }
  }

  return {
    ...state,
    mistakes: {
      ...state.mistakes,
      [questionId]: {
        ...entry,
        stage: nextStage,
        mastered,
        lastReviewedAt: nowMs,
        nextReviewAt,
      },
    },
  };
}

/**
 * 获取当前已到点待复习的错题列表（含未到点与已吃透统计）。
 */
export function getEbbinghausQueue(state, nowMs = Date.now()) {
  const due = [];
  const upcoming = [];
  const mastered = [];

  for (const q of QUESTIONS) {
    const m = state.mistakes[q.id];
    if (!m) continue;
    const stageMeta = EBBINGHAUS_STAGES[m.stage] || EBBINGHAUS_STAGES[0];
    const item = {
      question: q,
      ...m,
      stageLabel: m.mastered ? "已彻底吃透" : stageMeta.label,
    };
    if (m.mastered) {
      mastered.push(item);
    } else if (m.nextReviewAt <= nowMs) {
      due.push(item);
    } else {
      upcoming.push(item);
    }
  }

  due.sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  upcoming.sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  return { due, upcoming, mastered, totalMistakes: due.length + upcoming.length + mastered.length };
}

/**
 * 导出个人专属错题本与考前秒杀口诀 Markdown（需已解锁完整版）。
 */
export function exportMistakeReportMarkdown(state, { unlocked = false } = {}) {
  if (!unlocked) {
    return {
      allowed: false,
      reason: "LOCKED_EXPORT",
      markdown: "",
    };
  }

  const mistakeIds = Object.keys(state.mistakes);
  const targetQuestions =
    mistakeIds.length > 0 ? QUESTIONS.filter((q) => Boolean(state.mistakes[q.id])) : QUESTIONS;

  const title =
    mistakeIds.length > 0
      ? `# 2026 考公/教资个人高频陷阱错题本（共收录 ${targetQuestions.length} 题）`
      : `# 2026 考公/教资 40 大高频易错陷阱全库与秒杀口诀背诵表`;

  const lines = [
    title,
    ``,
    `> 导出时间：${new Date().toISOString().slice(0, 10)} ｜ 考场进门前 15 分钟只看【挖坑解析】与【秒杀口诀】！`,
    ``,
  ];

  for (const q of targetQuestions) {
    const attempt = state.attempts[q.id];
    const mistake = state.mistakes[q.id];
    const stageText = mistake
      ? mistake.mastered
        ? "已吃透"
        : EBBINGHAUS_STAGES[mistake.stage]?.label || "待复习"
      : "全库速记";

    lines.push(`## ${q.id} 【${q.examTag}】 考场错选率 ${q.errorRate} · 状态：${stageText}`);
    lines.push(``);
    lines.push(`**题干**：${q.stem}`);
    lines.push(``);
    for (const key of ["A", "B", "C", "D"]) {
      const mark = key === q.answer ? " ✅【正解】" : key === q.commonWrong ? " ⚠️【高频诱饵】" : "";
      lines.push(`- **${key}.** ${q.options[key]}${mark}`);
    }
    if (attempt) {
      lines.push(``);
      lines.push(`- **我的最近作答**：${attempt.choice}（累计作答 ${attempt.count} 次，掉坑 ${attempt.wrongCount} 次）`);
    }
    lines.push(`- **出题人挖坑点**：${q.trapPoint}`);
    lines.push(`- **5秒秒杀口诀**：\`${q.mnemonic}\``);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  return {
    allowed: true,
    count: targetQuestions.length,
    markdown: lines.join("\n"),
  };
}
