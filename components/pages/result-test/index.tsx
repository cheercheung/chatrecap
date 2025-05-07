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

interface ResultTestPageProps {
  analysisData: AnalysisData;
  mappedInsights: Array<{ title: string; content: string }>;
  translations: {
    chatrecap: {
      title: string;
      description: string;
      overview_title: string;
      text_analysis_title: string;
      time_analysis_title: string;
    };
    aiInsight: {
      title: string;
      description: string;
      personality_insights: {
        title: string;
        description: string;
      };
      relationship_metrics_hearts: {
        title: string;
        description: string;
      };
    };
  };
}

/**
 * Result Test Page Component
 * 
 * A test page component that uses the new translation scheme
 */
const ResultTestPage: React.FC<ResultTestPageProps> = ({ 
  analysisData,
  mappedInsights,
  translations
}) => {
  return (
    <main>
      <div className="w-full py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{translations.chatrecap.title}</h1>
            <p className="text-muted-foreground">{translations.chatrecap.description}</p>
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
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{translations.chatrecap.overview_title}</h2>
              <OverviewBlock
                overview={analysisData.overview}
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{translations.chatrecap.text_analysis_title}</h2>
              <TextAnalysisBlock
                textAnalysis={analysisData.textAnalysis}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{translations.chatrecap.time_analysis_title}</h2>
              <TimeAnalysisBlock
                timeAnalysis={analysisData.timeAnalysis}
              />
            </div>

            {/* AI Insights Section */}
            {analysisData.aiInsights && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">{translations.aiInsight.title}</h2>
                <p className="text-muted-foreground mb-6">{translations.aiInsight.description}</p>
                
                <div className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4">{translations.aiInsight.personality_insights.title}</h3>
                  <p className="mb-6">{translations.aiInsight.personality_insights.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-4">{translations.aiInsight.relationship_metrics_hearts.title}</h3>
                  <p className="mb-6">{translations.aiInsight.relationship_metrics_hearts.description}</p>
                  
                  <div className="space-y-4">
                    {mappedInsights.map((insight, index) => (
                      <div key={index} className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
                        <h4 className="font-medium mb-2">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResultTestPage;
