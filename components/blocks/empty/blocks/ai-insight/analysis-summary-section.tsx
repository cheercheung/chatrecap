"use client";

import React from "react";
import { AnalysisData } from "@/types/analysis";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import ActionButtons from "@/components/blocks/chat-recap-result/action-buttons";

interface AnalysisSummarySectionProps {
  analysisData?: AnalysisData;
  messageTips?: string[];
  suggestedTopics?: string[];
}

const AnalysisSummarySection: React.FC<AnalysisSummarySectionProps> = ({
  analysisData
}) => {

  if (!analysisData) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header with navigation and actions */}
      <ActionButtons />

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
        />

        <TextAnalysisBlock
          textAnalysis={analysisData.textAnalysis}
        />

        <TimeAnalysisBlock
          timeAnalysis={analysisData.timeAnalysis}
        />
      </div>
    </div>
  );
};

export default AnalysisSummarySection;
