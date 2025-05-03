"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface HeatmapProps {
  data: {
    day: string;
    hours: { hour: number; count: number }[];
  }[];
  title?: string;
  showValues?: boolean;
  showLegend?: boolean;
  valueIntensityThreshold?: number;
  className?: string;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data,
  title,
  showValues = false,
  showLegend = true,
  valueIntensityThreshold = 0.5,
  className
}) => {
  // 获取翻译
  const t = useTranslations('chatrecapresult');

  // Find the maximum count for color scaling
  const maxCount = Math.max(
    ...data.flatMap(day => day.hours.map(hour => hour.count))
  );

  // Helper function to get color based on intensity
  const getHeatColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-primary/5';
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
              {dayData.day}
            </div>
            <div className="flex flex-1 gap-0.5">
              {dayData.hours.map((hourData, hourIndex) => {
                const intensity = hourData.count / maxCount;
                const bgColorClass = getHeatColor(intensity);
                const textColorClass = getTextColor(intensity);

                return (
                  <div
                    key={hourIndex}
                    className={`flex-1 h-8 ${bgColorClass} flex items-center justify-center text-xs ${textColorClass} rounded-sm`}
                  >
                    {showValues && hourData.count > 0 && hourData.count}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-end mt-4 gap-1 text-sm">
          <span className="text-muted-foreground">{t('low')}</span>
          <div className="flex h-2.5 w-24">
            {['bg-primary/5', 'bg-primary/20', 'bg-primary/40', 'bg-primary/60', 'bg-primary/80'].map((color, i) => (
              <div
                key={i}
                className={`flex-1 ${color}`}
              ></div>
            ))}
          </div>
          <span className="text-muted-foreground">{t('high')}</span>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
