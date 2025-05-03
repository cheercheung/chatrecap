"use client";

import React from "react";
import { AnalysisData } from "@/types/analysis";
import { 
  OverviewBlock,
  TextAnalysisBlock,
  TimeAnalysisBlock,
  StoryTimelineBlock
} from "@/components/blocks/analysis";
import ActionButtonsBlock from "@/components/blocks/chat-recap-result/action-buttons";

interface StaticChatRecapResultPageProps {
  analysisData: AnalysisData;
}

/**
 * Static Chat Recap Result Page Component
 * 
 * An optimized version of the chat recap result page for sample data.
 * This component is designed to be lightweight and fast to render.
 */
const StaticChatRecapResultPage: React.FC<StaticChatRecapResultPageProps> = ({ 
  analysisData 
}) => {
  return (
    <main>
      <div className="w-full py-8">
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
    </main>
  );
};

export default StaticChatRecapResultPage;
