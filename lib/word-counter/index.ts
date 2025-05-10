/**
 * 字符计数模块
 * 提供简单的字符计数功能，用于计算聊天文件中的字符数
 */
import { RawMessage } from '@/lib/chat-processing/types';

/**
 * 计算文本中的字符数
 * @param text 要计数的文本
 * @param countSpaces 是否计算空格（默认不计算）
 * @returns 字符数量
 */
export function countCharacters(text: string, countSpaces: boolean = false): number {
  if (!text || typeof text !== 'string') return 0;
  
  // 如果不计算空格，则移除所有空白字符
  const processedText = countSpaces ? text : text.replace(/\s+/g, '');
  
  // 返回字符数
  return processedText.length;
}

/**
 * 计算消息数组中的总字符数
 * @param messages 消息数组
 * @param countSpaces 是否计算空格（默认不计算）
 * @returns 总字符数
 */
export function countTotalCharactersInMessages(messages: RawMessage[], countSpaces: boolean = false): number {
  if (!Array.isArray(messages)) return 0;
  
  return messages.reduce((total, msg) => {
    if (msg && typeof msg.message === 'string') {
      return total + countCharacters(msg.message, countSpaces);
    }
    return total;
  }, 0);
}

/**
 * 计算文件内容中的字符数
 * @param content 文件内容（字符串或对象）
 * @param countSpaces 是否计算空格（默认不计算）
 * @returns 字符数
 */
export function countCharactersInContent(content: string | object, countSpaces: boolean = false): number {
  // 如果是字符串，直接计数
  if (typeof content === 'string') {
    return countCharacters(content, countSpaces);
  }
  
  // 如果是对象，尝试提取消息数组
  if (content && typeof content === 'object') {
    // 如果是消息数组
    if (Array.isArray(content)) {
      return countTotalCharactersInMessages(content, countSpaces);
    }
    
    // 如果是包含messages字段的对象
    if ('messages' in content && Array.isArray((content as any).messages)) {
      return countTotalCharactersInMessages((content as any).messages, countSpaces);
    }
  }
  
  return 0;
}
