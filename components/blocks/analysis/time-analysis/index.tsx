"use client";

import React, { forwardRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { TimeAnalysis } from '@/types/analysis';
import { Clock, Calendar, MessageSquare } from 'lucide-react';
import { TimeDistribution, LineChart, Heatmap } from '@/components/charts';
import styles from '@/styles/analysis-containers.module.css';

type Props = {
  timeAnalysis: TimeAnalysis;
};

const TimeAnalysisBlock = forwardRef<HTMLDivElement, Props>(
  ({ timeAnalysis }, ref) => {
    const commonT = useTranslations('common');
    const metricsT = useTranslations('results.metrics');
    const t = useTranslations('results');
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
        className={styles.timeAnalysisBlock}
      >
        {/* zhe */}

        <div className="space-y-8">
          {/* Row 1: Daily Activity (Line Chart) */}
          <div className={styles.contentCard}>
            <div className={styles.cardTitle}>Daily Message Volume</div>
            <div style={{
              minHeight: '180px',
              width: '100%',
              maxWidth: '100%',
              overflow: 'visible',
              padding: '5px 0'
            }}>
              {timeAnalysis.dailyActivity && timeAnalysis.dailyActivity.length > 0 ? (
                <>
                  <LineChart
                    data={timeAnalysis.dailyActivity}
                    height={160}
                    tooltipUnit="messages"
                    className="w-full"
                    title=""
                  />
                  <p className="text-center text-muted-foreground mt-4 text-sm italic">
                    {t('timespan_summary', {
                      startDate: formatDate(timeAnalysis.dailyActivity[0]?.date || ''),
                      duration: `${timeAnalysis.dailyActivity.length} days`,
                      endDate: formatDate(timeAnalysis.dailyActivity[timeAnalysis.dailyActivity.length - 1]?.date || '')
                    })}
                  </p>
                </>
              ) : (
                <div className="bg-background/50 rounded-md p-4 text-muted-foreground text-center">
                  <p>no data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Weekly Heatmap */}
          <div className={styles.contentCard}>
            <div className={styles.cardTitle}>Weekly Activity Heatmap</div>
            {timeAnalysis.weekdayHourHeatmap &&
             timeAnalysis.weekdayHourHeatmap.length > 0 &&
             timeAnalysis.weekdayHourHeatmap.every(day =>
                day && day.day && Array.isArray(day.hours) && day.hours.length > 0
             ) ? (
              <Heatmap
                data={timeAnalysis.weekdayHourHeatmap}
                showValues={false}
                showLegend={true}
                className="w-full"
              />
            ) : (
              <div className="bg-background/50 rounded-md p-4 text-muted-foreground text-center">
                <p>no data yet</p>
              </div>
            )}
          </div>

          {/* Row 3: Time Distribution (Two Column Layout) */}
          <div className={styles.contentCard}>
            <div className={styles.cardTitle}>Time Distribution</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              {/* Left Column: Pie Chart (3/5 width) */}
              <div className="md:col-span-3 flex items-center justify-center">
                <div className="w-full max-w-[350px]">
                  <TimeDistribution
                    data={timeAnalysis.timeDistribution}
                    className="w-full"
                    height={220}
                  />
                </div>
              </div>

              {/* Right Column: Stats Cards (vertically arranged) (2/5 width) */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                {/* Most Active Hour */}
                <div className={styles.statCard}>
                  <div className={styles.iconContainer}>
                    <Clock className={styles.icon} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{metricsT('most_active_hour')}</div>
                    <div className="text-xl font-bold">{formatHour(timeAnalysis.mostActiveHour)}</div>
                    <div className="text-xs text-muted-foreground">{metricsT('peak_activity_time')}</div>
                  </div>
                </div>

                {/* Most Active Day */}
                <div className={styles.statCard}>
                  <div className={styles.iconContainer}>
                    <Calendar className={styles.icon} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{metricsT('most_active_day')}</div>
                    <div className="text-xl font-bold">
                      {commonT(`days_of_week.${timeAnalysis.mostActiveDay}`)}
                    </div>
                    <div className="text-xs text-muted-foreground">{metricsT('favorite_day_to_chat')}</div>
                  </div>
                </div>

                {/* Busiest Date */}
                <div className={styles.statCard}>
                  <div className={styles.iconContainer}>
                    <MessageSquare className={styles.icon} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{metricsT('busiest_date')}</div>
                    <div className="text-xl font-bold">{formatDate(timeAnalysis.mostActiveDate)}</div>
                    <div className="text-xs text-muted-foreground">
                      {metricsT('total_messages', { count: timeAnalysis.mostMessagesCount })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TimeAnalysisBlock.displayName = 'TimeAnalysisBlock';
export default TimeAnalysisBlock;
