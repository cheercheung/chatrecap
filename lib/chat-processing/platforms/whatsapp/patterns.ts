/**
 * WhatsApp 相关的模式定义
 */

/**
 * 多语言支持的噪声模式
 */
export const noisePatterns = {
  // 媒体消息模式
  media: [
    '<Media omitted>',
    '<媒体文件已省略>',
    '<Media weggelaten>',
    '<Medien ausgeschlossen>',
    '<Fichier multimédia exclu>',
    '<Archivo multimedia omitido>',
    '<Mídia omitida>',
    '<メディアは省略されました>',
    '<미디어 파일 생략됨>',
    '< 媒体文件省略 >',
    'image omitted',
    'video omitted',
    'audio omitted',
    'sticker omitted',
    'GIF omitted',
    'document omitted'
  ],

  // 系统消息模式
  system: [
    'Messages and calls are end-to-end encrypted',
    '消息和通话已获得端对端加密',
    'created group',
    '创建了群组',
    'added',
    '已添加',
    'left',
    '离开了',
    'removed',
    '被移除',
    'changed the subject',
    '更改了主题',
    'changed this group\'s icon',
    '更改了群组图标',
    'changed the group description',
    '更改了群组描述',
    'changed their phone number',
    '更改了他们的电话号码',
    'Messages to this chat and calls are now secured with end-to-end encryption',
    '发送到此聊天的消息和通话现已使用端到端加密方式保护',
    'You created group',
    '您创建了群组',
    'You added',
    '您添加了',
    'You removed',
    '您移除了',
    'You changed the subject',
    '您更改了主题',
    'You changed this group\'s icon',
    '您更改了群组图标',
    'You changed the group description',
    '您更改了群组描述',
    'Security code changed',
    '安全代码已更改',
    'This chat is with a business account',
    '此聊天对象为商业帐号',
    'Your security code with',
    '您与以下联系人的安全代码',
    'changed',
    '已更改',
    'Waiting for this message',
    '正在等待此消息',
    'This message was deleted',
    '此消息已删除',
    'You deleted this message',
    '您删除了此消息',
    'Missed voice call',
    '未接语音通话',
    'Missed video call',
    '未接视频通话',
    'Missed call',
    '未接来电',
    'Calling',
    '正在通话',
    'Ringing',
    '响铃中',
    'Call ended',
    '通话已结束',
    'Call declined',
    '通话已拒绝',
    'Joined using this group\'s invite link',
    '使用此群组的邀请链接加入',
    'joined using this group\'s invite link',
    '使用此群组的邀请链接加入',
    'Your messages are end-to-end encrypted',
    '您的消息已获得端对端加密'
  ],

  // 链接和其他噪声
  links: [
    'https://',
    'http://',
    'www.'
  ]
};

// 合并所有噪声模式为一个数组，用于快速检查
export const allPatterns = [
  ...noisePatterns.media,
  ...noisePatterns.system,
  ...noisePatterns.links
];

/**
 * 支持多种消息格式的正则表达式
 */
export const messagePatterns = [
  // [月份名 日期 年份 时间] 格式 - 匹配使用破折号而不是冒号的格式 [april 2nd 2025 1:20pm]Mom-❤️I have nothing...
  /^\[([a-zA-Z]+\s+\d+(?:st|nd|rd|th)?\s+\d{4}\s+\d{1,2}:\d{1,2}(?:am|pm|AM|PM)?)\]([^-]+)-(.+)$/,

  // [月份名 日期 年份 时间] 格式 - 匹配 [april 2nd 2025 1:20pm]Mom-❤️: 消息
  /^\[([a-zA-Z]+\s+\d+(?:st|nd|rd|th)?\s+\d{4}\s+\d{1,2}:\d{1,2}(?:am|pm|AM|PM)?)\](.*?)-([^:]*?):\s*(.+)$/,

  // [月份名 日期 年份 时间] 格式 - 匹配 [April 2nd 2025 1:25pm]Kylie-👀: 消息
  /^\[([a-zA-Z]+\s+\d+(?:st|nd|rd|th)?\s+\d{4}\s+\d{1,2}:\d{1,2}(?:am|pm|AM|PM)?)\]([^-]*?)-([^:]*?):\s*(.+)$/,

  // [月份名 日期 年份 时间] 格式 - 无表情符号版本
  /^\[([a-zA-Z]+\s+\d+(?:st|nd|rd|th)?\s+\d{4}\s+\d{1,2}:\d{1,2}(?:am|pm|AM|PM)?)\]([^:]+):\s*(.+)$/,

  // 简化版 [月份名 日期 年份 时间] 格式 - 匹配使用破折号而不是冒号的格式
  /^\[(april|April|may|May|june|June|july|July|august|August|september|September|october|October|november|November|december|December|january|January|february|February|march|March)[^\]]+\]([^-]+)-(.+)$/,

  // [日期/月/年, 时间:分钟:秒 p.m.] 发送者: 消息 - 匹配西班牙语格式 [15/02/25, 5:14:58 p.m.]
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2}(?::\d{1,2})?\s*(?:a\.m\.|p\.m\.|A\.M\.|P\.M\.))\]\s+([^:]+):\s+(.+)$/,

  // [日期/月/年, 时间:分钟:秒 p.m.] 发送者-消息 - 匹配西班牙语格式带破折号 [13/03/25, 11:38:24 p.m.] Amor Nuevo: Terminando de editar el video
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2}(?::\d{1,2})?\s*(?:a\.m\.|p\.m\.|A\.M\.|P\.M\.))\]\s+([^-]+)-(.+)$/,

  // [日期/月/年, 时间:分钟:秒] 发送者: 消息 - 匹配 [12/3/24, 21:24:47] Tamara: Messages and calls are end-to-end encrypted.
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2}:\d{1,2})\]\s+([^:]+):\s+(.+)$/,

  // [日期/月/年, 时间:分钟:秒] 发送者-消息 - 匹配带破折号的格式
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2}:\d{1,2})\]\s+([^-]+)-(.+)$/,

  // [日期/月/年, 时间:分钟] 发送者: 消息 - 匹配没有秒的格式
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2})\]\s+([^:]+):\s+(.+)$/,

  // [日期/月/年, 时间:分钟] 发送者-消息 - 匹配没有秒的破折号格式
  /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{1,2})\]\s+([^-]+)-(.+)$/,

  // [日期, 时间] 发送者: 消息 - 更宽松的版本
  /^\[([^\]]+),\s*([^\]]+)\]\s+([^:]+):\s+(.+)$/,

  // [日期, 时间] 发送者-消息 - 更宽松的破折号版本
  /^\[([^\]]+),\s*([^\]]+)\]\s+([^-]+)-(.+)$/,

  // (日期, 时间) 发送者: 消息
  /^\(([^,\)]+),\s*([^\)]+)\)\s+([^:]+):\s+(.+)$/,

  // (日期, 时间) 发送者-消息
  /^\(([^,\)]+),\s*([^\)]+)\)\s+([^-]+)-(.+)$/,

  // 日期, 时间 - 发送者: 消息
  /^([^,]+),\s*([^-]+)\s*-\s*([^:]+):\s+(.+)$/,

  // 日期, 时间 - 发送者-消息
  /^([^,]+),\s*([^-]+)\s*-\s*([^-]+)-(.+)$/,

  // 日期 时间 - 发送者: 消息
  /^(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP][mM])?)\s*-\s*([^:]+):\s+(.+)$/,

  // 日期 时间 - 发送者-消息
  /^(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP][mM])?)\s*-\s*([^-]+)-(.+)$/,

  // 日期 时间 发送者: 消息 (无分隔符)
  /^(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP][mM])?)\s+([^:]+):\s+(.+)$/,

  // 日期 时间 发送者-消息 (无分隔符)
  /^(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP][mM])?)\s+([^-]+)-(.+)$/,

  // 中文格式: [YYYY年MM月DD日 HH:MM] 发送者: 消息
  /^\[(\d{4}年\d{1,2}月\d{1,2}日)\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s+([^:]+):\s+(.+)$/,

  // 更宽松的格式: 任何日期/时间格式，后跟发送者和消息
  /^(.*?)\s+-\s+([^:]+):\s+(.+)$/,

  // 更宽松的格式: 任何日期/时间格式，后跟发送者和破折号消息
  /^(.*?)\s+-\s+([^-]+)-(.+)$/,

  // 最宽松的格式: 发送者: 消息
  /^([^:]+):\s+(.+)$/,

  // 最宽松的格式: 发送者-消息
  /^([^-]+)-(.+)$/
];

/**
 * 日期格式候选项
 */
export const dateFormatCandidates = [
  // 标准格式
  'YYYY/MM/DD, HH:mm:ss',
  'YYYY/MM/DD, HH:mm',
  'YYYY-MM-DD, HH:mm:ss',
  'YYYY-MM-DD, HH:mm',
  'DD/MM/YYYY, HH:mm:ss',
  'DD/MM/YYYY, HH:mm',
  'MM/DD/YYYY, HH:mm:ss',
  'MM/DD/YYYY, HH:mm',

  // 两位年份格式
  'DD/MM/YY, HH:mm:ss',
  'DD/MM/YY, HH:mm',
  'MM/DD/YY, HH:mm:ss',
  'MM/DD/YY, HH:mm',
  'YY/MM/DD, HH:mm:ss',
  'YY/MM/DD, HH:mm',

  // 带AM/PM的格式
  'MM/DD/YYYY, hh:mm:ss A',
  'MM/DD/YYYY, hh:mm A',
  'DD/MM/YYYY, hh:mm:ss A',
  'DD/MM/YYYY, hh:mm A',
  'YYYY/MM/DD, hh:mm:ss A',
  'YYYY/MM/DD, hh:mm A',

  // 点分隔的日期格式
  'DD.MM.YYYY, HH:mm:ss',
  'DD.MM.YYYY, HH:mm',
  'MM.DD.YYYY, HH:mm:ss',
  'MM.DD.YYYY, HH:mm',
  'YYYY.MM.DD, HH:mm:ss',
  'YYYY.MM.DD, HH:mm',

  // 中文日期格式
  'YYYY年MM月DD日 HH:mm:ss',
  'YYYY年MM月DD日 HH:mm'
];
