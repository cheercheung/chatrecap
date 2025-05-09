// components/HeartRatioChart.tsx
import { useId } from 'react';

export default function HeartRatioChart({
    value1,
    value2,
    color1 = "#ff4d4f",
    color2 = "#1890ff",
    size = 200,
  }: {
    value1: number;
    value2: number;
    color1?: string;
    color2?: string;
    size?: number;
  }) {
    const total = value1 + value2;
    const ratio = total === 0 ? 0.5 : value1 / total;
    const gradientId = useId(); // 生成唯一ID

    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color1} />
            <stop offset={`${ratio * 100}%`} stopColor={color1} />
            <stop offset={`${ratio * 100}%`} stopColor={color2} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="40"
          fill={`url(#${gradientId})`}
          stroke="#333"
          strokeWidth="1"
        />
      </svg>
    );
  }
