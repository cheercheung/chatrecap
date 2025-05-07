"use client";

import React from 'react';
import { BarChart } from '@/components/charts';
import { useTranslations } from 'next-intl';

interface TimeDistributionProps {
  data: { time: string; percentage: number }[];
  title?: string;
  className?: string;
}

const TimeDistribution: React.FC<TimeDistributionProps> = ({ data, title, className }) => {
  // 获取翻译函数
  const t = useTranslations('chatrecapresult');

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

  // 将时间分布数据转换为BarChart组件所需的格式
  const barChartData = data.map(item => {
    // 确保我们有一个有效的翻译键
    let translationKey = item.time;
    let defaultValue = item.time;

    // 如果是简单的时间标识符，添加命名空间并设置默认值
    if (!translationKey.includes('.')) {
      defaultValue = defaultTimeNames[translationKey.toLowerCase()] || translationKey;
      translationKey = `time_of_day.${translationKey}`;
    }

    return {
      label: safeT(translationKey, defaultValue),
      value: item.percentage
    };
  });

  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}

      {/* 水平条形图 */}
      <div className="h-30">
        <BarChart
          data={barChartData}
          showCount={true}
          barColor="hsl(var(--primary))"
          className="h-full"
        />
      </div>
    </div>
  );
};

export default TimeDistribution;
