"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface AnimatedStarRatingProps {
  title: string;
  score: number;
  maxScore: number;
  content: string;
  className?: string;
}

export const AnimatedStarRating: React.FC<AnimatedStarRatingProps> = ({
  title,
  score,
  maxScore,
  content,
  className,
}) => {
  // 创建星星数组
  const stars = Array.from({ length: maxScore }, (_, i) => i + 1);

  // 星星动画变体
  const starVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1 * i,
      },
    }),
    hover: { scale: 1.2, rotate: 15, transition: { duration: 0.2 } },
  };

  // 分数文本动画变体
  const scoreVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.5
      }
    },
  };

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${className}`}>
      {/* 左侧：星级评分 */}
      <div className="flex-shrink-0 space-y-4 w-64">
        {/* 星星显示 */}
        <div className="flex justify-center gap-2">
          {stars.map((star) => (
            <motion.div
              key={star}
              custom={star}
              variants={starVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Star
                size={32}
                className={star <= score ? "fill-primary text-primary" : "text-muted"}
              />
            </motion.div>
          ))}
        </div>

        {/* 分数显示 */}
        <motion.div
          variants={scoreVariants}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <div className="text-3xl font-bold text-primary din-numbers">
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
