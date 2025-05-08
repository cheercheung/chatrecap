"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface EmojiItem {
  emoji: string;
  count: number;
}

interface CustomBarChartProps {
  data: EmojiItem[] | { label: string; value: number }[];
  title?: string;
  maxItems?: number;
  className?: string;
  showCount?: boolean;
  barColor?: string;
  isEmoji?: boolean;
}

/**
 * 自定义条形图组件，使用粉色条形图和更大的间距
 */
const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  title,
  maxItems = 10,
  className,
  showCount = true,
  barColor = '#ec4899', // 默认使用粉色
  isEmoji = false,
}) => {
  // 处理数据，支持两种数据格式
  const processedData = isEmoji
    ? (data as EmojiItem[]).map(item => ({ label: item.emoji, value: item.count }))
    : (data as { label: string; value: number }[]);

  // 限制数量
  const displayItems = processedData.slice(0, maxItems);

  // 获取翻译
  const t = useTranslations('chatrecapresult');

  // 如果没有数据，显示提示信息
  if (displayItems.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{t('no_data_found')}</div>;
  }

  // 获取最大值，用于计算百分比宽度
  const maxValue = Math.max(...displayItems.map(item => item.value));

  return (
    <div className={className}>
      {title && <h4 className="text-xl font-medium mb-6 text-center">{title}</h4>}
      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`${isEmoji ? 'text-2xl w-10' : 'text-sm font-medium w-16 truncate'}`}>
              {item.label}
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: barColor
                }}
              ></div>
            </div>
            {showCount && (
              <div className="text-sm font-medium w-10 text-right">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomBarChart;
