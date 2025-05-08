/**
 * 分析模块入口文件
 * 导出所有分析相关的函数
 */

import { RawMessage } from '@/lib/chat-processing/types';
import { AnalysisData } from '@/types/analysis';
import { formatDateLong, formatTimespan } from './dateUtils';
import { computeOverview } from './modules/analysisOverview';
import { computeTextAnalysis } from './modules/textAnalysis';
import { computeTimeAnalysis } from './modules/timeAnalysis';
import { computeResponseTime } from './modules/responseAnalysis';
import { computeSentimentScore } from './modules/sentimentAnalysis';

/**
 * 主分析函数 - 整合所有分析步骤，生成完整的分析数据对象
 * @param messages 原始消息数组
 * @returns 完整的分析数据
 */
export function analyzeChatData(messages: RawMessage[]): AnalysisData {
  // 如果没有消息，返回默认的分析数据
  if (!messages.length) {
    const currentDate = new Date();
    return {
      id: "empty",
      startDate: formatDateLong(currentDate),
      endDate: formatDateLong(currentDate),
      duration: 0,
      timespanSummary: "no_messages_to_analyze",
      overview: {
        totalMessages: 0,
        totalWords: 0,
        wordsPerMessage: 0,
        sender1: {
          name: "unknown_sender",
          messages: 0,
          words: 0,
          wordsPerMessage: 0
        },
        sender2: {
          name: "unknown_sender",
          messages: 0,
          words: 0,
          wordsPerMessage: 0
        },
        avgMessagesPerDay: 0,
        mostActiveDay: "monday",
        responseTime: "zero_minutes"
      },
      textAnalysis: {
        commonWords: [],
        sentimentScore: 0,
        topEmojis: [],
        wordCount: 0,
        sender1: {
          name: "unknown_sender",
          commonWords: [],
          topEmojis: []
        },
        sender2: {
          name: "unknown_sender",
          commonWords: [],
          topEmojis: []
        }
      },
      timeAnalysis: {
        mostActiveHour: 0,
        mostActiveDay: "monday",
        mostActiveDate: "unknown_date",
        mostMessagesCount: 0,
        responsePattern: "consistent",
        conversationLength: "no_conversations",
        timeDistribution: [
          {time: "morning", percentage: 25},
          {time: "afternoon", percentage: 25},
          {time: "evening", percentage: 25},
          {time: "night", percentage: 25}
        ],
        hourlyActivity: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 })),
        dailyActivity: [],
        weekdayHourHeatmap: [
          {
            day: "days_of_week.monday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "days_of_week.tuesday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "days_of_week.wednesday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "days_of_week.thursday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "days_of_week.friday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "days_of_week.saturday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "days_of_week.sunday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          }
        ]
      }
    };
  }

  // 确保第一条和最后一条消息有日期
  const firstMsg = messages[0];
  const lastMsg = messages[messages.length - 1];
  if (!firstMsg.date || !lastMsg.date) {
    throw new Error('Messages must have valid date fields');
  }

  // 确保日期对象是有效的 Date 实例
  let firstDate = firstMsg.date;
  let lastDate = lastMsg.date;

  // 验证并修复日期对象
  if (!(firstDate instanceof Date) || isNaN(firstDate.getTime())) {
    // 只记录警告，不需要翻译，因为这是服务器端日志
    console.warn('Invalid first message date, using current date minus 30 days');
    firstDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
  }

  if (!(lastDate instanceof Date) || isNaN(lastDate.getTime())) {
    // 只记录警告，不需要翻译，因为这是服务器端日志
    console.warn('Invalid last message date, using current date');
    lastDate = new Date();
  }

  // 顶层日期范围
  const startDate = formatDateLong(firstDate);
  const endDate = formatDateLong(lastDate);
  const duration = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 生成时间跨度摘要
  const timespanSummary = formatTimespan(firstDate, lastDate);

  // 子分析
  const overview = computeOverview(messages);
  const textAnalysisRaw = computeTextAnalysis(messages);
  const timeAnalysis = computeTimeAnalysis(messages);
  const responseTime = computeResponseTime(messages);
  const sentimentScore = computeSentimentScore(messages);

  // 合并情感分析到文本分析
  const textAnalysis: AnalysisData['textAnalysis'] = {
    ...textAnalysisRaw,
    sentimentScore
  };

  return {
    id: "generated",
    startDate,
    duration,
    endDate,
    timespanSummary,
    overview: { ...overview, responseTime },
    textAnalysis,
    timeAnalysis
  };
}

// 导出所有分析函数
export { computeOverview } from './modules/analysisOverview';
export { computeTextAnalysis } from './modules/textAnalysis';
export { computeTimeAnalysis } from './modules/timeAnalysis';
export { computeResponseTime } from './modules/responseAnalysis';
export { computeSentimentScore } from './modules/sentimentAnalysis';

// 导出工具函数
export {
  countFrequency,
  getTopItems,
  formatWordItems,
  formatEmojiItems,
  generateResponsePattern
} from './analysisUtils';

export {
  getMaxMessageCount,
  generateYAxisTicks
} from './chartUtils';

export {
  formatDateLong,
  formatDateShort,
  formatTimespan
} from './dateUtils';
