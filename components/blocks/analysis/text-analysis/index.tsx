"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { TextAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import { WordCloud } from '@/components/charts';
import CustomBarChart from '@/components/charts/custom-barchart';
import styles from '@/styles/analysis-containers.module.css';

type Props = {
  textAnalysis: TextAnalysis;
  filterMeaningfulWords?: (word: string) => boolean;
};

const TextAnalysisBlock = forwardRef<HTMLDivElement, Props>(
  ({ textAnalysis, filterMeaningfulWords }, ref) => {
    const t = useTranslations('results');

    // 过滤有意义的词（如果提供了过滤函数）
    const filteredCommonWords = filterMeaningfulWords
      ? textAnalysis.commonWords.filter(item => filterMeaningfulWords(item.word))
      : textAnalysis.commonWords;

    // 直接使用原始数据，不进行翻译
    const getSentimentDescription = (score: number) => {
      if (score >= 0.7) return 'Very Positive';
      if (score >= 0.5) return 'Positive';
      if (score >= 0.3) return 'Neutral';
      if (score >= 0.1) return 'Negative';
      return 'Very Negative';
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={styles.textAnalysisBlock}
      >

        <div className="space-y-6">
          {/* Row 1: Three Cards - Common Words, Emojis, and Sentiment Analysis */}
          <div className={styles.threeColumnGrid}>
            {/* Common Words Card */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('common_words')}</div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground">{t('total_unique_words')}</div>
                <div className="text-2xl font-bold text-primary">
                  {filteredCommonWords.length}
                  <span className="text-sm ml-1 text-muted-foreground">{t('words')}</span>
                </div>
              </div>
            </div>

            {/* Emojis Card */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('emojis')}</div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground">{t('total_emojis')}</div>
                <div className="text-2xl font-bold text-primary">
                  {textAnalysis.topEmojis.reduce((sum, item) => sum + item.count, 0)}
                  <span className="text-sm ml-1 text-muted-foreground">{t('emojis')}</span>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis Card */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('sentiment_analysis')}</div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground">{t('overall_sentiment')}</div>
                <div className="text-2xl font-bold text-primary">
                  {getSentimentDescription(textAnalysis.sentimentScore)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('sentiment_score')}: {(textAnalysis.sentimentScore * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Word Cloud */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
            <div className="text-lg font-medium text-foreground mb-3 text-center">{t('word_cloud')}</div>
            <div className="h-64 w-full relative">
              <WordCloud
                words={filteredCommonWords}
                excludeWordFn={filterMeaningfulWords}
                maxWords={80}
                maxFontSize={2.0}
                minFontSize={0.7}
                useRandomRotation={false}
                colorMode="opacity"
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Row 3: Common Words Bar Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <CustomBarChart
                data={textAnalysis.sender1.commonWords.map(item => ({ label: item.word, value: item.count }))}
                maxItems={8}
                title="Top Words"
                className="w-full"
              />
            </div>

            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <CustomBarChart
                data={textAnalysis.sender2.commonWords.map(item => ({ label: item.word, value: item.count }))}
                maxItems={8}
                title="Top Words"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 4: Emoji Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <CustomBarChart
                data={textAnalysis.sender1.topEmojis}
                isEmoji={true}
                maxItems={8}
                title="Top Emojis"
                className="w-full"
              />
            </div>

            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <CustomBarChart
                data={textAnalysis.sender2.topEmojis}
                isEmoji={true}
                maxItems={8}
                title="Top Emojis"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

TextAnalysisBlock.displayName = 'TextAnalysisBlock';
export default TextAnalysisBlock;
