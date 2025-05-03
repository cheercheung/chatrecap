"use client";

import React from "react";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import ActionButtons from "@/components/blocks/chat-recap-result/action-buttons";
import { AnalysisSummaryProps } from "./types";

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
  return (
    <div className={`w-full ${className}`}>
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

export default AnalysisSummaryBlock;
