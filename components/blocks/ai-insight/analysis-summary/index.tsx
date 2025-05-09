"use client";

import React from "react";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import AiInsightActionButtons from "@/components/blocks/ai-insight/action-buttons";
import { AnalysisSummaryProps } from "./types";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Analysis Summary Block Component
 *
 * Displays a comprehensive summary of chat analysis including timeline,
 * overview, text analysis, and time analysis.
 */
const AnalysisSummaryBlock: React.FC<AnalysisSummaryProps> = ({
  analysisData,
  className
}) => {
  const t = useTranslations("ai-insights");
  const resultsT = useTranslations("results");
  const commonT = useTranslations("common");

  return (
    <div className={`w-full ${className}`}>
      {/* Header with navigation and actions - 使用AI Insight专用的ActionButtons */}
      <AiInsightActionButtons />

      {/* 标题和数据保留提示 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
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

      {/* Timeline Block */}
      <StoryTimelineBlock
        startDate={analysisData.startDate}
        duration={analysisData.duration}
        endDate={analysisData.endDate}
      />

      {/* Analysis Blocks */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">{resultsT("overview_title")}</h2>
          <div className="[&_h2]:hidden">
            <OverviewBlock
              overview={analysisData.overview}
              timeAnalysis={analysisData.timeAnalysis}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">{resultsT("text_analysis_title")}</h2>
          <div className="[&_h2]:hidden">
            <TextAnalysisBlock
              textAnalysis={analysisData.textAnalysis}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">{resultsT("time_analysis_title")}</h2>
          <div className="[&_h2]:hidden">
            <TimeAnalysisBlock
              timeAnalysis={analysisData.timeAnalysis}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummaryBlock;
