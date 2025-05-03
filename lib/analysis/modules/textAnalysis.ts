/**
 * 文本分析模块
 * 计算基于文本的分析：最常用的词和表情符号，总体和每个发送者
 */
import { RawMessage } from '@/lib/chat-processing/types';
import { AnalysisData } from '@/types/analysis';
import { countFrequency, getTopItems, formatWordItems, formatEmojiItems } from '../index';

// 常见表情符号列表
const commonEmojis = [
  "❤️","😊","😘","😍","🥰","👍","😂","🙏","💕","😁",
  "🤔","💪","🙌","👌","🎉","🔥","💯","👏","😅","😎",
  "😢","😭","🤗","😴","🤣","😇","😬","😜","😱","😳"
];

/**
 * 计算基于文本的分析：最常用的词和表情符号，总体和每个发送者
 */
export function computeTextAnalysis(messages: RawMessage[]): AnalysisData['textAnalysis'] {
  // 如果没有消息，返回默认的文本分析数据
  if (!messages.length) {
    return {
      commonWords: [],
      sentimentScore: 0,
      topEmojis: [],
      wordCount: 0,
      sender1: {
        name: "User 1",
        commonWords: [],
        topEmojis: []
      },
      sender2: {
        name: "User 2",
        commonWords: [],
        topEmojis: []
      }
    };
  }

  // 收集所有单词和表情符号
  const allWords: string[] = [];
  const allEmojis: string[] = [];
  // 映射发送者 -> 单词和表情符号
  const senderWordsMap = new Map<string, string[]>();
  const senderEmojisMap = new Map<string, string[]>();

  messages.forEach(msg => {
    // 表情符号提取
    const emojisInMsg: string[] = [];
    commonEmojis.forEach(emoji => {
      const count = (msg.message.match(new RegExp(emoji, 'g')) || []).length;
      for (let i = 0; i < count; i++) {
        emojisInMsg.push(emoji);
      }
    });
    allEmojis.push(...emojisInMsg);

    // 单词提取（简单分割，过滤长度 > 2）
    const wordsInMsg = msg.message
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w: string) => w.length > 2);
    allWords.push(...wordsInMsg);

    // 添加到发送者映射
    const wArr = senderWordsMap.get(msg.sender) || [];
    senderWordsMap.set(msg.sender, wArr.concat(wordsInMsg));
    const eArr = senderEmojisMap.get(msg.sender) || [];
    senderEmojisMap.set(msg.sender, eArr.concat(emojisInMsg));
  });

  // 总体最常用词和表情符号
  const wordFreq = countFrequency(allWords);
  const topWords = formatWordItems(getTopItems(wordFreq, 50));
  const emojiFreq = countFrequency(allEmojis);
  const topEmojis = formatEmojiItems(getTopItems(emojiFreq, 10));

  // 识别两个发送者（映射中的前两个）
  const senders = Array.from(senderWordsMap.keys());
  const sender1 = senders[0];
  const sender2 = senders[1];

  // 每个发送者的统计数据
  const sender1Words = senderWordsMap.get(sender1) || [];
  const sender2Words = senderWordsMap.get(sender2) || [];
  const sender1Emojis = senderEmojisMap.get(sender1) || [];
  const sender2Emojis = senderEmojisMap.get(sender2) || [];
  const sender1CommonWords = formatWordItems(getTopItems(countFrequency(sender1Words), 10));
  const sender2CommonWords = formatWordItems(getTopItems(countFrequency(sender2Words), 10));
  const sender1TopEmojis = formatEmojiItems(getTopItems(countFrequency(sender1Emojis), 10));
  const sender2TopEmojis = formatEmojiItems(getTopItems(countFrequency(sender2Emojis), 10));

  return {
    commonWords: topWords,
    sentimentScore: 0, // 将由sentimentAnalysis填充
    topEmojis,
    wordCount: allWords.length,
    sender1: { name: sender1, commonWords: sender1CommonWords, topEmojis: sender1TopEmojis },
    sender2: { name: sender2, commonWords: sender2CommonWords, topEmojis: sender2TopEmojis }
  };
}
