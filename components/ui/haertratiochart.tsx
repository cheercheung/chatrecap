// components/HeartRatioChart.tsx
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
  
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color1} />
            <stop offset={`${ratio * 100}%`} stopColor={color1} />
            <stop offset={`${ratio * 100}%`} stopColor={color2} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
  
        <path
          d="M50 91s-35-25.6-35-52.1C15 25.6 29.4 13 44.3 22.1 50 25.9 55.7 22.1 61.4 22.1 76.3 13 90.7 25.6 90.7 38.9 90.7 65.4 50 91 50 91z"
          fill="url(#heartGradient)"
          stroke="#333"
          strokeWidth="1"
        />
      </svg>
    );
  }
  