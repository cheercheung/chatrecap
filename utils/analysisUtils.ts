import { AnalysisData } from "@/types/analysis";

/**
 * 常见无意义词列表
 * 包含英文中常见的连接词、冠词等
 */
export const commonExclusionWords = [
  'the', 'and', 'to', 'a', 'of', 'is', 'in', 'it', 'that', 'for',
  'you', 'was', 'on', 'are', 'with', 'as', 'I', 'his', 'they',
  'at', 'be', 'this', 'have', 'from', 'or', 'had', 'by', 'but',
  'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said',
  'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their',
  'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them',
  'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into',
  'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see', 'number',
  'no', 'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been',
  'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did',
  'get', 'come', 'made', 'may', 'part', 'over', 'new', 'sound', 'take',
  'only', 'little', 'work', 'know', 'place', 'year', 'live', 'me', 'back',
  'give', 'most', 'very', 'after', 'thing', 'our', 'just', 'name', 'good',
  'sentence', 'man', 'think', 'say', 'great', 'where', 'help', 'through',
  'much', 'before', 'line', 'right', 'too', 'mean', 'old', 'any', 'same',
  'tell', 'boy', 'follow', 'came', 'want', 'show', 'also', 'around', 'form',
  'three', 'small', 'set', 'put', 'end', 'does', 'another', 'well', 'large',
  'must', 'big', 'even', 'such', 'because', 'turn', 'here', 'why', 'ask',
  'went', 'men', 'read', 'need', 'land', 'different', 'home', 'us', 'move',
  'try', 'kind', 'hand', 'picture', 'again', 'change', 'off', 'play', 'spell',
  'air', 'away', 'animal', 'house', 'point', 'page', 'letter', 'mother', 'answer',
  'found', 'study', 'still', 'learn', 'should', 'America', 'world'
];

// 转换为Set以提高查找效率
const stopWordsSet = new Set(commonExclusionWords);

/**
 * 默认的词语排除函数
 * 排除常见的无意义单词、短单词和数字
 *
 * @param word 需要检查的单词
 * @returns 如果应该排除该单词则返回true，否则返回false
 */
export const defaultExcludeWord = (word: string): boolean => {
  return stopWordsSet.has(word.toLowerCase()) ||
         word.length < 2 ||
         !isNaN(Number(word));
};

/**
 * 创建自定义词语过滤器
 *
 * @param options 过滤器选项
 * @returns 自定义词语过滤函数
 */
export const createWordFilter = (options: {
  customExclusionList?: string[];
  minWordLength?: number;
  excludeNumbers?: boolean;
}) => {
  const {
    customExclusionList = commonExclusionWords,
    minWordLength = 2,
    excludeNumbers = true
  } = options;

  return (word: string): boolean => {
    return customExclusionList.includes(word.toLowerCase()) ||
           (minWordLength > 0 && word.length < minWordLength) ||
           (excludeNumbers && !isNaN(Number(word)));
  };
};

/**
 * 过滤有意义的词汇，排除常见的停用词和无意义词
 * @param word 要检查的词
 * @returns 如果是有意义的词返回true，否则返回false
 */
export const filterMeaningfulWords = (word: string): boolean => {
  // 转换为小写
  const lowerWord = word.toLowerCase();

  // 排除停用词
  if (stopWordsSet.has(lowerWord)) {
    return false;
  }

  // 排除太短的词
  if (lowerWord.length < 3) {
    return false;
  }

  // 排除纯数字
  if (/^\d+$/.test(lowerWord)) {
    return false;
  }

  // 排除特殊字符
  if (/^[^\w\s]/.test(lowerWord)) {
    return false;
  }

  return true;
};
