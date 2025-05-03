import { RawEntry } from '@/utils/chat-processing/types';
import { messagePatterns } from '@/utils/chat-processing/platforms/whatsapp/patterns';

/**
 * 合并 WhatsApp 多行消息
 * @param lines 行数组
 * @returns 合并后的行数组
 */
export function mergeWhatsAppMultilineMessages(lines: string[]): string[] {
  const result: string[] = [];
  let currentMessage: string | null = null;

  // 检查是否是新消息的开始
  const isMessageStart = (line: string): boolean => {
    // 特别处理 [MM/DD/YY, HH:MM:SS] 格式
    if (/^\[\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{1,2}:\d{1,2}\]/.test(line)) {
      return true;
    }

    // 特别处理 [任何内容] 发送者: 消息 格式
    if (/^\[[^\]]+\]\s+[^:]+:\s+/.test(line)) {
      return true;
    }

    for (const pattern of messagePatterns) {
      if (pattern.test(line)) {
        return true;
      }
    }
    return false;
  };

  for (const line of lines) {
    if (isMessageStart(line)) {
      // 如果有当前消息，添加到结果中
      if (currentMessage !== null) {
        result.push(currentMessage);
      }
      // 开始新消息
      currentMessage = line;
    } else if (currentMessage !== null) {
      // 继续当前消息，使用换行符连接，保留原始格式
      currentMessage += '\n' + line;
    }
  }

  // 添加最后一条消息
  if (currentMessage !== null) {
    result.push(currentMessage);
  }

  return result;
}

/**
 * 从行中提取 WhatsApp 消息条目
 * @param lines 行数组
 * @returns 提取的消息条目数组
 */
export function extractWhatsAppEntries(lines: string[]): RawEntry[] {
  const entries: RawEntry[] = [];

  for (const line of lines) {
    for (let i = 0; i < messagePatterns.length; i++) {
      const pattern = messagePatterns[i];
      const match = line.match(pattern);

      if (match) {
        // 根据模式的不同，处理不同的匹配组
        if (i === messagePatterns.length - 1) {
          // 最宽松的格式: 发送者: 消息
          const [, sender, message] = match;

          // 使用当前日期作为默认值
          const now = new Date();
          const datePart = now.toLocaleDateString();
          const timePart = now.toLocaleTimeString();

          entries.push({
            datePart,
            timePart,
            sender: sender.trim(),
            message: message.trim()
          });
        } else if (i === messagePatterns.length - 2) {
          // 更宽松的格式: 任何日期/时间格式，后跟发送者和消息
          const [, dateTimePart, sender, message] = match;

          // 尝试从日期时间部分提取日期和时间
          const parts = dateTimePart.split(/[\s,]+/);
          let datePart = parts[0] || '';
          let timePart = parts[1] || '';

          entries.push({
            datePart: datePart.trim(),
            timePart: timePart.trim(),
            sender: sender.trim(),
            message: message.trim()
          });
        } else {
          // 标准格式: [日期, 时间] 发送者: 消息
          const [, datePart, timePart, sender, message] = match;

          entries.push({
            datePart: datePart.trim(),
            timePart: timePart.trim(),
            sender: sender.trim(),
            message: message.trim()
          });
        }

        break; // 找到匹配的模式后跳出内循环
      }
    }
  }

  return entries;
}
