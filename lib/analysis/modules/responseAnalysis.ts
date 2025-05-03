/**
 * 响应时间分析模块
 * 计算交替发送者之间的平均响应时间
 */

import { RawMessage } from '@/services/chat-processing/types';

/**
 * 计算交替发送者之间的平均响应时间，格式化为"X分钟"或"Y秒"
 */
export function computeResponseTime(messages: RawMessage[]): string {
  // 如果没有消息，返回默认的响应时间
  if (!messages.length) {
    return "0 minutes";
  }

  const responseTimes: number[] = [];
  let lastTime: Date | null = null;
  let lastSender: string | null = null;

  for (const msg of messages) {
    if (!msg.date) continue;

    // 确保日期是有效的 Date 对象
    if (!(msg.date instanceof Date) || isNaN(msg.date.getTime())) {
      continue; // 跳过无效日期
    }

    try {
      if (lastTime && lastSender && lastSender !== msg.sender) {
        const diff = msg.date.getTime() - lastTime.getTime();
        // 只计算1小时内的响应
        if (diff < 3600_000) {
          responseTimes.push(diff / 60000);
        }
      }
      lastTime = msg.date;
      lastSender = msg.sender;
    } catch (error) {
      console.warn('计算响应时间时出错:', error);
    }
  }

  if (!responseTimes.length) return '0 minutes';
  const avg = responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length;
  return avg < 1
    ? `${Math.round(avg * 60)} seconds`
    : `${Math.round(avg)} minutes`;
}
