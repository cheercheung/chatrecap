import { ProcessResult, RawMessage } from '../../types';
import { validateMessages, sortMessages, removeDuplicates } from '../../validationUtils';

/**
 * Instagram 消息格式
 */
interface InstagramMessage {
  /**
   * 发送者名称
   */
  sender_name: string;

  /**
   * 时间戳（毫秒）
   */
  timestamp_ms: number;

  /**
   * 消息内容（可选）
   */
  content?: string;

  /**
   * 照片（可选）
   */
  photos?: Array<{
    uri: string;
    creation_timestamp: number
  }>;

  /**
   * 分享内容（可选）
   */
  share?: any;

  /**
   * 消息反应（可选）
   */
  reactions?: any[];
}

/**
 * Instagram JSON 导出格式
 */
interface InstagramJson {
  /**
   * 聊天参与者
   */
  participants: Array<{ name: string }>;

  /**
   * 消息数组
   */
  messages: InstagramMessage[];

  /**
   * 聊天标题（可选）
   */
  title?: string;

  /**
   * 线程路径（可选）
   */
  thread_path?: string;
}

/**
 * 处理 Instagram JSON 数据
 * @param data Instagram JSON 数据
 * @returns 处理结果
 */
export function processInstagramJson(data: any): ProcessResult {
  const warnings: string[] = [];
  const stats = {
    totalMessages: 0,
    validDateMessages: 0,
    filteredSystemMessages: 0,
    filteredMediaMessages: 0
  };

  try {
    // 验证输入
    if (!data) {
      return createEmptyResult('invalid_format', 'Instagram 数据格式无效：数据为空');
    }

    // 检查messages是否存在且是数组
    if (!data.messages) {
      console.error('Instagram数据缺少messages字段:', data);
      return createEmptyResult('invalid_format', 'Instagram 数据格式无效：缺少消息数组');
    }

    if (!Array.isArray(data.messages)) {
      console.error('Instagram数据的messages不是数组:', typeof data.messages);
      return createEmptyResult('invalid_format', 'Instagram 数据格式无效：消息数组格式错误');
    }

    // 检查数组是否为空
    if (data.messages.length === 0) {
      return createEmptyResult('empty_messages', 'Instagram 数据格式无效：消息数组为空');
    }

    // 提取消息
    const messages = parseInstagramMessages(data, stats);
    stats.totalMessages = data.messages.length;
    stats.validDateMessages = messages.filter(m => m.date && !isNaN(m.date.getTime())).length;

    // 排序和去重
    const processedMessages = postprocessMessages(messages);

    // 验证结果
    const validationWarnings = validateMessages(processedMessages);
    warnings.push(...validationWarnings);

    // 提取元数据
    const metadata = getInstagramMetadata(data);
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
 * 解析 Instagram 消息
 * @param data Instagram JSON 数据
 * @param stats 统计信息
 * @returns 消息数组
 */
function parseInstagramMessages(data: InstagramJson, stats: any): RawMessage[] {
  return data.messages
    .map(msg => {
      try {
        // 检查必要的字段
        if (!msg.sender_name) {
          console.warn('Instagram消息缺少sender_name字段:', msg);
          return null;
        }

        if (!msg.timestamp_ms) {
          console.warn('Instagram消息缺少timestamp_ms字段:', msg);
          return null;
        }

        // 创建 Date 对象
        const dateObj = new Date(msg.timestamp_ms);

        // 检查日期是否有效
        if (isNaN(dateObj.getTime())) {
          console.warn('Instagram消息的timestamp_ms无效:', msg.timestamp_ms);
          return null;
        }

        const iso = dateObj.toISOString();

        // 处理消息内容
        let text = msg.content || '';
        if (!text) {
          if (msg.photos && msg.photos.length) {
            text = `[Photo x${msg.photos.length}]`;
            if (stats) stats.filteredMediaMessages++;
          } else if (msg.share) {
            text = `[Share]`;
            if (stats) stats.filteredMediaMessages++;
          } else {
            // 如果没有内容，也没有照片或分享，则使用默认文本
            text = '[Empty Message]';
          }
        }

        return {
          timestamp: iso,
          date: dateObj,
          sender: msg.sender_name,
          message: text
        };
      } catch (error) {
        console.error('处理Instagram消息时出错:', error, msg);
        return null;
      }
    })
    .filter(msg => msg !== null) as RawMessage[];
}

/**
 * 获取 Instagram 元数据
 * @param data Instagram JSON 数据
 * @returns 元数据对象
 */
function getInstagramMetadata(data: InstagramJson): Record<string, any> {
  return {
    platform: 'instagram',
    title: data.title || 'Instagram Chat',
    participants: data.participants?.map(p => p.name) || [],
    threadPath: data.thread_path
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
    logError('Instagram JSON处理', error);
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
