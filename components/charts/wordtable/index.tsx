import React from 'react';
import styles from './TopWordsTable.module.css';

interface WordItem {
  word: string;
  count: number;
}

interface TopWordsTableProps {
  words: WordItem[];
  excludeWordFn?: (word: string) => boolean;
  maxRows?: number;
  className?: string;
}

/**
 * 常用词表格组件
 */
export const TopWordsTable: React.FC<TopWordsTableProps> = ({
  words,
  excludeWordFn,
  maxRows = 15,
  className,
}) => {
  // 过滤并限制表格行数
  const filteredWords = words
    .filter(wordData => !excludeWordFn || !excludeWordFn(wordData.word))
    .slice(0, maxRows);

  // 如果没有有效的词，显示提示信息
  if (filteredWords.length === 0) {
    return <div className={styles.emptyTable}>No meaningful words found</div>;
  }

  return (
    <div className={`${styles.topWordsContainer} ${className || ''}`}>
      <div className={styles.topWordsTable}>
        <div className={styles.topWordsHeader}>
          <div className={styles.topWordsRank}>#</div>
          <div className={styles.topWordsWord}>Word</div>
          <div className={styles.topWordsCount}>Count</div>
        </div>
        
        <div className={styles.topWordsList}>
          {filteredWords.map((word, index) => (
            <div key={index} className={styles.topWordsRow}>
              <div className={styles.topWordsRank}>{index + 1}</div>
              <div className={styles.topWordsWord}>{word.word}</div>
              <div className={styles.topWordsCount}>{word.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopWordsTable; 