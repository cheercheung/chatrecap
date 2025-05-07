"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { Overview, TimeAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';

type Props = {
  overview: Overview;
  timeAnalysis?: TimeAnalysis;
};

const OverviewBlock = forwardRef<HTMLDivElement, Props>(({ overview, timeAnalysis }, ref) => {
  const t = useTranslations('chatrecapresult');

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
        {t('overview_title')}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full"></span>
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Messages Section */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-2 text-center">{t('messages')}</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">{overview.totalMessages}</div>
              <div className="text-xs text-muted-foreground">{t('total_messages')}</div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{overview.sender1.messages}</div>
                <div className="text-xs text-muted-foreground">
                  {overview.sender1.name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{overview.sender2.messages}</div>
                <div className="text-xs text-muted-foreground">
                  {overview.sender2.name}
                </div>
              </div>
            </div>
          </div>

          {/* Words Section */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-2 text-center">{t('words')}</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">{overview.totalWords}</div>
              <div className="text-xs text-muted-foreground">{t('total_words')}</div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{overview.sender1.words}</div>
                <div className="text-xs text-muted-foreground">
                  {overview.sender1.name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{overview.sender2.words}</div>
                <div className="text-xs text-muted-foreground">
                  {overview.sender2.name}
                </div>
              </div>
            </div>
          </div>

          {/* Words Per Message Section */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-2 text-center">{t('words_per_message')}</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">{overview.wordsPerMessage}</div>
              <div className="text-xs text-muted-foreground">{t('words_per_message')}</div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{overview.sender1.wordsPerMessage}</div>
                <div className="text-xs text-muted-foreground">
                  {overview.sender1.name}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{overview.sender2.wordsPerMessage}</div>
                <div className="text-xs text-muted-foreground">
                  {overview.sender2.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Story */}
        <div className="mt-6">
          <div className="bg-background/70 rounded-lg p-5 border border-primary/5 shadow-sm text-muted-foreground">
            <div className="mb-3">
              {t.rich('overview_story_part1', {
                // 直接使用原始数据，不进行翻译
                totalMessages: overview.totalMessages,
                sender1Name: overview.sender1.name,
                sender1Messages: overview.sender1.messages,
                sender2Name: overview.sender2.name,
                sender2Messages: overview.sender2.messages,
                span: (chunks) => <span className="highlight">{chunks}</span>
              })}
            </div>
            <div className="mb-3">
              {t.rich('overview_story_part2', {
                // 直接使用原始数据，不进行翻译
                totalWords: overview.totalWords,
                sender1Name: overview.sender1.name,
                sender1Words: overview.sender1.words,
                sender2Name: overview.sender2.name,
                sender2Words: overview.sender2.words,
                wordsPerMessage: overview.wordsPerMessage,
                span: (chunks) => <span className="highlight">{chunks}</span>
              })}
            </div>
            <div>
              {t.rich('overview_story_part3', {
                // 直接使用原始数据，不进行翻译
                mostActiveDay: overview.mostActiveDay,
                mostActiveHour: timeAnalysis ? timeAnalysis.mostActiveHour.toString() : '--',
                avgMessagesPerDay: overview.avgMessagesPerDay.toFixed(1),
                responseTime: overview.responseTime,
                span: (chunks) => <span className="highlight">{chunks}</span>
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OverviewBlock.displayName = 'OverviewBlock';
export default OverviewBlock;
