import { ProcessResult, RawMessage } from '../../types';
import { validateMessages, sortMessages, removeDuplicates } from '../../validationUtils';

/**
 * Telegram 消息格式
 */
interface TelegramMessage {
  /**
   * 消息 ID
   */
  id: number;
  
  /**
   * 消息类型
   */
  type: string;
  
  /**
   * 消息日期（ISO 日期时间字符串）
   */
  date: string;
  
  /**
   * 发送者名称
   */
  from: string;
  
  /**
   * 消息文本（可以是字符串或文本段数组）
   */
  text: string | Array<{ type: string; text: string }>;
  
  /**
   * 媒体类型（如果存在）
   */
  media_type?: string;
  
  /**
   * 媒体文件路径（如果存在）
   */
  file?: string | null;
}

/**
 * Telegram JSON 导出格式
 */
interface TelegramJson {
  /**
   * 聊天名称
   */
  name: string;
  
  /**
   * 聊天类型
   */
  type: string;
  
  /**
   * 聊天 ID
   */
  id: number;
  
  /**
   * 消息数组
   */
  messages: TelegramMessage[];
}

/**
 * 处理 Telegram JSON 数据
 * @param data Telegram JSON 数据
 * @returns 处理结果
 */
export function processTelegramJson(data: any): ProcessResult {
  const warnings: string[] = [];
  const stats = {
    totalMessages: 0,
    validDateMessages: 0,
    filteredSystemMessages: 0,
    filteredMediaMessages: 0
  };

  try {
    // 验证输入
    if (!data || !data.messages || !Array.isArray(data.messages)) {
      return createEmptyResult('invalid_format', 'Telegram 数据格式无效：缺少消息数组');
    }

    // 提取消息
    const messages = parseTelegramMessages(data, stats);
    stats.totalMessages = data.messages.length;
    stats.validDateMessages = messages.filter(m => m.date && !isNaN(m.date.getTime())).length;

    // 排序和去重
    const processedMessages = postprocessMessages(messages);

    // 验证结果
    const validationWarnings = validateMessages(processedMessages);
    warnings.push(...validationWarnings);

    // 提取元数据
    const metadata = getTelegramMetadata(data);
    if (metadata.participants.length < 2) {
      warnings.push('single_participant');
    }

    return {
      messages: processedMessages,
      warnings,
      stats
    };
  } catch (error) {
    return handleProcessingError(error, warnings, stats);
  }
}

/**
 * 解析 Telegram 消息
 * @param data Telegram JSON 数据
 * @param stats 统计信息
 * @returns 消息数组
 */
function parseTelegramMessages(data: TelegramJson, stats: any): RawMessage[] {
  return data.messages
    .map(msg => {
      try {
        // 创建 Date 对象
        const dateObj = new Date(msg.date);
        const timestamp = dateObj.toISOString();
        
        // 处理消息内容
        let content = '';
        if (typeof msg.text === 'string') {
          content = msg.text;
        } else if (Array.isArray(msg.text)) {
          content = msg.text.map(p => p.text).join('');
        }
        
        // 处理媒体
        if (!content && msg.media_type && msg.file) {
          content = `[${msg.media_type}: ${msg.file}]`;
          stats.filteredMediaMessages++;
        }
        
        // 处理系统消息
        if (msg.type === 'service') {
          stats.filteredSystemMessages++;
        }
        
        return {
          timestamp,
          date: dateObj,
          sender: msg.from || 'Unknown',
          message: content
        };
      } catch (error) {
        console.error('处理 Telegram 消息时出错:', error);
        return null;
      }
    })
    .filter(msg => msg !== null) as RawMessage[];
}

/**
 * 获取 Telegram 元数据
 * @param data Telegram JSON 数据
 * @returns 元数据对象
 */
function getTelegramMetadata(data: TelegramJson): Record<string, any> {
  // 提取唯一发送者
  const senders = new Set<string>();
  data.messages.forEach(msg => {
    if (msg.from) {
      senders.add(msg.from);
    }
  });
  
  return {
    platform: 'telegram',
    chatName: data.name,
    chatType: data.type,
    chatId: data.id,
    participants: Array.from(senders),
    messageCount: data.messages.length
  };
}

/**
 * 后处理消息
 * @param messages 消息数组
 * @returns 处理后的消息数组
 */
function postprocessMessages(messages: RawMessage[]): RawMessage[] {
  // 排序
  const sorted = sortMessages(messages);

  // 去重
  return removeDuplicates(sorted);
}

/**
 * 创建空结果
 * @param errorKey 错误消息键
 * @param errorMessage 错误消息
 * @returns 处理结果
 */
function createEmptyResult(errorKey: string, errorMessage: string): ProcessResult {
  // 创建一个带有当前日期的虚拟消息，以防止分析时出错
  const now = new Date();
  const placeholderMessage: RawMessage = {
    timestamp: now.toISOString(),
    sender: 'System',
    message: errorMessage || `No valid messages found: ${errorKey}`,
    date: now
  };

  return {
    messages: [placeholderMessage],
    warnings: [errorKey], // 使用错误键，而不是硬编码消息
    stats: {
      totalMessages: 0,
      validDateMessages: 1, // 我们有一个有效的日期消息（虚拟消息）
      filteredSystemMessages: 0,
      filteredMediaMessages: 0
    }
  };
}

/**
 * 处理错误
 * @param error 错误对象
 * @param warnings 警告数组
 * @param stats 统计信息
 * @returns 处理结果
 */
function handleProcessingError(error: any, warnings: string[], stats: any): ProcessResult {
  // 使用错误处理模块记录错误
  import('@/lib/error-handling').then(({ logError }) => {
    logError('Telegram JSON处理', error);
  });

  // 提供更详细的错误信息
  const errorMessage = error instanceof Error ? error.message : String(error);
  warnings.push(`处理失败: ${errorMessage}`);

  // 创建一个带有当前日期的虚拟消息，以防止分析时出错
  const now = new Date();
  const placeholderMessage: RawMessage = {
    timestamp: now.toISOString(),
    sender: 'System',
    message: `Error processing messages: ${errorMessage}`,
    date: now
  };

  return {
    messages: [placeholderMessage],
    warnings,
    stats: {
      ...stats,
      validDateMessages: 1 // 确保至少有一个有效的日期消息
    }
  };
}
