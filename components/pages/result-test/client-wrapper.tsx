"use client";

import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { AnalysisData } from "@/types/analysis";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import ActionButtonsBlock from "@/components/blocks/chat-recap-result/action-buttons";

interface ClientWrapperProps {
  analysisData: AnalysisData;
  messages: Record<string, any>;
  locale: string;
}

/**
 * Client Wrapper Component for Result Test
 *
 * This component wraps the analysis blocks with NextIntlClientProvider
 * to provide translation context using the new translation scheme.
 */
const ResultTestClientWrapper: React.FC<ClientWrapperProps> = ({
  analysisData,
  messages,
  locale
}) => {
  // 这里的关键是将我们的翻译消息放在 chatrecapresult 命名空间下
  // 因为所有组件都使用 useTranslations('chatrecapresult') 来获取翻译
  return (
    <NextIntlClientProvider locale={locale} messages={{ chatrecapresult: messages }}>
      <main>
        <div className="w-full py-8">
          <div className="container max-w-4xl mx-auto px-4">
            {/* 页面标题 */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">{messages.title}</h1>
              <p className="text-muted-foreground">{messages.description}</p>
            </div>

            {/* Header with navigation and actions */}
            <ActionButtonsBlock />

            {/* Timeline Block */}
            <StoryTimelineBlock
              startDate={analysisData.startDate}
              duration={analysisData.duration}
              endDate={analysisData.endDate}
            />

            {/* Analysis Blocks */}
            <div className="space-y-8">
              <OverviewBlock
                overview={analysisData.overview}
                timeAnalysis={analysisData.timeAnalysis}
              />

              <TextAnalysisBlock
                textAnalysis={analysisData.textAnalysis}
              />

              <TimeAnalysisBlock
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>
          </div>
        </div>
      </main>
    </NextIntlClientProvider>
  );
};

export default ResultTestClientWrapper;
