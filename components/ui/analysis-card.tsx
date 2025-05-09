"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTranslations } from 'next-intl';

interface AnalysisCardProps {
  titleKey?: string;
  contentKey?: string;
  title?: string;
  content?: string;
  percentage: number;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  titleKey,
  contentKey,
  title,
  content,
  percentage,
  className,
}) => {
  const t = useTranslations('chatrecapresult');

  // 获取主题色（使用CSS变量）
  const primaryColor = 'hsl(var(--primary))';

  // 如果提供了翻译键，则使用翻译文本，否则使用直接提供的文本
  const displayTitle = titleKey ? t(`${titleKey}.title`) : title;
  const displayContent = contentKey ? t(`${contentKey}.content`) : content;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">{displayTitle}</h3>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧：百分比圆环 */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-40">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                className="din-numbers"
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: primaryColor,
                  textColor: 'hsl(var(--foreground))',
                  trailColor: 'hsl(var(--muted))',
                })}
              />
            </div>
          </div>

          {/* 右侧：分析内容 */}
          <div className="flex-1 bg-background/50 rounded-lg p-4">
            <div className="text-muted-foreground space-y-2">
              {displayContent && displayContent.split('\n').map((paragraph, index) => (
                <p key={index} className="text-sm">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { AnalysisCard };
