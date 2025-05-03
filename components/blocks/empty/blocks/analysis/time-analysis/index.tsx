"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { TimeAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import { Clock, Calendar, MessageSquare } from 'lucide-react';
import { TimeDistribution, LineChart, Heatmap } from '@/components/charts';
import HighlightedText from '@/components/ui/highlighted-text';

type Props = {
  timeAnalysis: TimeAnalysis;
};

const TimeAnalysisBlock = forwardRef<HTMLDivElement, Props>(
  ({ timeAnalysis }, ref) => {
    const t = useTranslations('chatrecapresult');

    // 将小时转换为可读时间
    const formatHour = (hour: number) => {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h = hour % 12 || 12;
      return `${h} ${ampm}`;
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
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
          {t('time_analysis_title')}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full"></span>
        </h2>

        <div className="space-y-6">
          {/* Peak Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Most Active Hour */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('most_active_hour')}</div>
                <div className="text-xl font-bold">{formatHour(timeAnalysis.mostActiveHour)}</div>
                <div className="text-xs text-muted-foreground">{t('peak_activity_time')}</div>
              </div>
            </div>

            {/* Most Active Day */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('most_active_day')}</div>
                <div className="text-xl font-bold">{t(timeAnalysis.mostActiveDay)}</div>
                <div className="text-xs text-muted-foreground">{t('favorite_day_to_chat')}</div>
              </div>
            </div>

            {/* Busiest Date */}
            <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm flex items-center">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('busiest_date')}</div>
                <div className="text-xl font-bold">{formatDate(timeAnalysis.mostActiveDate)}</div>
                <div className="text-xs text-muted-foreground">
                  {t('messages_count', { count: timeAnalysis.mostMessagesCount })}
                </div>
              </div>
            </div>
          </div>

          {/* Time Distribution */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-lg font-medium text-foreground mb-4 text-center">{t('time_distribution')}</div>
            <div className="mb-4">
              <TimeDistribution
                data={timeAnalysis.timeDistribution}
                className="w-full h-30"
              />
            </div>
            <div className="bg-background/50 rounded-md p-4 text-muted-foreground">
              <p className="text-center">
                <HighlightedText
                  text={t('time_distribution_description', {
                    morning: (timeAnalysis.timeDistribution.find(t => t.time === 'Morning')?.percentage || 0) + '%',
                    afternoon: (timeAnalysis.timeDistribution.find(t => t.time === 'Afternoon')?.percentage || 0) + '%',
                    evening: (timeAnalysis.timeDistribution.find(t => t.time === 'Evening')?.percentage || 0) + '%'
                  })}
                />
              </p>
              <p className="mt-2 text-center">
                <HighlightedText
                  text={t('response_pattern_description', {
                    // 处理响应模式的翻译
                    responsePattern: '"' + (
                      timeAnalysis.responsePattern === "Consistent response times throughout the day" ?
                      t('response_patterns.consistent') :
                      timeAnalysis.responsePattern === "Quick responses in evening, slower in morning" ?
                      t('response_patterns.evening_active') :
                      timeAnalysis.responsePattern === "More active in morning than evening" ?
                      t('response_patterns.morning_active') :
                      timeAnalysis.responsePattern
                    ) + '"',
                    conversationLength: '"' + timeAnalysis.conversationLength + '"'
                  })}
                />
              </p>
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-lg font-medium text-foreground mb-4 text-center">{t('daily_activity')}</div>
            <div className="mb-4">
              <LineChart
                data={timeAnalysis.dailyActivity}
                height={300}
                tooltipUnit="messages"
                className="w-full"
              />
            </div>
            <div className="bg-background/50 rounded-md p-4 text-muted-foreground">
              <p className="text-center">
                <HighlightedText
                  text={t('daily_activity_description', {
                    mostActiveDay: t(timeAnalysis.mostActiveDay),
                    mostActiveHour: formatHour(timeAnalysis.mostActiveHour)
                  })}
                />
              </p>
            </div>
          </div>

          {/* Weekly Heatmap */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-lg font-medium text-foreground mb-4 text-center">{t('weekly_activity_heatmap')}</div>
            {timeAnalysis.weekdayHourHeatmap &&
             timeAnalysis.weekdayHourHeatmap.length > 0 &&
             timeAnalysis.weekdayHourHeatmap.every(day =>
                day && day.day && Array.isArray(day.hours) && day.hours.length > 0
             ) ? (
              <Heatmap
                data={timeAnalysis.weekdayHourHeatmap.map(day => ({
                  ...day,
                  day: t(day.day)
                }))}
                showValues={true}
                showLegend={true}
                className="w-full"
              />
            ) : (
              <div className="bg-background/50 rounded-md p-4 text-muted-foreground text-center">
                <p>{t('heatmap_data_not_available')}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

TimeAnalysisBlock.displayName = 'TimeAnalysisBlock';
export default TimeAnalysisBlock;
