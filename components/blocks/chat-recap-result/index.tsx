"use client";

import React from "react";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import { Home, Bell } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChatRecapResultProps } from "./types";
import ActionButtons from "./action-buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  // 使用新的翻译系统，指定正确的命名空间
  const t = useTranslations("results");
  const commonT = useTranslations("common");

  // Use the start date from the analysis data as submission date
  const submissionDate = new Date(analysisData.startDate);

  // Format the timestamp as 'h:mm am/pm m/d/y'
  const formattedTime = submissionDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = `${submissionDate.getMonth() + 1}/${submissionDate.getDate()}/${submissionDate.getFullYear()}`;
  const submissionTime = `${formattedTime} ${formattedDate}`;

  return (
    <div className={`w-full py-6 ${className}`}>
      <div className="container max-w-4xl mx-auto px-1">
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

        {/* Row 3: Action Buttons */}
        <ActionButtons />

        {/* Row 4: 数据保留提示 */}
        <div className="flex items-center justify-end mb-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Bell className="h-5 w-5 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{commonT("data_retention_notice")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Row 5: 分析内容 */}
        <div className="space-y-4">
          {/* 标题 */}
          <h1 className="text-3xl font-bold text-center mb-4">{t("title")}</h1>

          {/* Overview Block */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("overview_title")}</h2>
            <div className="[&_h2]:hidden">
              <OverviewBlock
                overview={analysisData.overview}
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>
          </div>

          {/* Time Analysis Block */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("time_analysis_title")}</h2>
            <div className="[&_h2]:hidden">
              <TimeAnalysisBlock
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>
          </div>

          {/* Text Analysis Block */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("text_analysis_title")}</h2>
            <div className="[&_h2]:hidden">
              <TextAnalysisBlock
                textAnalysis={analysisData.textAnalysis}
              />
            </div>
          </div>

          {/* Timeline Block (Storyline) */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("story_timeline_title")}</h2>
            <div className="[&_h2]:hidden">
              <StoryTimelineBlock
                startDate={analysisData.startDate}
                duration={analysisData.duration}
                endDate={analysisData.endDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRecapResultBlock;
