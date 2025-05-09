"use client";

import React, { forwardRef, useState } from 'react';
import { TextAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import WordCloudLib from '@/components/charts/wordcloud-lib';
import CustomBarChart from '@/components/charts/custom-barchart';
import styles from '@/styles/analysis-containers.module.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Extracted CSS for toggle buttons
const toggleContainerStyle = "flex items-center text-sm border rounded-md overflow-hidden shadow-sm";
const toggleButtonStyle = (isActive: boolean) =>
  `px-3 py-1 transition-all duration-200 ${isActive
    ? 'bg-primary text-white font-medium'
    : 'bg-background hover:bg-gray-100 text-foreground'}`;

type Props = {
  textAnalysis: TextAnalysis;
  filterMeaningfulWords?: (word: string) => boolean;
};

const TextAnalysisBlock = forwardRef<HTMLDivElement, Props>(
  ({ textAnalysis, filterMeaningfulWords }, ref) => {
    // State to track whether to show emoji or words for both senders
    const [showEmoji, setShowEmoji] = useState(false);

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
          {/* Content Area */}

          {/* Card 1: Word Cloud */}
          <div className={styles.contentCard}>
            <div className={styles.cardTitle}>Word Cloud</div>
            <div className="h-64 w-full relative p-4">
              {textAnalysis.commonWords && textAnalysis.commonWords.length > 0 ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <WordCloudLib
                    words={textAnalysis.commonWords.slice(0, 20).map(item => ({
                      word: item.word,
                      count: item.count
                    }))}
                    maxWords={20}
                    width={800}
                    height={250}
                    fontSize={(word) => {
                      // Find max and min counts
                      const maxCount = Math.max(...textAnalysis.commonWords.slice(0, 20).map(w => w.count));
                      const minCount = Math.min(...textAnalysis.commonWords.slice(0, 20).map(w => w.count));

                      // Calculate font size range (20px to 100px)
                      const minFontSize = 20;
                      const maxFontSize = 100;
                      const range = maxFontSize - minFontSize;

                      // If only one word or all words have the same count, use medium size
                      if (maxCount === minCount) {
                        return (minFontSize + maxFontSize) / 2;
                      }

                      // Calculate font size (linear mapping)
                      const fontSize = minFontSize + (word.count - minCount) / (maxCount - minCount) * range;
                      return fontSize;
                    }}
                    fontFamily="system-ui, sans-serif"
                    fontWeight="normal"
                    padding={5}
                    rotate={(_word) => {
                      // Random rotation angle between -15 and 15 degrees
                      return Math.floor(Math.random() * 30) - 15;
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No words to display
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Bar Charts with Toggle */}
          <div className={styles.contentCard} style={{ width: '800px', height: '400px', margin: '0 auto' }}>
            <div className={styles.cardTitle}>
              {showEmoji ? `Top Emojis` : `Top Words`}
            </div>

            {/* Toggle buttons */}
            <div className="flex justify-center items-center mb-4 mt-2">
              <div className="bg-background/70 rounded-lg px-4 py-1.5 border border-primary/5 shadow-sm flex items-center">
                <div className="text-sm font-medium mr-2">Display Mode:</div>
                <div className={toggleContainerStyle}>
                  <button
                    onClick={() => setShowEmoji(false)}
                    className={toggleButtonStyle(!showEmoji)}
                  >
                    Words
                  </button>
                  <button
                    onClick={() => setShowEmoji(true)}
                    className={toggleButtonStyle(showEmoji)}
                  >
                    Emoji
                  </button>
                </div>
              </div>
            </div>

            {/* Bar charts with sender-specific colors - consistent styling */}
            <div className="w-full px-6 flex flex-row space-x-8 pb-4" style={{ height: '200px' }}>

              {/* First sender's chart with custom color from theme */}
              <div className="w-1/2">
                <div className="text-center font-medium mb-3" style={{ color: 'var(--sender1-color)' }}>
                  {textAnalysis.sender1.name}
                </div>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <CustomBarChart
                    data={showEmoji
                      ? textAnalysis.sender1.topEmojis.slice(0, 5)
                      : textAnalysis.sender1.commonWords.map(item => ({ label: item.word, value: item.count })).slice(0, 5)}
                    isEmoji={showEmoji}
                    maxItems={5}
                    className="w-full"
                    senderType="sender1"
                  />
                </div>
              </div>
              {/* Second sender's chart with custom color from theme - identical structure */}
              <div className="w-1/2">
                <div className="text-center font-medium mb-3" style={{ color: 'var(--sender2-color)' }}>
                  {textAnalysis.sender2.name}
                </div>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <CustomBarChart
                    data={showEmoji
                      ? textAnalysis.sender2.topEmojis.slice(0, 5)
                      : textAnalysis.sender2.commonWords.map(item => ({ label: item.word, value: item.count })).slice(0, 5)}
                    isEmoji={showEmoji}
                    maxItems={5}
                    className="w-full"
                    senderType="sender2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Sentiment Gauge */}
          <div className={styles.contentCard} style={{ width: '800px', margin: '0 auto' }}>
            <div className={styles.cardTitle}>Sentiment Analysis</div>
            <div className="w-full p-6 flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                {/* Left side: Circular gauge */}
                <div className="flex-shrink-0 flex items-center justify-center w-full md:w-40">
                  <div className="w-32 h-32">
                    <CircularProgressbar
                      value={textAnalysis.sentimentScore * 100}
                      text={`${(textAnalysis.sentimentScore * 100).toFixed(0)}%`}
                      className="din-numbers"
                      styles={buildStyles({
                        textSize: '1.5rem',
                        pathColor: 'hsl(var(--primary))',
                        textColor: 'hsl(var(--foreground))',
                        trailColor: 'hsl(var(--muted))',
                      })}
                    />
                  </div>
                </div>

                {/* Right side: Sentiment description */}
                <div className="flex-1 bg-background/50 rounded-lg p-4 border border-primary/5">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-foreground">
                      {getSentimentDescription(textAnalysis.sentimentScore)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This conversation has an overall {getSentimentDescription(textAnalysis.sentimentScore).toLowerCase()} sentiment.
                      The sentiment score is calculated based on the emotional tone of the messages exchanged between both participants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

TextAnalysisBlock.displayName = 'TextAnalysisBlock';
export default TextAnalysisBlock;
