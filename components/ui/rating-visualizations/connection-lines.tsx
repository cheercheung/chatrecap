"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface ConnectionLinesRatingProps {
  title: string;
  score: number;
  maxScore: number;
  content: string;
  className?: string;
}

export const ConnectionLinesRating: React.FC<ConnectionLinesRatingProps> = ({
  title,
  score,
  maxScore,
  content,
  className,
}) => {
  // 计算连接线数量（基于分数）
  const connectionCount = Math.round((score / maxScore) * 10);
  
  // 动画状态
  const [activeLines, setActiveLines] = useState(0);
  
  // 组件加载后开始动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveLines(connectionCount);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [connectionCount]);
  
  // 创建连接线数组
  const connections = Array.from({ length: 10 }, (_, i) => i + 1);
  
  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${className}`}>
      {/* 左侧：连接线可视化 */}
      <div className="relative w-64 h-64 flex-shrink-0">
        {/* 两个用户图标 */}
        <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={32} className="text-primary" />
        </div>
        <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={32} className="text-primary" />
        </div>
        
        {/* 连接线 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
          {connections.map((_, i) => {
            // 计算线条的起点和终点（稍微错开以创建多条线的效果）
            const startX = 32 + (i * 2);
            const startY = 32 + (i * 2);
            const endX = 224 - (i * 2);
            const endY = 224 - (i * 2);
            
            return (
              <motion.line
                key={i}
                x1={startX}
                y1={startY}
                x2={startX}
                y2={startY}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,3"
                initial={{ opacity: 0 }}
                animate={{ 
                  x2: i < activeLines ? endX : startX,
                  y2: i < activeLines ? endY : startY,
                  opacity: i < activeLines ? 1 : 0.3
                }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.15,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </svg>
        
        {/* 分数显示 */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="text-2xl font-bold text-primary">
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
