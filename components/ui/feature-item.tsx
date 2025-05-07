"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { useSafeTranslation } from '@/components/i18n/safe-translation';

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
  // 使用安全翻译钩子，尝试多个命名空间
  const t = useSafeTranslation(['features', '']);

  // 如果提供了翻译键，则使用翻译文本，否则使用直接提供的文本
  const displayTitle = titleKey ? t(`${titleKey}.title`, title) : title;
  const displayContent = contentKey ? t(`${contentKey}.content`, content) : content;

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
