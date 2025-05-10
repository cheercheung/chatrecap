"use client";

import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number; color?: string }[];
  title?: string;
  height?: number;
  width?: string | number;
  className?: string;
  tooltipUnit?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  showLegend?: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary)/0.8)', 'hsl(var(--primary)/0.6)', 'hsl(var(--primary)/0.4)'];

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 300,
  width = "100%",
  className = "",
  tooltipUnit = "",
  innerRadius = 0,
  outerRadius = 80,
  showLabels = false,
  showLegend = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 确保数据有效
  if (!data || data.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No data available</div>;
  }

  // 处理鼠标悬停事件
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // 自定义活动扇区的渲染
  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
        {showLabels && (
          <text
            x={cx}
            y={cy}
            dy={8}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            className="text-xs font-medium"
          >
            <tspan className="din-numbers">{`${payload.name}: ${value}${tooltipUnit} (${(percent * 100).toFixed(0)}%)`}</tspan>
          </text>
        )}
      </g>
    );
  };

  // 自定义 tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-background/95 backdrop-blur-sm border border-primary/10 shadow-md rounded-md text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
              <span className="font-medium">{data.name}:</span>
              <span className="din-numbers">{data.value}{tooltipUnit}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}

      <div style={{ width, height, position: 'relative', minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 100, position: 'absolute', pointerEvents: 'none' }}
              cursor={false}
              offset={5}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="hsl(var(--primary))"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              paddingAngle={innerRadius > 0 ? 2 : 0}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* 图例 - 放在饼图左上角 */}
            {showLegend && (
              <text x="10%" y="15%" className="text-xs" textAnchor="start">
                <tspan x="10%" dy="0" className="font-medium">Legend:</tspan>
                {data.map((entry, index) => (
                  <tspan key={`legend-${index}`} x="10%" dy="15" fill={entry.color || COLORS[index % COLORS.length]}>
                    ● {entry.name}
                  </tspan>
                ))}
              </text>
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;
