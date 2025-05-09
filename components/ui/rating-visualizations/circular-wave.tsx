"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CircularWaveRatingProps {
  title: string;
  score: number;
  maxScore: number;
  content: string;
  className?: string;
}

export const CircularWaveRating: React.FC<CircularWaveRatingProps> = ({
  title,
  score,
  maxScore,
  content,
  className,
}) => {
  // 计算百分比
  const percentage = (score / maxScore) * 100;

  // 波浪动画参数
  const waveCount = 5; // 波浪数量
  const waves = Array.from({ length: waveCount }, (_, i) => i);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${className}`}>
      {/* 左侧：环形进度条 + 波浪效果 */}
      <div className="relative w-64 h-64 flex-shrink-0">
        {/* 外环 */}
        <div className="absolute inset-0 rounded-full border-8 border-primary/10"></div>

        {/* 进度环 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* 波浪容器 */}
        <div className="absolute inset-4 rounded-full overflow-hidden bg-primary/5">
          {/* 波浪动画 */}
          {waves.map((wave, index) => (
            <motion.div
              key={index}
              className="absolute bottom-0 left-0 right-0 bg-primary/20"
              style={{
                height: `${percentage}%`,
                opacity: 0.2 + (index * 0.15),
              }}
              animate={{
                y: [
                  -5 - index * 2,
                  -2 - index * 1.5,
                  -8 - index * 2.5,
                  -3 - index * 1.8,
                  -5 - index * 2
                ],
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 中心评分显示 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary din-numbers">
                {score}/{maxScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：标题和内容 */}
      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </div>
    </div>
  );
};
