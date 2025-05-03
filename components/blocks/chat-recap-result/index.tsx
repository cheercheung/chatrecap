"use client";

import React from "react";
import {
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import ActionButtonsBlock from "./action-buttons";
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
  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="container max-w-4xl mx-auto px-4">
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
  );
};

export default ChatRecapResultBlock;
