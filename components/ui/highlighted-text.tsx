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
  const t = useTranslations('components.highlighted_text');

  if (!text) return null;

  // 获取翻译的文本
  const veryPositive = t('very_positive');
  const positive = t('positive');
  const neutral = t('neutral');
  const negative = t('negative');
  const veryNegative = t('very_negative');
  const morning = t('morning');
  const afternoon = t('afternoon');
  const evening = t('evening');
  const quickResponses = t('quick_responses');
  const mediumConversations = t('medium_conversations');

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
