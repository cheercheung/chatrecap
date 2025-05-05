"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

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

  try {
    const t = useTranslations('components.highlighted_text');

    // 尝试获取翻译的文本，如果不存在则使用默认值
    veryPositive = t('very_positive') || veryPositive;
    positive = t('positive') || positive;
    neutral = t('neutral') || neutral;
    negative = t('negative') || negative;
    veryNegative = t('very_negative') || veryNegative;
    morning = t('morning') || morning;
    afternoon = t('afternoon') || afternoon;
    evening = t('evening') || evening;
    quickResponses = t('quick_responses') || quickResponses;
    mediumConversations = t('medium_conversations') || mediumConversations;
  } catch (error) {
    console.warn('Translation for highlighted text not found, using defaults');
  }

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
