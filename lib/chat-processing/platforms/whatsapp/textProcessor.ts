import { ProcessResult, RawEntry, RawMessage } from '../../types';
import { preprocessText, splitAndNormalizeLines } from '@/lib/common/textUtils';
import { validateMessages, sortMessages, removeDuplicates } from '@/lib/chat-processing/validationUtils';
import { mergeWhatsAppMultilineMessages, extractWhatsAppEntries } from '@/lib/chat-processing/extractionUtils';
import { filterWhatsAppNoise } from '@/lib/chat-processing/filterUtils';
import { parseWhatsAppDateTime } from '@/lib/common/dateUtils';

/**
 * 处理 WhatsApp 导出的文本文件
 * @param rawText 原始文本内容
 * @returns 处理结果
 */
export function processWhatsAppText(rawText: string): ProcessResult {
  const warnings: string[] = [];
  const stats = {
    totalMessages: 0,
    validDateMessages: 0,
    filteredSystemMessages: 0,
    filteredMediaMessages: 0
  };

  try {
    // 1. 预处理文本
    const cleanedText = preprocessText(rawText);

    // 2. 提取消息
    const entries = extractWhatsAppMessages(cleanedText);
    stats.totalMessages = entries.length;

    if (entries.length === 0) {
      return createEmptyResult('no_messages');
    }

    // 3. 不再过滤任何消息
    const { filtered } = filterWhatsAppNoise(entries);
    // 不再设置过滤统计，因为我们不再过滤任何消息
    stats.filteredSystemMessages = 0;
    stats.filteredMediaMessages = 0;

    // 4. 解析日期并构建消息对象
    const messages = parseMessageDates(filtered);
    stats.validDateMessages = countValidDateMessages(messages);

    // 5. 排序和去重
    const processedMessages = postprocessMessages(messages);

    // 6. 验证结果
    const validationWarnings = validateMessages(processedMessages);
    warnings.push(...validationWarnings);

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
 * 提取WhatsApp消息
 * @param cleanedText 清理后的文本
 * @returns 提取的消息条目
 */
function extractWhatsAppMessages(cleanedText: string): RawEntry[] {
  // 1. 分割为行
  const lines = splitAndNormalizeLines(cleanedText);

  // 2. 合并多行消息
  const mergedLines = mergeWhatsAppMultilineMessages(lines);

  // 3. 提取结构化数据
  return extractWhatsAppEntries(mergedLines);
}

/**
 * 解析消息日期
 * @param entries 消息条目
 * @returns 带日期的消息对象
 */
function parseMessageDates(entries: RawEntry[]): RawMessage[] {
  const messages: RawMessage[] = [];
  console.log(`开始解析 ${entries?.length || 0} 条消息的日期`);

  // 确保 entries 是一个数组且不为空
  if (!Array.isArray(entries) || entries.length === 0) {
    console.warn('没有消息条目可处理');
    // 创建一个带有当前日期的虚拟消息
    const now = new Date();
    messages.push({
      timestamp: now.toISOString(),
      sender: 'System',
      message: 'No messages found',
      date: now
    });
    return messages;
  }

  let successCount = 0;
  let failureCount = 0;

  for (const entry of entries) {
    // 检查 entry 是否有效
    if (!entry) {
      console.warn('跳过无效的条目');
      failureCount++;
      continue;
    }

    try {
      // 确保所有必要的字段都存在
      const datePart = entry.datePart || '';
      const timePart = entry.timePart || '';
      const sender = entry.sender || 'Unknown';
      const message = entry.message || '';

      // 尝试解析日期时间 - parseWhatsAppDateTime 现在总是返回一个日期（失败时返回当前日期）
      const date = parseWhatsAppDateTime(datePart, timePart);

      // 构建消息对象
      messages.push({
        timestamp: `${datePart}, ${timePart}`,
        sender,
        message,
        date
      });

      successCount++;
    } catch (error) {
      console.error('处理消息时出错:', error);
      failureCount++;
      // 继续处理下一条消息
    }
  }

  console.log(`日期解析完成: 成功 ${successCount} 条, 失败 ${failureCount} 条`);

  // 如果没有成功处理任何消息，添加一个虚拟消息
  if (messages.length === 0) {
    console.warn('没有成功处理任何消息，添加虚拟消息');
    const now = new Date();
    messages.push({
      timestamp: now.toISOString(),
      sender: 'System',
      message: 'Failed to process any messages',
      date: now
    });
  }

  return messages;
}

/**
 * 后处理消息
 * @param messages 消息对象
 * @returns 处理后的消息对象
 */
function postprocessMessages(messages: RawMessage[]): RawMessage[] {
  // 排序
  const sorted = sortMessages(messages);

  // 去重
  return removeDuplicates(sorted);
}

/**
 * 计算有效日期的消息数
 * @param messages 消息对象
 * @returns 有效日期的消息数
 */
function countValidDateMessages(messages: RawMessage[]): number {
  return messages.filter(m => m.date && !isNaN(m.date.getTime())).length;
}

/**
 * 创建空结果
 * @param errorKey 错误消息键
 * @returns 处理结果
 */
function createEmptyResult(errorKey: string): ProcessResult {
  // 创建一个带有当前日期的虚拟消息，以防止分析时出错
  const now = new Date();
  const placeholderMessage: RawMessage = {
    timestamp: now.toISOString(),
    sender: 'System',
    message: `No valid messages found: ${errorKey}`,
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
    logError('WhatsApp文本处理', error);
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
