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
      timespanSummary: "No messages to analyze",
      overview: {
        totalMessages: 0,
        totalWords: 0,
        wordsPerMessage: 0,
        sender1: {
          name: "Unknown",
          messages: 0,
          words: 0,
          wordsPerMessage: 0
        },
        sender2: {
          name: "Unknown",
          messages: 0,
          words: 0,
          wordsPerMessage: 0
        },
        avgMessagesPerDay: 0,
        mostActiveDay: "day_names.monday",
        responseTime: "0 minutes"
      },
      textAnalysis: {
        commonWords: [],
        sentimentScore: 0,
        topEmojis: [],
        wordCount: 0,
        sender1: {
          name: "Unknown",
          commonWords: [],
          topEmojis: []
        },
        sender2: {
          name: "Unknown",
          commonWords: [],
          topEmojis: []
        }
      },
      timeAnalysis: {
        mostActiveHour: 0,
        mostActiveDay: "day_names.monday",
        mostActiveDate: "Unknown",
        mostMessagesCount: 0,
        responsePattern: "response_patterns.consistent",
        conversationLength: "No conversations",
        timeDistribution: [
          {time: "time_distribution.morning", percentage: 25},
          {time: "time_distribution.afternoon", percentage: 25},
          {time: "time_distribution.evening", percentage: 25},
          {time: "time_distribution.night", percentage: 25}
        ],
        hourlyActivity: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 })),
        dailyActivity: [],
        weekdayHourHeatmap: [
          {
            day: "day_names.monday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "day_names.tuesday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "day_names.wednesday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "day_names.thursday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "day_names.friday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "day_names.saturday",
            hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
          },
          {
            day: "day_names.sunday",
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
    console.warn('第一条消息的日期无效，使用当前日期减去30天');
    firstDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
  }

  if (!(lastDate instanceof Date) || isNaN(lastDate.getTime())) {
    console.warn('最后一条消息的日期无效，使用当前日期');
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
