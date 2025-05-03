import { ProcessResult, RawMessage } from '../../types';
import { validateMessages, sortMessages, removeDuplicates } from '../../validationUtils';

/**
 * Snapchat 消息格式
 */
interface SnapchatMessage {
  /**
   * 发送者名称
   */
  From: string;
  
  /**
   * 接收者名称
   */
  To: string;
  
  /**
   * 消息内容
   */
  Message: string;
  
  /**
   * 创建时间戳（ISO 日期时间字符串）
   */
  Created: string;
  
  /**
   * 媒体类型（例如，'TEXT'，'IMAGE' 等）
   */
  Media_Type: string;
  
  /**
   * 媒体内容（可选）
   */
  Media: string | null;
}

/**
 * Snapchat JSON 导出格式（消息数组）
 */
type SnapchatJson = SnapchatMessage[];

/**
 * 处理 Snapchat JSON 数据
 * @param data Snapchat JSON 数据
 * @returns 处理结果
 */
export function processSnapchatJson(data: any): ProcessResult {
  const warnings: string[] = [];
  const stats = {
    totalMessages: 0,
    validDateMessages: 0,
    filteredSystemMessages: 0,
    filteredMediaMessages: 0
  };

  try {
    // 验证输入
    if (!Array.isArray(data)) {
      return createEmptyResult('invalid_format', 'Snapchat 数据格式无效：预期为数组');
    }

    // 提取消息
    const messages = parseSnapchatMessages(data, stats);
    stats.totalMessages = data.length;
    stats.validDateMessages = messages.filter(m => m.date && !isNaN(m.date.getTime())).length;

    // 排序和去重
    const processedMessages = postprocessMessages(messages);

    // 验证结果
    const validationWarnings = validateMessages(processedMessages);
    warnings.push(...validationWarnings);

    // 提取元数据
    const metadata = getSnapchatMetadata(data);
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
 * 解析 Snapchat 消息
 * @param data Snapchat JSON 数据
 * @param stats 统计信息
 * @returns 消息数组
 */
function parseSnapchatMessages(data: SnapchatJson, stats: any): RawMessage[] {
  return data
    .map(msg => {
      try {
        // 创建 Date 对象
        const dateObj = new Date(msg.Created);
        const timestamp = dateObj.toISOString();
        
        // 处理消息内容
        let text = msg.Message || '';
        if (!text && msg.Media_Type !== 'TEXT' && msg.Media) {
          text = `[${msg.Media_Type}: ${msg.Media}]`;
          stats.filteredMediaMessages++;
        }
        
        return {
          timestamp,
          date: dateObj,
          sender: msg.From,
          message: text
        };
      } catch (error) {
        console.error('处理 Snapchat 消息时出错:', error);
        return null;
      }
    })
    .filter(msg => msg !== null) as RawMessage[];
}

/**
 * 获取 Snapchat 元数据
 * @param data Snapchat JSON 数据
 * @returns 元数据对象
 */
function getSnapchatMetadata(data: SnapchatJson): Record<string, any> {
  // 提取唯一的发送者和接收者
  const participants = new Set<string>();
  data.forEach(msg => {
    if (msg.From) participants.add(msg.From);
    if (msg.To) participants.add(msg.To);
  });
  
  return {
    platform: 'snapchat',
    participants: Array.from(participants),
    messageCount: data.length
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
    logError('Snapchat JSON处理', error);
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
