/**
 * 图表数据处理工具函数
 */

/**
 * 获取消息数量的最大值
 * 用于图表缩放
 */
export function getMaxMessageCount(data: { count: number }[]): number {
  if (!data || data.length === 0) return 50;
  return Math.max(...data.map(day => day.count));
}

/**
 * 生成Y轴刻度值
 * 用于图表显示
 */
export function generateYAxisTicks(maxCount: number): number[] {
  const roundedMax = Math.ceil(maxCount / 5) * 5;
  const stepSize = roundedMax / 5;
  return Array.from({ length: 6 }, (_, i) => roundedMax - i * stepSize);
}
