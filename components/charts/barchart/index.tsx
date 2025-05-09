"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface EmojiItem {
  emoji: string;
  count: number;
}

interface BarChartProps {
  data: EmojiItem[] | { label: string; value: number }[];
  title?: string;
  maxItems?: number;
  className?: string;
  showCount?: boolean;
  barColor?: string;
  labelKey?: string;
  valueKey?: string;
  isEmoji?: boolean;
}

/**
 * 通用条形图组件，支持Emoji或普通数据
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  maxItems = 10,
  className,
  showCount = true,
  barColor,
  labelKey = 'label',
  valueKey = 'value',
  isEmoji = false,
}) => {
  // 处理数据，支持两种数据格式
  const processedData = isEmoji
    ? (data as EmojiItem[]).map(item => ({ label: item.emoji, value: item.count }))
    : (data as { label: string; value: number }[]);

  // 限制数量
  const displayItems = processedData.slice(0, maxItems);

  // 获取翻译
  const t = useTranslations('results');

  // 安全翻译函数，如果翻译键不存在则返回默认值
  const safeT = (key: string, defaultValue: string): string => {
    try {
      return t(key);
    } catch (e) {
      return defaultValue;
    }
  };

  // 如果没有数据，显示提示信息
  if (displayItems.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">
      {safeT('no_data.no_meaningful_words', 'No data found')}
    </div>;
  }

  // 获取最大值，用于计算百分比宽度
  const maxValue = Math.max(...displayItems.map(item => item.value));

  return (
    <div className={className}>
      {title && <h4 className="text-lg font-medium mb-4">{title}</h4>}
      <div className="space-y-1.5">
        {displayItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`${isEmoji ? 'text-lg w-7' : 'text-xs font-medium w-20 truncate'}`}>
              {item.label}
            </div>
            <div className="flex-1 h-4 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: barColor || 'hsl(var(--primary))'
                }}
              ></div>
            </div>
            {showCount && (
              <div className="text-xs font-medium w-10 text-right">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;