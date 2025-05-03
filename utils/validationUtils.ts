import { RawMessage } from '@/utils/chat-processing/types';
import { stringSimilarity } from './textUtils';

/**
 * 验证消息集合
 * @param messages 消息数组
 * @returns 警告消息数组
 */
export function validateMessages(messages: RawMessage[]): string[] {
  const warnings: string[] = [];

  // 检查消息数量
  if (messages.length === 0) {
    warnings.push('没有有效的消息');
    return warnings;
  }

  // 检查参与者数量
  const participants = new Set(messages.map(m => m.sender));
  if (participants.size < 2) {
    warnings.push(`只检测到 ${participants.size} 个参与者，可能不是对话`);
  }

  // 检查日期有效性
  const validDates = messages.filter(m => m.date && !isNaN(m.date.getTime()));
  if (validDates.length < messages.length) {
    warnings.push(`${messages.length - validDates.length} 条消息没有有效的日期`);
  }

  // 检查时间跨度
  if (validDates.length > 0) {
    const dates = validDates.map(m => m.date!.getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const daysDiff = Math.floor((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
      warnings.push(`对话时间跨度只有 ${daysDiff} 天，可能不是完整对话`);
    }
  }

  return warnings;
}

/**
 * 排序消息
 * @param messages 消息数组
 * @returns 排序后的消息数组
 */
export function sortMessages(messages: RawMessage[]): RawMessage[] {
  return [...messages].sort((a, b) => {
    // 如果两者都有有效日期，按日期排序
    if (a.date && b.date && !isNaN(a.date.getTime()) && !isNaN(b.date.getTime())) {
      return a.date.getTime() - b.date.getTime();
    }

    // 如果只有一个有有效日期，将有日期的排在前面
    if (a.date && !isNaN(a.date.getTime())) return -1;
    if (b.date && !isNaN(b.date.getTime())) return 1;

    // 如果都没有有效日期，保持原顺序
    return 0;
  });
}

/**
 * 移除重复消息
 * @param messages 消息数组
 * @returns 去重后的消息数组
 */
export function removeDuplicates(messages: RawMessage[]): RawMessage[] {
  const result: RawMessage[] = [];
  const seen = new Set<string>();

  for (const message of messages) {
    // 创建消息的唯一标识
    const key = `${message.timestamp}|${message.sender}|${message.message}`;

    // 如果已经见过这个消息，跳过
    if (seen.has(key)) continue;

    // 检查是否有相似的消息
    let isDuplicate = false;
    for (const existingKey of seen) {
      const [existingTimestamp, existingSender, existingMessage] = existingKey.split('|');

      // 如果发送者相同，时间戳相似，消息内容相似，认为是重复
      if (
        existingSender === message.sender &&
        Math.abs(new Date(existingTimestamp).getTime() - new Date(message.timestamp).getTime()) < 60000 && // 1分钟内
        stringSimilarity(existingMessage, message.message) > 0.8 // 80%相似度
      ) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.add(key);
      result.push(message);
    }
  }

  return result;
}
