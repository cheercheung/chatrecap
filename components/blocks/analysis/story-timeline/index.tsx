"use client";

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import HighlightedText from '@/components/ui/highlighted-text';

type Props = {
  startDate: string;
  duration: number;
  endDate: string;
  title?: string;
};

const StoryTimelineBlock = forwardRef<HTMLDivElement, Props>(
  ({ startDate, duration, endDate, title }, ref) => {
    const t = useTranslations('chatrecapresult');

    // 直接使用传入的日期字符串，不进行格式化
    const formattedStartDate = startDate;
    const formattedEndDate = endDate;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-col items-center py-8 px-4 mb-8 bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl shadow-md"
      >
        {/* <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center relative inline-block">
          {title || t('story_timeline_title')}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full"></span>
        </h2> */}

        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          <HighlightedText
            text={t('timespan_summary', {
              startDate: formattedStartDate,
              duration: duration,
              endDate: formattedEndDate
            })}
          />
        </p>

        <div className="relative flex justify-between items-center w-full max-w-3xl">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-pink-500 transform -translate-y-1/2 rounded-full"></div>

          {/* Start point */}
          <div className="relative flex flex-col items-center z-10">
            <div className="text-sm md:text-base font-medium mb-2 text-primary">{formattedStartDate}</div>
            <div className="w-5 h-5 rounded-full bg-primary shadow-glow-sm"></div>
            <div className="mt-2 text-xs md:text-sm text-muted-foreground">{t('first_message')}</div>
          </div>

          {/* Duration */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 bg-primary/10 px-4 py-1 rounded-full text-sm font-medium text-primary border border-primary/20">
            {duration} {t('days')}
          </div>

          {/* End point */}
          <div className="relative flex flex-col items-center z-10">
            <div className="text-sm md:text-base font-medium mb-2 text-pink-500">{formattedEndDate}</div>
            <div className="w-5 h-5 rounded-full bg-pink-500 shadow-glow-sm"></div>
            <div className="mt-2 text-xs md:text-sm text-muted-foreground">{t('last_message')}</div>
          </div>
        </div>
      </motion.div>
    );
  }
);

StoryTimelineBlock.displayName = 'StoryTimelineBlock';
export default StoryTimelineBlock;
