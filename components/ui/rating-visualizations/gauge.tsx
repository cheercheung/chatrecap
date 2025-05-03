"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GaugeRatingProps {
  title: string;
  score: number;
  maxScore: number;
  content: string;
  className?: string;
}

export const GaugeRating: React.FC<GaugeRatingProps> = ({
  title,
  score,
  maxScore,
  content,
  className,
}) => {
  // 计算角度（从-90度到90度）
  const angle = -90 + (score / maxScore) * 180;
  
  // 动画状态
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 组件加载后开始动画
  useEffect(() => {
    setIsAnimating(true);
  }, []);
  
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${className}`}>
      {/* 左侧：仪表盘 */}
      <div className="relative w-64 h-48 flex-shrink-0">
        {/* 仪表盘背景 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-primary/5 rounded-t-full"></div>
        
        {/* 刻度线 */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 left-1/2 h-6 w-0.5 bg-primary/30"
              style={{
                transform: `translateX(-50%) rotate(${-90 + i * 18}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
          ))}
        </div>
        
        {/* 指针 */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-28 w-1 bg-primary origin-bottom"
          style={{
            transformOrigin: 'bottom center',
          }}
          animate={{
            rotate: isAnimating ? angle : -90,
          }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            delay: 0.3,
          }}
        >
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full"></div>
        </motion.div>
        
        {/* 中心点 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full"></div>
        
        {/* 分数显示 */}
        <motion.div
          className="absolute top-0 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="text-3xl font-bold text-primary">
            {score}/{maxScore}
          </div>
        </motion.div>
      </div>
      
      {/* 右侧：标题和内容 */}
      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{content}</p>
      </div>
    </div>
  );
};
