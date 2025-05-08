/**
 * 时间分析模块
 * 计算基于时间的分析：活跃小时、日期、分布、热图和响应模式
 */

import { RawMessage } from '@/lib/chat-processing/types';
import { AnalysisData } from '@/types/analysis';
import { formatDateShort } from '../dateUtils';
import { generateResponsePattern } from '../index';

/**
 * 计算基于时间的分析：活跃小时、日期、分布、热图和响应模式
 */
export function computeTimeAnalysis(messages: RawMessage[]): AnalysisData['timeAnalysis'] {
  // 初始化数据结构
  const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
  const dailyMap = new Map<string, number>();
  const dayCounts = Array(7).fill(0);

  // 如果没有消息，返回默认的时间分析数据
  if (!messages.length) {
    const dayNames = [
      'days_of_week.sunday',
      'days_of_week.monday',
      'days_of_week.tuesday',
      'days_of_week.wednesday',
      'days_of_week.thursday',
      'days_of_week.friday',
      'days_of_week.saturday'
    ];

    return {
      mostActiveHour: 0,
      mostActiveDay: "monday",
      mostActiveDate: "Unknown",
      mostMessagesCount: 0,
      responsePattern: "consistent",
      conversationLength: "no_conversations",
      timeDistribution: [
        {time: "time_of_day.morning", percentage: 25},
        {time: "time_of_day.afternoon", percentage: 25},
        {time: "time_of_day.evening", percentage: 25},
        {time: "time_of_day.night", percentage: 25}
      ],
      hourlyActivity,
      dailyActivity: [],
      weekdayHourHeatmap: dayNames.map(day => ({
        day,
        hours: Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
      }))
    };
  }

  // 填充活动映射
  messages.forEach(msg => {
    if (!msg.date) return;

    // 确保日期是有效的 Date 对象
    if (!(msg.date instanceof Date) || isNaN(msg.date.getTime())) {
      return; // 跳过无效日期
    }

    try {
      const h = msg.date.getHours();
      hourlyActivity[h].count++;
      const d = msg.date.getDay();
      dayCounts[d]++;
      const dateStr = formatDateShort(msg.date);
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
    } catch (error) {
      console.warn('处理消息日期时出错:', error);
    }
  });

  // 每日活动数组
  const dailyActivity = Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count }));

  // 最活跃的小时
  const mostActiveHour = hourlyActivity.reduce((max, curr) => curr.count > max.count ? curr : max, hourlyActivity[0]).hour;

  // 最活跃的星期几
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

  // 最活跃的日期
  let mostActiveDate = "Unknown";
  let mostMessagesCount = 0;

  if (dailyActivity.length > 0) {
    const mostActiveDateObj = dailyActivity.reduce((max, curr) => curr.count > max.count ? curr : max, dailyActivity[0]);
    mostActiveDate = mostActiveDateObj.date;
    mostMessagesCount = mostActiveDateObj.count;
  }

  // 计算时间分布（早上、下午、晚上、夜间）
  let morningCount = 0;
  let afternoonCount = 0;
  let eveningCount = 0;
  let nightCount = 0;

  hourlyActivity.forEach(({ hour, count }) => {
    if (hour >= 5 && hour < 12) morningCount += count;
    else if (hour >= 12 && hour < 17) afternoonCount += count;
    else if (hour >= 17 && hour < 22) eveningCount += count;
    else nightCount += count;
  });

  const totalCount = morningCount + afternoonCount + eveningCount + nightCount;

  let timeDistribution: { time: string; percentage: number }[];
  if (totalCount === 0) {
    // 如果没有消息，使用均匀分布
    timeDistribution = [
      { time: "time_of_day.morning", percentage: 25 },
      { time: "time_of_day.afternoon", percentage: 25 },
      { time: "time_of_day.evening", percentage: 25 },
      { time: "time_of_day.night", percentage: 25 }
    ];
  } else {
    timeDistribution = [
      { time: "time_of_day.morning", percentage: Math.round((morningCount / totalCount) * 100) },
      { time: "time_of_day.afternoon", percentage: Math.round((afternoonCount / totalCount) * 100) },
      { time: "time_of_day.evening", percentage: Math.round((eveningCount / totalCount) * 100) },
      { time: "time_of_day.night", percentage: Math.round((nightCount / totalCount) * 100) }
    ];
  }

  // 按星期几对消息进行分组，正确生成热力图数据
  // 初始化每个星期几的小时活跃度数据
  const weekdayHourlyData = new Array(7).fill(0).map(() =>
    new Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }))
  );

  // 统计每个星期几每个小时的消息数量
  messages.forEach(msg => {
    if (!msg.date) return;

    // 确保日期是有效的 Date 对象
    if (!(msg.date instanceof Date) || isNaN(msg.date.getTime())) {
      return; // 跳过无效日期
    }

    try {
      const day = msg.date.getDay(); // 0-6，对应周日到周六
      const hour = msg.date.getHours(); // 0-23
      weekdayHourlyData[day][hour].count++;
    } catch (error) {
      console.warn('处理热力图数据时出错:', error);
    }
  });

  // 生成最终的热力图数据
  const weekdayHourHeatmap = dayNames.map((day, idx) => ({
    day,
    hours: weekdayHourlyData[idx]
  }));

  return {
    mostActiveHour,
    mostActiveDay,
    mostActiveDate,
    mostMessagesCount,
    responsePattern: generateResponsePattern(hourlyActivity),
    conversationLength: 'Average 32 minutes', // 这里可以改进为实际计算
    timeDistribution,
    hourlyActivity,
    dailyActivity,
    weekdayHourHeatmap
  };
}
