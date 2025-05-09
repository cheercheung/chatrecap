"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { Overview, TimeAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';

import MessageRatioCard from './message-ratio-card';
import WordRatioCard from './word-ratio-card';
import WordsPerMessageCard from './words-per-message-card';
import styles from '@/styles/analysis-containers.module.css';

type Props = {
  overview: Overview;
  timeAnalysis?: TimeAnalysis;
};

const OverviewBlock = forwardRef<HTMLDivElement, Props>(({ overview }, ref) => {

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={styles.overviewBlock}
    >
      {/* <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center relative inline-block mx-auto">
        {t('overview_title')}
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full"></span>
      </h2> */}

      <div className="space-y-4">
        {/* Row 1: Three cards in a row with custom width distribution */}
        <div className="grid grid-cols-12 gap-4">
          {/* Total Messages Card with Heart Ratio Chart (25% Width) */}
          <div className="col-span-12 sm:col-span-4">
            <MessageRatioCard
              totalMessages={overview.totalMessages}
              sender1={{
                name: overview.sender1.name,
                messages: overview.sender1.messages
              }}
              sender2={{
                name: overview.sender2.name,
                messages: overview.sender2.messages
              }}
              color1="#ff4d4f"
              color2="#1890ff"
            />
          </div>

          {/* Total Words Card with Heart Ratio Chart (25% Width) */}
          <div className="col-span-12 sm:col-span-4">
            <WordRatioCard
              totalWords={overview.totalWords}
              sender1={{
                name: overview.sender1.name,
                words: overview.sender1.words
              }}
              sender2={{
                name: overview.sender2.name,
                words: overview.sender2.words
              }}
              color1="#ff4d4f"
              color2="#1890ff"
            />
          </div>

          {/* Words Per Message Card (50% Width) */}
          <div className="col-span-12 sm:col-span-4">
            <WordsPerMessageCard
              sender1={{
                name: overview.sender1.name,
                wordsPerMessage: overview.sender1.wordsPerMessage
              }}
              sender2={{
                name: overview.sender2.name,
                wordsPerMessage: overview.sender2.wordsPerMessage
              }}
              color1="#ff4d4f"
              color2="#1890ff"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OverviewBlock.displayName = 'OverviewBlock';
export default OverviewBlock;
