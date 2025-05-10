import { ProcessResult, RawMessage } from '../../types';
import { validateMessages, sortMessages, removeDuplicates } from '../../validationUtils';

/**
 * Discord 频道格式
 */
interface DiscordChannelFormat {
  /**
   * 频道信息
   */
  channel: {
    id: string;
    type: number;
    name: string;
  };
  
  /**
   * 消息数组
   */
  messages: Array<{
    id: string;
    type: number;
    timestamp: string;
    author: {
      id: string;
      name: string;
    };
    content: string;
    attachments?: any[];
    embeds?: any[];
    reactions?: any[];
  }>;
}

/**
 * 处理 Discord 频道格式数据
 * @param data Discord 频道格式数据
 * @returns 处理结果
 */
export function processDiscordChannelFormat(data: DiscordChannelFormat): ProcessResult {
  const warnings: string[] = [];
  const stats = {
    totalMessages: 0,
    validDateMessages: 0,
    filteredSystemMessages: 0,
    filteredMediaMessages: 0
  };

  try {
    // 验证输入
    if (!data.channel || !Array.isArray(data.messages)) {
      return createEmptyResult('invalid_channel_format', 'Discord 频道数据格式无效');
    }

    // 提取消息
    const messages = parseDiscordChannelMessages(data, stats);
    stats.totalMessages = data.messages.length;
    stats.validDateMessages = messages.filter(m => m.date && !isNaN(m.date.getTime())).length;

    // 排序和去重
    const processedMessages = postprocessMessages(messages);

    // 验证结果
    const validationWarnings = validateMessages(processedMessages);
    warnings.push(...validationWarnings);

    // 提取元数据
    const metadata = getDiscordChannelMetadata(data);
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
 * 解析 Discord 频道消息
 * @param data Discord 频道数据
 * @param stats 统计信息
 * @returns 消息数组
 */
function parseDiscordChannelMessages(data: DiscordChannelFormat, stats: any): RawMessage[] {
  return data.messages
    .map(msg => {
      try {
        // 创建 Date 对象
        const dateObj = new Date(msg.timestamp);
        const timestamp = dateObj.toISOString();
        
        // 处理消息内容
        let text = msg.content || '';
        if (!text && msg.attachments && msg.attachments.length) {
          text = `[Attachment x${msg.attachments.length}]`;
          stats.filteredMediaMessages++;
        }
        
        // 处理嵌入内容
        if (msg.embeds && msg.embeds.length) {
          if (text) text += ' ';
          text += `[Embed x${msg.embeds.length}]`;
        }
        
        // 处理反应
        if (msg.reactions && msg.reactions.length) {
          const reactionsText = msg.reactions
            .map(r => `${r.emoji || '👍'}(${r.count || 1})`)
            .join(' ');
          if (text) text += ' ';
          text += `[Reactions: ${reactionsText}]`;
        }
        
        return {
          timestamp,
          date: dateObj,
          sender: msg.author?.name || 'Unknown',
          message: text
        };
      } catch (error) {
        console.error('处理 Discord 频道消息时出错:', error);
        return null;
      }
    })
    .filter(msg => msg !== null) as RawMessage[];
}

/**
 * 获取 Discord 频道元数据
 * @param data Discord 频道数据
 * @returns 元数据对象
 */
function getDiscordChannelMetadata(data: DiscordChannelFormat): Record<string, any> {
  // 提取唯一作者
  const authors = new Set<string>();
  data.messages.forEach(msg => {
    if (msg.author && msg.author.name) {
      authors.add(msg.author.name);
    }
  });
  
  return {
    platform: 'discord',
    channelName: data.channel.name,
    channelId: data.channel.id,
    channelType: data.channel.type,
    participants: Array.from(authors),
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
    logError('Discord频道格式处理', error);
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
