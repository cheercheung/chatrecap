"use client";

import React from "react";
import { AnalysisData } from "@/types/analysis";
import AnalysisSummaryBlock from "@/components/blocks/ai-insight/analysis-summary";
import AiInsightBlock from "@/components/blocks/ai-insight";
import { FeatureItem } from "@/components/blocks/ai-insight/types";

interface StaticAiInsightResultPageProps {
  analysisData: AnalysisData;
  mappedInsights: FeatureItem[];
}

/**
 * Static AI Insight Result Page Component
 *
 * An optimized version of the AI insight result page for sample data.
 * This component is designed to be lightweight and fast to render.
 */
const StaticAiInsightResultPage: React.FC<StaticAiInsightResultPageProps> = ({
  analysisData,
  mappedInsights
}) => {
  const { personalityInsights, relationshipMetrics } = analysisData.aiInsights!;

  return (
    <main>
      {/* Analysis Summary Block */}
      <AnalysisSummaryBlock
        analysisData={analysisData}
      />

      {/* AI Insight Block */}
      <div className="container max-w-5xl mx-auto px-0 py-6">
        <AiInsightBlock
          data={{
            personalityInsights,
            relationshipMetrics,
            insights: {
              interaction: mappedInsights,
              relationship: mappedInsights
            }
          }}
        />
      </div>
    </main>
  );
};

export default StaticAiInsightResultPage;
