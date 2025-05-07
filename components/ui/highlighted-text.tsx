"use client";

import React from 'react';
import { useSafeTranslation } from '@/components/i18n/safe-translation';

interface HighlightedTextProps {
  text: string;
  highlightClassName?: string;
}

/**
 * 高亮文本组件
 * 将文本中的特定部分高亮显示
 *
 * @example
 * <HighlightedText
 *   text="Your conversations have a sentiment score of 78%, which indicates a Very Positive emotional tone."
 *   highlightClassName="text-primary font-semibold"
 * />
 */
const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlightClassName = "text-primary font-semibold"
}) => {
  // 使用 try-catch 包装翻译获取，防止翻译缺失导致错误
  let veryPositive = 'Very Positive';
  let positive = 'Positive';
  let neutral = 'Neutral';
  let negative = 'Negative';
  let veryNegative = 'Very Negative';
  let morning = 'Morning';
  let afternoon = 'Afternoon';
  let evening = 'Evening';
  let quickResponses = 'Quick Responses';
  let mediumConversations = 'Medium Conversations';

  // 使用安全翻译钩子，尝试多个命名空间
  const t = useSafeTranslation(['components.highlighted_text'], {
    very_positive: veryPositive,
    positive: positive,
    neutral: neutral,
    negative: negative,
    very_negative: veryNegative,
    morning: morning,
    afternoon: afternoon,
    evening: evening,
    quick_responses: quickResponses,
    medium_conversations: mediumConversations
  });

  // 获取翻译的文本
  veryPositive = t('very_positive');
  positive = t('positive');
  neutral = t('neutral');
  negative = t('negative');
  veryNegative = t('very_negative');
  morning = t('morning');
  afternoon = t('afternoon');
  evening = t('evening');
  quickResponses = t('quick_responses');
  mediumConversations = t('medium_conversations');

  if (!text) return null;

  // 构建正则表达式模式
  const pattern = new RegExp(`(\\b\\d+%?\\b|${veryPositive}|${positive}|${neutral}|${negative}|${veryNegative}|${morning}|${afternoon}|${evening}|${quickResponses}|${mediumConversations})`, 'gi');

  // 使用正则表达式查找需要高亮的部分（数字、百分比和情感描述）
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        // 检查是否是需要高亮的部分
        const shouldHighlight = pattern.test(part);
        // 重置正则表达式的lastIndex
        pattern.lastIndex = 0;

        return shouldHighlight ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          part
        );
      })}
    </>
  );
};

export default HighlightedText;
