"use client";

import React from "react";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChatRecapResultProps } from "./types";

/**
 * Chat Recap Result Block Component
 *
 * Displays a comprehensive analysis of chat data including timeline,
 * overview, text analysis, and time analysis.
 */
const ChatRecapResultBlock: React.FC<ChatRecapResultProps> = ({
  analysisData,
  className
}) => {
  const router = useRouter();
  const t = useTranslations("chatrecapresult");
  const componentT = useTranslations("components");
  const resultsT = useTranslations("results");

  // 创建一个格式化的时间戳，类似于 "5/8/2025, 4:07:49 AM"
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const submissionTime = `${formattedDate}, ${formattedTime}`;

  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="container max-w-4xl mx-auto px-4">
        {/* Row 1: 导航面包屑 */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4 mr-1" />
          </Link>
          <span className="mx-2">→</span>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span className="mx-2">→</span>
          <span className="text-primary font-medium">cmaedegiq0j7br95zd8nit7w</span>
        </div>

        {/* Row 2: 时间戳 */}
        <div className="text-xl font-bold mb-6">
          Analysis {submissionTime}
        </div>

        {/* Row 3: 3个按钮 */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              {'Try AI analyze as guest'}
            </Button>

            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {'Sign in for more AI Analysis'}
              <ArrowRight size={16} />
            </Button>
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push('/chatrecapanalysis')}
          >
            {'New Analysis'}
          </Button>
        </div>

        {/* Row 4: 数据保留提示 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 text-sm text-yellow-800 dark:text-yellow-200">
          {'We do not store your chat history, the cached data on our server will be automatically deleted after 30 minutes. Please start a new analysis if expired.'}
        </div>

        {/* Row 5: 分析内容 */}
        <div className="space-y-8">
          {/* 标题 */}
          <h1 className="text-3xl font-bold text-center mb-6">{'Your Chat Recap Result'}</h1>

          {/* Overview Block */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{'Overview'}</h2>
            <OverviewBlock
              overview={analysisData.overview}
              timeAnalysis={analysisData.timeAnalysis}
            />
          </div>

          {/* Time Analysis Block */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{'Time Analysis'}</h2>
            <TimeAnalysisBlock
              timeAnalysis={analysisData.timeAnalysis}
            />
          </div>

          {/* Text Analysis Block */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{'Text Analysis'}</h2>
            <TextAnalysisBlock
              textAnalysis={analysisData.textAnalysis}
            />
          </div>

          {/* Timeline Block (Storyline) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{'Storyline'}</h2>
            <StoryTimelineBlock
              startDate={analysisData.startDate}
              duration={analysisData.duration}
              endDate={analysisData.endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRecapResultBlock;
