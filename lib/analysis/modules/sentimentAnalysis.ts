/**
 * 情感分析模块
 * 基于积极关键词计算简单的情感分数
 */

import { RawMessage } from '@/services/chat-processing/types';

/**
 * 基于积极关键词计算简单的情感分数（0-1范围）
 * 占位符：真正的情感分析会使用NLP
 */
export function computeSentimentScore(messages: RawMessage[]): number {
  // 如果没有消息，返回默认的情感分数
  if (!messages.length) {
    return 0.7;
  }

  const loveWords = ['love','miss','happy','good','thanks','great','sweet','nice','beautiful'];
  let totalWords = 0;
  let loveCount = 0;

  messages.forEach(msg => {
    const words = msg.message
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
    totalWords += words.length;
    words.forEach(w => {
      if (loveWords.includes(w)) loveCount++;
    });
  });

  if (totalWords === 0) return 0.7;
  const ratio = loveCount / totalWords;
  const score = 0.7 + Math.min(0.2, ratio);
  return score;
}
