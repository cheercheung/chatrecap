import React from 'react';
import { useTranslations } from 'next-intl';

interface WordsPerMessageCardProps {
  sender1: {
    name: string;
    wordsPerMessage: number;
  };
  sender2: {
    name: string;
    wordsPerMessage: number;
  };
  color1?: string;
  color2?: string;
  className?: string;
}

const WordsPerMessageCard: React.FC<WordsPerMessageCardProps> = ({
  sender1,
  sender2,
  color1 = "#ff4d4f",  // 默认红色
  color2 = "#1890ff",  // 默认蓝色
  className
}) => {
  const t = useTranslations('results');

  return (
    <div className={`bg-background/70 rounded-lg py-3 px-2 border border-primary/5 shadow-sm h-[200px] ${className}`}>
      <div className="text-xl font-medium text-muted-foreground mb-2 text-center">
        Words Per Message
      </div>

      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-primary mb-3 opacity-0">
          {/* 隐藏的占位元素，用于保持与其他卡片相同的高度 */}
          0
        </div>

        <div className="w-full grid grid-cols-5 items-center px-0">
          <div className="col-span-2 flex flex-col items-start">
            <div className="text-6xl font-bold" style={{ color: color1 }}>
              {sender1.wordsPerMessage.toFixed(1)}
            </div>
            <div className="text-base text-muted-foreground mt-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color1 }}></div>
              <span className="font-medium">{sender1.name}</span>
            </div>
          </div>

          <div className="col-span-1 flex justify-center">
            <div className="text-4xl font-medium text-muted-foreground">vs</div>
          </div>

          <div className="col-span-2 flex flex-col items-end">
            <div className="text-6xl font-bold" style={{ color: color2 }}>
              {sender2.wordsPerMessage.toFixed(1)}
            </div>
            <div className="text-base text-muted-foreground mt-3 flex items-center gap-2 justify-end">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color2 }}></div>
              <span className="font-medium">{sender2.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordsPerMessageCard;
