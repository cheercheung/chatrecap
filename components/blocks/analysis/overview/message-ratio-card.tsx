import React from 'react';
import { useTranslations } from 'next-intl';
import HeartRatioChart from '@/components/ui/heartratiochart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import styles from '@/styles/overview-cards.module.css';

interface MessageRatioCardProps {
  totalMessages: number;
  sender1: {
    name: string;
    messages: number;
  };
  sender2: {
    name: string;
    messages: number;
  };
  color1?: string;
  color2?: string;
  className?: string;
}

const MessageRatioCard: React.FC<MessageRatioCardProps> = ({
  totalMessages,
  sender1,
  sender2,
  color1 = "#ff4d4f",  // 默认红色
  color2 = "#1890ff",  // 默认蓝色
  className
}) => {
  const t = useTranslations('results');
  const metricsT = useTranslations('results.metrics');

  // 计算百分比
  const sender1Percentage = totalMessages > 0
    ? Math.round((sender1.messages / totalMessages) * 100)
    : 0;
  const sender2Percentage = totalMessages > 0
    ? Math.round((sender2.messages / totalMessages) * 100)
    : 0;

  return (
    <div className={`${styles.messageRatioCard} ${className}`}>
      <div className={styles.cardTitle}>
        {metricsT('total_messages')}
      </div>

      <div className={styles.cardContent}>
        <div className="text-4xl font-bold text-primary mb-3 din-numbers">
          {totalMessages}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-16 h-16 cursor-help">
                <HeartRatioChart
                  value1={sender1.messages}
                  value2={sender2.messages}
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
                  <span>{sender1.messages} messages ({sender1Percentage}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }}></div>
                  <span className="font-medium">{sender2.name}:</span>
                  <span>{sender2.messages} messages ({sender2Percentage}%)</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MessageRatioCard;
