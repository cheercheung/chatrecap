"use client";

import React from 'react';

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
  if (!text) return null;

  // 使用正则表达式查找需要高亮的部分（数字、百分比和情感描述）
  const parts = text.split(/(\b\d+%?\b|Very Positive|Positive|Neutral|Negative|Very Negative|morning|afternoon|evening|Quick responses|Medium to long conversations)/gi);

  return (
    <>
      {parts.map((part, index) => {
        // 检查是否是需要高亮的部分
        const shouldHighlight = /(\b\d+%?\b|Very Positive|Positive|Neutral|Negative|Very Negative|morning|afternoon|evening|Quick responses|Medium to long conversations)/gi.test(part);

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
