"use client";

import React, { forwardRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { TimeAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import { Clock, Calendar, MessageSquare } from 'lucide-react';
import { TimeDistribution, LineChart, Heatmap } from '@/components/charts';

type Props = {
  timeAnalysis: TimeAnalysis;
};

const TimeAnalysisBlock = forwardRef<HTMLDivElement, Props>(
  ({ timeAnalysis }, ref) => {
    const t = useTranslations('results');
    const commonT = useTranslations('common');
    const locale = useLocale();

    // 将小时转换为可读时间 (使用当前语言环境)
    const formatHour = (hour: number) => {
      try {
        // 创建当天的日期对象，设置小时
        const date = new Date();
        date.setHours(hour, 0, 0, 0);

        // 使用当前语言环境格式化时间
        return new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          hour12: true
        }).format(date);
      } catch (error) {
        // 回退到简单格式
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h} ${ampm}`;
      }
    };

    // 格式化日期 (使用当前语言环境)
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      } catch (error) {
        // 如果出错，返回原始字符串
        return dateString;
      }
    };

    return (
      <div
        ref={ref}
        className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-md flex flex-col items-center"
      >
        {/* zhe */}

        <div className="space-y-6">
          {/* Row 1: Weekly Heatmap */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-lg font-medium text-foreground mb-4 text-center">{t('weekly_activity_heatmap')}</div>
            {timeAnalysis.weekdayHourHeatmap &&
             timeAnalysis.weekdayHourHeatmap.length > 0 &&
             timeAnalysis.weekdayHourHeatmap.every(day =>
                day && day.day && Array.isArray(day.hours) && day.hours.length > 0
             ) ? (
              <Heatmap
                data={timeAnalysis.weekdayHourHeatmap}
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

          {/* Row 2: Daily Activity (Line Chart) */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-lg font-medium text-foreground mb-4 text-center">{t('daily_activity')}</div>
            <div>
              <LineChart
                data={timeAnalysis.dailyActivity}
                height={300}
                tooltipUnit="messages"
                className="w-full"
              />
            </div>
          </div>

          {/* Row 3: Peak Activity Stats (3 Cards) */}
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
                <div className="text-xl font-bold">
                  {commonT(`days_of_week.${timeAnalysis.mostActiveDay}`)}
                </div>
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
                  {t('total_messages', { count: timeAnalysis.mostMessagesCount })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Time Distribution (Bar Chart) */}
          <div className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <div className="text-lg font-medium text-foreground mb-4 text-center">{t('time_distribution')}</div>
            <div>
              <TimeDistribution
                data={timeAnalysis.timeDistribution}
                className="w-full h-30"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TimeAnalysisBlock.displayName = 'TimeAnalysisBlock';
export default TimeAnalysisBlock;
