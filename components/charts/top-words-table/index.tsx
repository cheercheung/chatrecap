"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface WordItem {
  word: string;
  count: number;
}

interface TopWordsTableProps {
  words: WordItem[];
  className?: string;
  title?: string;
  maxItems?: number;
}

/**
 * 高频词汇表格组件
 */
const TopWordsTable: React.FC<TopWordsTableProps> = ({
  words,
  className,
  title,
  maxItems = 10
}) => {
  // 获取翻译
  const t = useTranslations('chatrecapresult');

  const displayWords = words.slice(0, maxItems);

  if (displayWords.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{t('no_words_found')}</div>;
  }

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div className="bg-background/70 rounded-lg border border-primary/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/10">
              <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">#</th>
              <th className="py-2 px-3 text-left text-sm font-medium text-muted-foreground">{t('word')}</th>
              <th className="py-2 px-3 text-right text-sm font-medium text-muted-foreground">{t('count')}</th>
            </tr>
          </thead>
          <tbody>
            {displayWords.map((word, index) => (
              <tr
                key={index}
                className="border-b border-primary/5 hover:bg-primary/5 transition-colors"
              >
                <td className="py-2 px-3 text-sm text-muted-foreground">{index + 1}</td>
                <td className="py-2 px-3 text-sm font-medium">{word.word}</td>
                <td className="py-2 px-3 text-sm text-right text-muted-foreground">{word.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopWordsTable;
