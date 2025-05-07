"use client";

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { useTranslations } from 'next-intl';

interface RadarDataItem {
  subject: string;
  value: number;
  fullMark?: number;
}

interface RadarChartProps {
  data: RadarDataItem[];
  title?: string;
  height?: number;
  width?: string;
  fillColor?: string;
  strokeColor?: string;
  fillOpacity?: number;
  className?: string;
}

/**
 * 雷达图组件
 */
const RadarChartComponent: React.FC<RadarChartProps> = ({
  data,
  title,
  height = 300,
  width = "100%",
  fillColor = "hsl(var(--primary))",
  strokeColor = "hsl(var(--primary))",
  fillOpacity = 0.6,
  className
}) => {
  // 获取翻译
  const t = useTranslations('chatrecapresult');

  // 安全翻译函数，如果翻译键不存在则返回默认值
  const safeT = (key: string, defaultValue: string): string => {
    try {
      return t(key);
    } catch (e) {
      // 如果翻译失败，返回默认值
      return defaultValue;
    }
  };

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{safeT('no_data_available', '暂无数据')}</div>;
  }

  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-lg font-medium text-center">{title}</h3>}

      <div style={{ width: width, height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--primary)/0.2)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              stroke="hsl(var(--primary)/0.2)"
            />
            <Radar
              name="Value"
              dataKey="value"
              stroke={strokeColor}
              fill={fillColor}
              fillOpacity={fillOpacity}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartComponent;
