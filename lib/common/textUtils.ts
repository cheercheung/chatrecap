/**
 * 文本处理工具函数
 */

import { removeControlCharacters, cleanText, normalizeLineBreaks, splitToLines } from '@/utils/textUtils';

// 重新导出基本文本处理函数
export { removeControlCharacters, cleanText, normalizeLineBreaks, splitToLines };

/**
 * 预处理文本
 * @param text 输入文本
 * @returns 预处理后的文本
 */
export function preprocessText(text: string): string {
  // 清理文本
  const cleaned = cleanText(text);
  // 标准化换行符
  return normalizeLineBreaks(cleaned);
}

/**
 * 分割并标准化行
 * @param text 输入文本
 * @returns 行数组
 */
export function splitAndNormalizeLines(text: string): string[] {
  return splitToLines(text, true);
}
