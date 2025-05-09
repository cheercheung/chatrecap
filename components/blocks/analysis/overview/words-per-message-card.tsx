import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/overview-cards.module.css';

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
  const metricsT = useTranslations('results.metrics');

  return (
    <div className={`${styles.wordsPerMessageCard} ${className}`}>
      <div className={styles.cardTitle}>
        {metricsT('words_per_message')}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.wordsPerMessageGrid}>
          <div className={styles.senderColumnLeft}>
            <div className={`${styles.valueText} din-numbers`} style={{ color: color1 }}>
              {sender1.wordsPerMessage.toFixed(1)}
            </div>
            <div className={styles.senderInfo}>
              <div className={styles.colorDot} style={{ backgroundColor: color1 }}></div>
              <span className={styles.senderName}>{sender1.name}</span>
            </div>
          </div>

          <div className={styles.vsColumn}>
            <div className={styles.vsText}>vs</div>
          </div>

          <div className={styles.senderColumnRight}>
            <div className={`${styles.valueText} din-numbers`} style={{ color: color2 }}>
              {sender2.wordsPerMessage.toFixed(1)}
            </div>
            <div className={styles.senderInfoRight}>
              <div className={styles.colorDot} style={{ backgroundColor: color2 }}></div>
              <span className={styles.senderName}>{sender2.name}</span>
            </div>
          </div>
          <div className={styles.hiddenPlaceholder}>
            {/* 隐藏的占位元素，用于保持与其他卡片相同的高度 */}
            0
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordsPerMessageCard;
