"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

interface FeatureItemProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  titleKey?: string;
  contentKey?: string;
  className?: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  content,
  icon,
  titleKey,
  contentKey,
  className,
}) => {
  const t = useTranslations('chatrecapresult');
  
  // 如果提供了翻译键，则使用翻译文本，否则使用直接提供的文本
  const displayTitle = titleKey ? t(`features.${titleKey}.title`) : title;
  const displayContent = contentKey ? t(`features.${contentKey}.content`) : content;
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h3 className="text-lg font-semibold">{displayTitle}</h3>
      </div>
      <p className="text-muted-foreground">{displayContent}</p>
    </div>
  );
};
