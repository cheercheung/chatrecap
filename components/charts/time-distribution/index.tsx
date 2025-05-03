"use client";

import React from 'react';
import { BarChart } from '@/components/charts';

interface TimeDistributionProps {
  data: { time: string; percentage: number }[];
  title?: string;
  className?: string;
}

const TimeDistribution: React.FC<TimeDistributionProps> = ({ data, title, className }) => {
  // 将时间分布数据转换为BarChart组件所需的格式
  const barChartData = data.map(item => ({
    label: item.time,
    value: item.percentage
  }));

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
