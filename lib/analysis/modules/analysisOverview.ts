/**
 * 概览分析模块
 * 计算高级统计数据：消息数量、字数、时间范围、活跃日、响应时间等
 */

import { RawMessage } from '@/lib/chat-processing/types';
import { AnalysisData } from '@/types/analysis';
import { formatDateLong } from '../dateUtils';

/**
 * 计算高级概览统计数据：消息数量、字数、时间范围、活跃日、响应时间等
 */
export function computeOverview(messages: RawMessage[]): AnalysisData['overview'] {
  if (!messages.length) {
    return {
      totalMessages: 0,
      totalWords: 0,
      wordsPerMessage: 0,
      sender1: {
        name: "User 1",
        messages: 0,
        words: 0,
        wordsPerMessage: 0
      },
      sender2: {
        name: "User 2",
        messages: 0,
        words: 0,
        wordsPerMessage: 0
      },
      avgMessagesPerDay: 0,
      mostActiveDay: "days_of_week.monday",
      responseTime: "0 minutes"
    };
  }

  // 确保日期可用
  const firstMsg = messages[0];
  const lastMsg = messages[messages.length - 1];
  if (!firstMsg.date || !lastMsg.date) {
    throw new Error('Messages must have date field populated');
  }

  // 确保日期对象是有效的 Date 实例
  let firstDate = firstMsg.date;
  let lastDate = lastMsg.date;

  // 验证并修复日期对象
  if (!(firstDate instanceof Date) || isNaN(firstDate.getTime())) {
    console.warn('概览分析：第一条消息的日期无效，使用当前日期减去30天');
    firstDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前
  }

  if (!(lastDate instanceof Date) || isNaN(lastDate.getTime())) {
    console.warn('概览分析：最后一条消息的日期无效，使用当前日期');
    lastDate = new Date();
  }

  // 时间跨度
  const startDate = formatDateLong(firstDate);
  const endDate = formatDateLong(lastDate);
  const durationInDays = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 总消息数和总字数
  const totalMessages = messages.length;
  let totalWords = 0;
  messages.forEach(msg => {
    totalWords += msg.message.trim().split(/\s+/).filter(w => w).length;
  });
  const wordsPerMessage = totalWords / totalMessages;

  // 确定两个发送者
  const senders = new Set(messages.map(m => m.sender));
  if (senders.size < 2) {
    throw new Error('Need at least two different senders for analysis');
  }
  const uniqueSenders = Array.from(senders);
  const sender1 = uniqueSenders[0];
  const sender2 = uniqueSenders[1];

  // 每个发送者的统计数据
  const sender1Msgs = messages.filter(m => m.sender === sender1);
  const sender2Msgs = messages.filter(m => m.sender === sender2);
  let sender1Words = 0;
  let sender2Words = 0;
  messages.forEach(msg => {
    const count = msg.message.trim().split(/\s+/).filter(w => w).length;
    if (msg.sender === sender1) sender1Words += count;
    else if (msg.sender === sender2) sender2Words += count;
  });

  // 平均每天消息数
  const avgMessagesPerDay = totalMessages / durationInDays;

  // 最活跃的工作日
  const dayCounts = Array(7).fill(0);
  messages.forEach(msg => {
    // 如果没有日期则跳过
    if (!msg.date) return;

    // 确保日期是有效的 Date 对象
    if (!(msg.date instanceof Date) || isNaN(msg.date.getTime())) {
      return; // 跳过无效日期
    }

    dayCounts[msg.date.getDay()]++;
  });
  const dayNames = [
    'days_of_week.sunday',
    'days_of_week.monday',
    'days_of_week.tuesday',
    'days_of_week.wednesday',
    'days_of_week.thursday',
    'days_of_week.friday',
    'days_of_week.saturday'
  ];
  const mostActiveDay = dayNames[dayCounts.indexOf(Math.max(...dayCounts))];

  // 平均响应时间（分钟）
  const responseTimes: number[] = [];
  let lastTime: Date | null = null;
  let lastSender: string | null = null;
  messages.forEach(msg => {
    // 如果没有日期则跳过
    if (!msg.date) return;

    // 确保当前消息的日期是有效的 Date 对象
    if (!(msg.date instanceof Date) || isNaN(msg.date.getTime())) {
      return; // 跳过无效日期
    }

    if (lastTime && lastSender && lastSender !== msg.sender) {
      try {
        const diff = msg.date.getTime() - lastTime.getTime();
        if (diff < 3600000) responseTimes.push(diff / 60000);
      } catch (error) {
        console.warn('计算响应时间时出错:', error);
      }
    }
    lastTime = msg.date;
    lastSender = msg.sender;
  });
  const avgResp = responseTimes.length
    ? responseTimes.reduce((sum, v) => sum + v, 0) / responseTimes.length
    : 0;
  const responseTime = avgResp < 1
    ? `${Math.round(avgResp * 60)} seconds`
    : `${Math.round(avgResp)} minutes`;

  return {
    totalMessages,
    totalWords,
    wordsPerMessage: Number(wordsPerMessage.toFixed(1)),
    sender1: {
      name: sender1,
      messages: sender1Msgs.length,
      words: sender1Words,
      wordsPerMessage: Number((sender1Words / sender1Msgs.length).toFixed(1))
    },
    sender2: {
      name: sender2,
      messages: sender2Msgs.length,
      words: sender2Words,
      wordsPerMessage: Number((sender2Words / sender2Msgs.length).toFixed(1))
    },
    avgMessagesPerDay: Number(avgMessagesPerDay.toFixed(1)),
    mostActiveDay,
    responseTime
  };
}
