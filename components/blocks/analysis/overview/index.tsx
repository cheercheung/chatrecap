"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { Overview, TimeAnalysis } from '@/types/analysis';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  overview: Overview;
  timeAnalysis?: TimeAnalysis;
};

/**
 * 卡片样式常量
 *
 * 用于统一管理所有卡片的样式，便于一次性修改
 *
 * 样式分为三类：
 * 1. 普通卡片样式 - 用于常规数据展示（如Response Time, Messages Per Day）
 * 2. 宽卡片样式 - 用于重要数据展示（如Total Messages）
 * 3. 用户数据卡片样式 - 用于展示用户对比数据（如Messages Per User, Words Per User）
 */
const CARD_STYLES = {
  // 普通卡片容器 - 用于常规数据展示的卡片外层容器
  container: "bg-background/70 rounded-lg py-5 px-6 border border-primary/5 shadow-sm",

  // 宽卡片容器 - 用于重要数据展示的卡片外层容器，垂直内边距更大
  wideContainer: "bg-background/70 rounded-lg py-6 px-8 border border-primary/5 shadow-sm",

  // 普通卡片标题 - 用于常规卡片的标题
  title: "text-base font-medium text-muted-foreground mb-2 text-center",

  // 宽卡片标题 - 用于重要卡片的标题，字体更大，下边距更大
  wideTitle: "text-lg font-medium text-muted-foreground mb-4 text-center",

  // 普通数值 - 用于展示常规数据的数值
  value: "text-4xl font-bold text-primary",

  // 宽卡片数值 - 用于展示重要数据的数值，字体更大
  wideValue: "text-6xl font-bold text-primary",

  // 用户数据数值 - 用于展示用户数据的数值，使用粉色突出显示
  userValue: "text-5xl font-bold text-pink-500 mb-2",

  // 普通描述文本 - 用于数值下方的描述文本
  description: "text-sm text-muted-foreground",

  // 宽卡片描述文本 - 用于重要数据下方的描述文本，字体更大，有上边距
  wideDescription: "text-base text-muted-foreground mt-2",

  // 用户数据容器 - 用于包含两个用户数据的容器，左右对齐
  userContainer: "flex justify-between px-4 mt-4",

  // 数值容器 - 用于包含数值和描述的容器，垂直居中对齐
  valueContainer: "flex flex-col items-center"
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
        {/* Row 1: Total Messages Card (Full Width) */}
        <div className="w-full">
          <div className={CARD_STYLES.wideContainer}>
            <div className={CARD_STYLES.wideTitle}>{'Total Messages'}</div>
            <div className={CARD_STYLES.valueContainer}>
              <div className={CARD_STYLES.wideValue}>{overview.totalMessages}</div>
              <div className={CARD_STYLES.wideDescription}>{'messages exchanged'}</div>
            </div>
          </div>
        </div>

        {/* Row 2 & 3: Two-column cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">

          {/* Sender Messages Card */}
          <div className={CARD_STYLES.container}>
            <div className={CARD_STYLES.title}>{'Messages Per User'}</div>
            <div className={CARD_STYLES.userContainer}>
              <div className="text-center">
                <div className={CARD_STYLES.userValue}>{overview.sender1.messages}</div>
                <div className={CARD_STYLES.description}>
                  {overview.sender1.name}
                </div>
              </div>
              <div className="text-center">
                <div className={CARD_STYLES.userValue}>{overview.sender2.messages}</div>
                <div className={CARD_STYLES.description}>
                  {overview.sender2.name}
                </div>
              </div>
            </div>
          </div>

          {/* Sender Words Card */}
          <div className={CARD_STYLES.container}>
            <div className={CARD_STYLES.title}>{'Words Per User'}</div>
            <div className={CARD_STYLES.userContainer}>
              <div className="text-center">
                <div className={CARD_STYLES.userValue}>{overview.sender1.words}</div>
                <div className={CARD_STYLES.description}>
                  {overview.sender1.name}
                </div>
              </div>
              <div className="text-center">
                <div className={CARD_STYLES.userValue}>{overview.sender2.words}</div>
                <div className={CARD_STYLES.description}>
                  {overview.sender2.name}
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Card */}
          <div className={CARD_STYLES.container}>
            <div className={CARD_STYLES.title}>{'Response Time'}</div>
            <div className={CARD_STYLES.valueContainer}>
              <div className={CARD_STYLES.value}>{overview.responseTime}</div>
              <div className={CARD_STYLES.description}>{'average response time'}</div>
            </div>
          </div>

          {/* Messages Per Day Card */}
          <div className={CARD_STYLES.container}>
            <div className={CARD_STYLES.title}>{'Messages Per Day'}</div>
            <div className={CARD_STYLES.valueContainer}>
              <div className={CARD_STYLES.value}>{overview.avgMessagesPerDay.toFixed(1)}</div>
              <div className={CARD_STYLES.description}>{'average messages per day'}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

OverviewBlock.displayName = 'OverviewBlock';
export default OverviewBlock;
