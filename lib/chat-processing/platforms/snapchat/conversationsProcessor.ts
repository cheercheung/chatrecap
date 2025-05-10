import { ProcessResult, RawMessage } from '../../types';
import { validateMessages, sortMessages, removeDuplicates } from '../../validationUtils';

/**
 * Snapchat 对话格式
 */
interface SnapchatConversationsFormat {
  /**
   * 对话数组
   */
  conversations: Array<{
    id: string;
    participants: string[];
    messages: Array<{
      from: string;
      timestamp: string;
      content: string;
      media?: string;
      type?: string;
    }>;
  }>;
}

/**
 * 处理 Snapchat 对话格式数据
 * @param data Snapchat 对话格式数据
 * @returns 处理结果
 */
export function processSnapchatConversationsFormat(data: SnapchatConversationsFormat): ProcessResult {
  const warnings: string[] = [];
  const stats = {
    totalMessages: 0,
    validDateMessages: 0,
    filteredSystemMessages: 0,
    filteredMediaMessages: 0
  };

  try {
    // 验证输入
    if (!Array.isArray(data.conversations) || data.conversations.length === 0) {
      return createEmptyResult('invalid_conversations_format', 'Snapchat 对话数据格式无效或为空');
    }

    // 提取所有对话中的消息
    let allMessages: RawMessage[] = [];
    let totalMessagesCount = 0;

    data.conversations.forEach(conversation => {
      if (Array.isArray(conversation.messages)) {
        const messages = parseSnapchatConversationMessages(conversation, stats);
        allMessages = [...allMessages, ...messages];
        totalMessagesCount += conversation.messages.length;
      }
    });

    stats.totalMessages = totalMessagesCount;
    stats.validDateMessages = allMessages.filter(m => m.date && !isNaN(m.date.getTime())).length;

    // 排序和去重
    const processedMessages = postprocessMessages(allMessages);

    // 验证结果
    const validationWarnings = validateMessages(processedMessages);
    warnings.push(...validationWarnings);

    // 提取元数据
    const metadata = getSnapchatConversationsMetadata(data);
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
 * 解析 Snapchat 对话消息
 * @param conversation Snapchat 对话
 * @param stats 统计信息
 * @returns 消息数组
 */
function parseSnapchatConversationMessages(conversation: SnapchatConversationsFormat['conversations'][0], stats: any): RawMessage[] {
  return conversation.messages
    .map(msg => {
      try {
        // 创建 Date 对象
        const dateObj = new Date(msg.timestamp);
        const timestamp = dateObj.toISOString();
        
        // 处理消息内容
        let text = msg.content || '';
        if (!text && msg.media) {
          text = `[Media: ${msg.media}]`;
          stats.filteredMediaMessages++;
        }
        
        // 处理消息类型
        if (msg.type && msg.type !== 'text') {
          if (text) text += ' ';
          text += `[Type: ${msg.type}]`;
        }
        
        return {
          timestamp,
          date: dateObj,
          sender: msg.from,
          message: text
        };
      } catch (error) {
        console.error('处理 Snapchat 对话消息时出错:', error);
        return null;
      }
    })
    .filter(msg => msg !== null) as RawMessage[];
}

/**
 * 获取 Snapchat 对话元数据
 * @param data Snapchat 对话数据
 * @returns 元数据对象
 */
function getSnapchatConversationsMetadata(data: SnapchatConversationsFormat): Record<string, any> {
  // 提取所有参与者
  const allParticipants = new Set<string>();
  data.conversations.forEach(conversation => {
    if (Array.isArray(conversation.participants)) {
      conversation.participants.forEach(participant => {
        allParticipants.add(participant);
      });
    }
  });
  
  // 计算消息总数
  let totalMessages = 0;
  data.conversations.forEach(conversation => {
    if (Array.isArray(conversation.messages)) {
      totalMessages += conversation.messages.length;
    }
  });
  
  return {
    platform: 'snapchat',
    participants: Array.from(allParticipants),
    conversationCount: data.conversations.length,
    messageCount: totalMessages
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
    warnings: [errorKey],
    stats: {
      totalMessages: 0,
      validDateMessages: 1,
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
    logError('Snapchat对话格式处理', error);
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
      validDateMessages: 1
    }
  };
}
