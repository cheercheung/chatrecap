/**
 * 原始消息条目，从文本中提取的初步结构
 */
export interface RawEntry {
  /** 日期部分字符串 */
  datePart: string;
  /** 时间部分字符串 */
  timePart: string;
  /** 发送者名称 */
  sender: string;
  /** 消息内容 */
  message: string;
}

/**
 * 处理后的消息对象
 */
export interface RawMessage {
  /** 原始时间戳字符串 */
  timestamp: string;
  /** 发送者名称 */
  sender: string;
  /** 消息内容 */
  message: string;
  /** 解析后的日期对象 */
  date?: Date;
}

/**
 * 支持的平台类型
 */
export type PlatformType = 'whatsapp' | 'instagram' | 'discord' | 'telegram' | 'snapchat' | 'auto';

/**
 * 处理结果
 */
export interface ProcessResult {
  /** 处理后的消息数组 */
  messages: RawMessage[];
  /** 处理过程中的警告 */
  warnings: string[];
  /** 处理的统计信息 */
  stats: {
    /** 总消息数 */
    totalMessages: number;
    /** 成功解析日期的消息数 */
    validDateMessages: number;
    /** 过滤掉的系统消息数 */
    filteredSystemMessages: number;
    /** 过滤掉的媒体消息数 */
    filteredMediaMessages: number;
  };
}

/**
 * 聊天格式解析器接口
 */
export interface ChatFormatParser {
  /** 解析器名称 */
  name: string;
  /** 测试行是否匹配该格式 */
  test: (line: string) => boolean;
  /** 解析行为结构化数据 */
  parse: (line: string) => RawEntry | null;
  /** 转换为标准格式（可选） */
  toStandardFormat?: (entry: RawEntry) => RawEntry;
  /** 特殊日期解析（可选） */
  parseDate?: (datePart: string, timePart: string) => Date | undefined;
}
