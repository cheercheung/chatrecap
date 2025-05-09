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



  // 添加控制台日志以便调试
  console.log("LineChart data:", data);
  console.log("Processed chartData:", chartData);

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
        {/* 使用两种方式渲染，确保至少一种能工作 */}
        {/* 方式1: 使用ResponsiveContainer */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 5,
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
              <Tooltip />
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

        {/* 方式2: 直接渲染，不使用ResponsiveContainer */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.01 }}>
          <AreaChart
            width={800}
            height={height}
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
