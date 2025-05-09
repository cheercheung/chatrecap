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
  tooltipUnit?: string; // 保留以保持向后兼容性
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  // tooltipUnit 参数保留以保持向后兼容性
  className
}) => {
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

  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">
      {safeT('no_data.no_messages_to_analyze', 'No data available')}
    </div>;
  }

  // 转换数据格式以适应 Recharts
  const chartData = data.map(item => ({
    date: item.date,
    value: item.count
  }));

  // 自定义 tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-background/95 backdrop-blur-sm border border-primary/10 shadow-md rounded-md text-sm">
          <div className="space-y-1">
            <div className="font-medium">{label}</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
              <span>{payload[0].value} messages</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className} style={{ width: '100%' }}>
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}

      {/* 使用固定高度，确保图表可见 */}
      <div style={{
        width: '100%',
        height: `${height}px`,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* 只使用一个图表渲染，避免干扰 */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 10,
              bottom: 5,
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
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              axisLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              tickMargin={3}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              axisLine={{ stroke: 'hsl(var(--primary)/0.2)' }}
              tickMargin={3}
              width={30}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              wrapperStyle={{
                zIndex: 1000,
                position: 'absolute',
                pointerEvents: 'auto',
                outline: 'none'
              }}
              offset={10}
              allowEscapeViewBox={{ x: true, y: true }}
              position={{ x: 0, y: 0 }}
            />
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
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
