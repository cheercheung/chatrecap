import React from 'react';
import { useTranslations } from 'next-intl';
import HeartRatioChart from '@/components/ui/heartratiochart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import styles from '@/styles/overview-cards.module.css';

interface WordRatioCardProps {
  totalWords: number;
  sender1: {
    name: string;
    words: number;
  };
  sender2: {
    name: string;
    words: number;
  };
  color1?: string;
  color2?: string;
  className?: string;
}

const WordRatioCard: React.FC<WordRatioCardProps> = ({
  totalWords,
  sender1,
  sender2,
  color1 = "#ff4d4f",  // 默认红色
  color2 = "#1890ff",  // 默认蓝色
  className
}) => {
  const t = useTranslations('results');
  const metricsT = useTranslations('results.metrics');

  // 计算百分比
  const sender1Percentage = totalWords > 0
    ? Math.round((sender1.words / totalWords) * 100)
    : 0;
  const sender2Percentage = totalWords > 0
    ? Math.round((sender2.words / totalWords) * 100)
    : 0;

  return (
    <div className={`${styles.wordRatioCard} ${className}`}>
      <div className={styles.cardTitle}>
        {metricsT('total_words')}
      </div>

      <div className={styles.cardContent}>
        <div className="text-4xl font-bold text-primary mb-3">
          {totalWords}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-16 h-16 cursor-help">
                <HeartRatioChart
                  value1={sender1.words}
                  value2={sender2.words}
                  color1={color1}
                  color2={color2}
                  size={64}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-4 bg-background/95 backdrop-blur-sm border border-primary/10 shadow-lg rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }}></div>
                  <span className="font-medium">{sender1.name}:</span>
                  <span>{sender1.words} words ({sender1Percentage}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }}></div>
                  <span className="font-medium">{sender2.name}:</span>
                  <span>{sender2.words} words ({sender2Percentage}%)</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default WordRatioCard;
