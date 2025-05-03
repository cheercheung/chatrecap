"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HeartMatchRatingProps {
  title?: string;
  score: number;
  maxScore?: number;
  content?: string;
  className?: string;
  titleKey?: string;
  compact?: boolean;
}

export const HeartMatchRating: React.FC<HeartMatchRatingProps> = ({
  title,
  score,
  maxScore = 10,
  content,
  className,
  titleKey,
  compact = false,
}) => {
  const t = useTranslations('chatrecapresult');

  // 创建心形数组
  const hearts = Array.from({ length: maxScore }, (_, i) => i + 1);

  // 如果提供了翻译键，则使用翻译文本，否则使用直接提供的文本
  const displayTitle = titleKey ? t(`relationship_metrics.${titleKey}`) : title;

  if (compact) {
    return (
      <div className={`flex flex-col ${className}`}>
        {/* 标题 */}
        <h3 className="text-lg font-semibold mb-3">{displayTitle}</h3>

        {/* 心形评分显示 */}
        <div className="flex flex-wrap gap-1 mb-2">
          {hearts.map((heart, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.05 * index
              }}
              whileHover={{ scale: 1.2 }}
            >
              <Heart
                size={20}
                className={index < score ? "fill-primary text-primary" : "text-primary"}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}

          {/* 分数显示 */}
          <motion.div
            className="ml-1 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="text-sm font-medium text-primary">
              {score}/{maxScore}
            </span>
          </motion.div>
        </div>

        {/* 内容 */}
        {content && <p className="text-sm text-muted-foreground">{content}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${className}`}>
      {/* 左侧：心形匹配度 */}
      <div className="relative w-64 flex-shrink-0">
        {/* 背景区域 */}
        <div className="rounded-lg bg-primary/5 p-6 flex flex-col items-center">
          {/* 心形评分显示 */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {hearts.map((heart, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 * index
                }}
                whileHover={{ scale: 1.2 }}
              >
                <Heart
                  size={28}
                  className={index < score ? "fill-primary text-primary" : "text-primary"}
                  strokeWidth={1.5}
                />
              </motion.div>
            ))}
          </div>

          {/* 分数显示 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="text-2xl font-bold text-primary">
              {score}/{maxScore}
            </div>
          </motion.div>
        </div>

        {/* 脉动光环 */}
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 右侧：标题和内容 */}
      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-semibold">{displayTitle}</h3>
        {content && <p className="text-muted-foreground">{content}</p>}
      </div>
    </div>
  );
};
