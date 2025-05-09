"use client";

import React from 'react';
import { PieChart } from '@/components/charts';
import { useTranslations } from 'next-intl';

interface TimeDistributionProps {
  data: { time: string; percentage: number }[];
  title?: string;
  className?: string;
  height?: number;
}

const TimeDistribution: React.FC<TimeDistributionProps> = ({ data, title, className, height = 250 }) => {
  // 获取翻译函数
  const t = useTranslations('results');
  const commonT = useTranslations('common');

  // 安全翻译函数，如果翻译键不存在则返回默认值
  const safeT = (key: string, defaultValue: string): string => {
    try {
      return t(key);
    } catch (e) {
      return defaultValue;
    }
  };

  // 时间段的默认中文名称
  const defaultTimeNames: Record<string, string> = {
    'morning': '早上',
    'afternoon': '下午',
    'evening': '晚上',
    'night': '夜间'
  };

  // 定义饼图的颜色
  const pieColors = [
    'hsl(var(--primary))',
    'hsl(var(--primary)/0.8)',
    'hsl(var(--primary)/0.6)',
    'hsl(var(--primary)/0.4)'
  ];

  // 处理时间标签的翻译
  const getTranslatedLabel = (timeKey: string): string => {
    // 确保我们有一个有效的翻译键
    let translationKey = timeKey;
    let defaultValue = timeKey;

    // 如果是简单的时间标识符，添加命名空间并设置默认值
    if (!translationKey.includes('.')) {
      defaultValue = defaultTimeNames[translationKey.toLowerCase()] || translationKey;
      translationKey = `time_of_day.${translationKey}`;
    }

    // 安全获取翻译，如果翻译键不存在则返回默认值
    try {
      return commonT(translationKey);
    } catch (e) {
      return defaultValue;
    }
  };

  // 将时间分布数据转换为PieChart组件所需的格式
  const pieChartData = data.map((item, index) => ({
    name: getTranslatedLabel(item.time),
    value: item.percentage,
    color: pieColors[index % pieColors.length]
  }));

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}

      <div style={{ height: `${height}px` }}>
        <PieChart
          data={pieChartData}
          height={height}
          innerRadius={30}
          outerRadius={height > 200 ? 80 : 60}
          tooltipUnit="%"
          showLabels={false}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default TimeDistribution;
