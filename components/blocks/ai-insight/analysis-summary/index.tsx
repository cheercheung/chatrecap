"use client";

import React from "react";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock
} from "@/components/blocks/analysis";
import AiInsightActionButtons from "@/components/blocks/ai-insight/action-buttons";
import { AnalysisSummaryProps } from "./types";
import { useTranslations } from "next-intl";
import { Home, Bell } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams } from "next/navigation";

/**
 * Analysis Summary Block Component
 *
 * Displays a comprehensive summary of chat analysis including timeline,
 * overview, text analysis, and time analysis.
 * Structured to match the ChatRecapResultBlock layout.
 */
const AnalysisSummaryBlock: React.FC<AnalysisSummaryProps> = ({
  analysisData,
  className
}) => {
  const t = useTranslations("ai-insights");
  const resultsT = useTranslations("results");
  const commonT = useTranslations("common");
  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId') || 'unknown';

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
      <div className="container max-w-5xl mx-auto px-0">
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
        <AiInsightActionButtons />

        {/* Row 4: 标题和数据保留提示 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{resultsT("title")}</h1>
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
        <div className="space-y-6">
          {/* Overview Block */}
          <div>
            <h2 className="text-2xl font-bold mb-1">{resultsT("overview_title")}</h2>
            <div className="[&_h2]:hidden">
              <OverviewBlock
                overview={analysisData.overview}
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>
          </div>

          {/* Time Analysis Block */}
          <div>
            <h2 className="text-2xl font-bold mb-1">{resultsT("time_analysis_title")}</h2>
            <div className="[&_h2]:hidden">
              <TimeAnalysisBlock
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>
          </div>

          {/* Text Analysis Block */}
          <div>
            <h2 className="text-2xl font-bold mb-1">{resultsT("text_analysis_title")}</h2>
            <div className="[&_h2]:hidden">
              <TextAnalysisBlock
                textAnalysis={analysisData.textAnalysis}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummaryBlock;
