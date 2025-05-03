"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { TextAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import { WordCloud, TopWordsTable, BarChart } from '@/components/charts';
import HighlightedText from '@/components/ui/highlighted-text';

type Props = {
  textAnalysis: TextAnalysis;
  filterMeaningfulWords?: (word: string) => boolean;
};

const TextAnalysisBlock = forwardRef<HTMLDivElement, Props>(
  ({ textAnalysis, filterMeaningfulWords }, ref) => {
    const t = useTranslations('chatrecapresult');

    // 过滤有意义的词（如果提供了过滤函数）
    const filteredCommonWords = filterMeaningfulWords
      ? textAnalysis.commonWords.filter(item => filterMeaningfulWords(item.word))
      : textAnalysis.commonWords;

    // 获取情感分析的描述
    const getSentimentDescription = (score: number) => {
      if (score >= 0.7) return t('sentiment_very_positive');
      if (score >= 0.5) return t('sentiment_positive');
      if (score >= 0.3) return t('sentiment_neutral');
      if (score >= 0.1) return t('sentiment_negative');
      return t('sentiment_very_negative');
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-md flex flex-col items-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center relative inline-block mx-auto">
          {t('text_analysis_title')}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full"></span>
        </h2>

        <div className="space-y-6">
          {/* Common Words and Emojis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Words Card */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('common_words')}</div>
              <div className="flex flex-col items-center mb-4">
                <div className="text-sm text-muted-foreground">{t('total_unique_words')}</div>
                <div className="text-2xl font-bold text-primary">
                  {filteredCommonWords.length}
                  <span className="text-sm ml-1 text-muted-foreground">{t('words')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-background/50 rounded-md p-3">
                  <div className="text-sm font-medium text-foreground mb-2 text-center">{textAnalysis.sender1.name}</div>
                  <div className="space-y-1 text-center">
                    {textAnalysis.sender1.commonWords.slice(0, 3).map((item, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {item.word} <span className="text-xs">({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background/50 rounded-md p-3">
                  <div className="text-sm font-medium text-foreground mb-2 text-center">{textAnalysis.sender2.name}</div>
                  <div className="space-y-1 text-center">
                    {textAnalysis.sender2.commonWords.slice(0, 3).map((item, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {item.word} <span className="text-xs">({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emojis Card */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('emojis')}</div>
              <div className="flex flex-col items-center mb-4">
                <div className="text-sm text-muted-foreground">{t('total_emojis')}</div>
                <div className="text-2xl font-bold text-primary">
                  {textAnalysis.topEmojis.reduce((sum, item) => sum + item.count, 0)}
                  <span className="text-sm ml-1 text-muted-foreground">{t('emojis')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="bg-background/50 rounded-md p-3">
                  <div className="text-sm font-medium text-foreground mb-2 text-center">{textAnalysis.sender1.name}</div>
                  <div className="space-y-1 text-center">
                    {textAnalysis.sender1.topEmojis.slice(0, 3).map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.emoji} <span className="text-xs text-muted-foreground">({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background/50 rounded-md p-3">
                  <div className="text-sm font-medium text-foreground mb-2 text-center">{textAnalysis.sender2.name}</div>
                  <div className="space-y-1 text-center">
                    {textAnalysis.sender2.topEmojis.slice(0, 3).map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.emoji} <span className="text-xs text-muted-foreground">({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
            <div className="text-lg font-medium text-foreground mb-3 text-center">{t('sentiment_analysis')}</div>
            <div className="flex flex-col items-center mb-4">
              <div className="text-sm text-muted-foreground">{t('overall_sentiment')}</div>
              <div className="text-2xl font-bold text-primary">
                {getSentimentDescription(textAnalysis.sentimentScore)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('sentiment_score')}: {(textAnalysis.sentimentScore * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-background/50 rounded-md p-4 text-muted-foreground w-full">
              <p className="text-center">
                <HighlightedText
                  text={t('sentiment_description', {
                    sentimentScore: (textAnalysis.sentimentScore * 100).toFixed(0) + '%',
                    sentimentDescription: getSentimentDescription(textAnalysis.sentimentScore)
                  })}
                />
              </p>
            </div>
          </div>

          {/* Word Cloud & Top Words */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
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

            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('top_words')}</div>
              <TopWordsTable
                words={filteredCommonWords.slice(0, 10)}
                className="h-64 overflow-auto w-full"
              />
            </div>
          </div>

          {/* Emoji Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('top_emojis', { name: textAnalysis.sender1.name })}</div>
              <BarChart
                data={textAnalysis.sender1.topEmojis}
                isEmoji={true}
                maxItems={8}
                className="h-64 w-full"
              />
            </div>

            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex flex-col items-center">
              <div className="text-lg font-medium text-foreground mb-3 text-center">{t('top_emojis', { name: textAnalysis.sender2.name })}</div>
              <BarChart
                data={textAnalysis.sender2.topEmojis}
                isEmoji={true}
                maxItems={8}
                className="h-64 w-full"
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
