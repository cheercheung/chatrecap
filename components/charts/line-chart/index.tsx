"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useTranslations } from 'next-intl';

interface LineChartProps {
  data: { date: string; count: number }[];
  title?: string;
  height?: number;
  tooltipUnit?: string;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  tooltipUnit = '',
  className
}) => {
  // 获取翻译
  const t = useTranslations('chatrecapresult');

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{t('no_data_available')}</div>;
  }

  // 转换数据格式以适应 Recharts
  const chartData = data.map(item => ({
    date: item.date,
    value: item.count
  }));

  // 自定义 Tooltip 内容
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm border border-primary/10 rounded-md p-2 shadow-md text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {payload[0].value} {tooltipUnit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}

      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--primary)/0.1)"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              axisLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              axisLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              tickMargin={8}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="url(#colorValue)"
              strokeWidth={2}
              activeDot={{
                r: 6,
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
                fill: 'hsl(var(--primary))'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
