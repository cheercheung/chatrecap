"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapProps {
  data: {
    day: string; // 现在这个字段应该是数字 (0-6) 或简单的英文日期标识符
    hours: { hour: number; count: number }[];
  }[];
  title?: string;
  showValues?: boolean;
  showLegend?: boolean;
  valueIntensityThreshold?: number;
  className?: string;
}

// 不再需要自定义 Tooltip 内容组件，使用 Radix UI 的 TooltipContent 组件

const Heatmap: React.FC<HeatmapProps> = ({
  data,
  title,
  showValues = false,
  showLegend = true,
  valueIntensityThreshold = 0.5,
  className
}) => {
  // 不再需要 tooltip 状态，因为使用 Radix UI 的 Tooltip 组件
  // 获取翻译
  const t = useTranslations('chatrecapresult');
  const commonT = useTranslations('common');

  // 安全翻译函数，如果翻译键不存在则返回默认值
  const safeT = (key: string, defaultValue: string): string => {
    try {
      return t(key);
    } catch (e) {
      return defaultValue;
    }
  };

  // 安全翻译函数，用于common命名空间
  const safeCommonT = (key: string, defaultValue: string): string => {
    try {
      return commonT(key);
    } catch (e) {
      return defaultValue;
    }
  };

  // 星期几的翻译映射
  const dayTranslationKeys = [
    'days_of_week.sunday',
    'days_of_week.monday',
    'days_of_week.tuesday',
    'days_of_week.wednesday',
    'days_of_week.thursday',
    'days_of_week.friday',
    'days_of_week.saturday'
  ];

  // 获取星期几的翻译
  const getDayTranslation = (day: string): string => {
    // 星期几的默认英文名称（用于翻译失败时的回退）
    const defaultDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // 如果是数字 (0-6)，直接使用对应的翻译键
    if (/^[0-6]$/.test(day)) {
      return safeCommonT(dayTranslationKeys[parseInt(day)], defaultDayNames[parseInt(day)]);
    }

    // 如果是简单的英文日期标识符 (sunday, monday 等)，添加命名空间前缀
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      .findIndex(d => d.toLowerCase() === day.toLowerCase());

    if (dayIndex !== -1) {
      return safeCommonT(`days_of_week.${day.toLowerCase()}`, defaultDayNames[dayIndex]);
    }

    // 如果已经是完整的翻译键 (days_of_week.xxx 或 time_of_day.xxx)，直接使用
    if (day.startsWith('days_of_week.')) {
      const shortDay = day.replace('days_of_week.', '');
      const shortDayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        .findIndex(d => d.toLowerCase() === shortDay.toLowerCase());

      return safeCommonT(day, shortDayIndex !== -1 ? defaultDayNames[shortDayIndex] : day);
    }

    // 兼容旧的 time_of_day 前缀
    if (day.startsWith('time_of_day.')) {
      const shortDay = day.replace('time_of_day.', '');
      const shortDayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        .findIndex(d => d.toLowerCase() === shortDay.toLowerCase());

      if (shortDayIndex !== -1) {
        return safeCommonT(`days_of_week.${shortDay}`, defaultDayNames[shortDayIndex]);
      }
    }

    // 默认情况，尝试直接翻译
    return safeT(day, day);
  };

  // Find the maximum count for color scaling
  const maxCount = Math.max(
    ...data.flatMap(day => day.hours.map(hour => hour.count))
  );

  // Helper function to get color based on intensity
  const getHeatColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-200'; // 值为0时显示为灰色
    if (intensity < 0.2) return 'bg-primary/20';
    if (intensity < 0.4) return 'bg-primary/40';
    if (intensity < 0.6) return 'bg-primary/60';
    if (intensity < 0.8) return 'bg-primary/80';
    return 'bg-primary';
  };

  // Helper function to get text color based on intensity
  const getTextColor = (intensity: number): string => {
    return intensity > valueIntensityThreshold ? 'text-white' : 'text-foreground';
  };

  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}

      <div className="flex flex-col gap-1">
        {/* Hour labels */}
        <div className="flex ml-20">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs text-muted-foreground"
            >
              {i}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {data.map((dayData, dayIndex) => (
          <div key={dayIndex} className="flex items-center">
            <div className="w-20 text-right pr-2 text-sm font-medium">
              {getDayTranslation(dayData.day)}
            </div>
            <div className="flex flex-1 gap-1">
              {dayData.hours.map((hourData, hourIndex) => {
                const intensity = hourData.count / maxCount;
                const bgColorClass = getHeatColor(intensity);
                const textColorClass = getTextColor(intensity);

                return (
                  <div
                    key={hourIndex}
                    className="flex-1 h-8 flex items-center justify-center relative"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-5 h-5 ${bgColorClass} rounded-full flex items-center justify-center text-xs ${textColorClass} cursor-help`}
                            style={{
                              opacity: 1 // 所有圆点都显示，包括值为0的
                            }}
                          >
                            {showValues && hourData.count > 0 && hourData.count}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-4 bg-background/95 backdrop-blur-sm border border-primary/10 shadow-lg rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">{getDayTranslation(dayData.day)}, {hourData.hour}:00</div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                              <span>{hourData.count} messages</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 不再需要全局 Tooltip */}

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-end mt-4 gap-1 text-sm">
          <span className="text-muted-foreground">low</span>
          <div className="flex h-2.5 w-24">
            {['bg-primary/5', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary/80'].map((color, i) => (
              <div
                key={i}
                className={`flex-1 ${color}`}
              ></div>
            ))}
          </div>
          <span className="text-muted-foreground">high</span>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
