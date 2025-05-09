"use client";

import React from "react";
import { AnalysisData } from "@/types/analysis";
import AnalysisSummaryBlock from "@/components/blocks/ai-insight/analysis-summary";
import AiInsightBlock from "@/components/blocks/ai-insight";
import { FeatureItem } from "@/components/blocks/ai-insight/types";

interface AiInsightResultPageProps {
  analysisData: AnalysisData;
  mappedInsights: FeatureItem[];
}

/**
 * AI Insight Result Page Component
 *
 * A complete page component that displays the AI analysis results,
 * including basic analysis summary and detailed AI insights.
 */
const AiInsightResultPage: React.FC<AiInsightResultPageProps> = ({
  analysisData,
  mappedInsights
}) => {
  // Ensure aiInsights and required properties exist in analysisData
  if (!analysisData || !analysisData.aiInsights) {
    return null;
  }

  const { personalityInsights, relationshipMetrics } = analysisData.aiInsights;

  // 检查必要的数据是否存在
  if (!personalityInsights || !relationshipMetrics) {
    console.error("Missing required AI insights data:", {
      hasPersonalityInsights: !!personalityInsights,
      hasRelationshipMetrics: !!relationshipMetrics
    });
    return (
      <main className="max-w-[98%] mx-auto py-6 px-0 space-y-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700">Data is incomplete</h2>
          <p className="mt-2 text-red-600">AI analysis result is incomplete, please contact customer service for help.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[98%] mx-auto py-6 px-0 space-y-4">
      {/* Analysis Summary Block */}
      <AnalysisSummaryBlock
        analysisData={analysisData}
      />

      {/* AI Insight Block */}
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
    </main>
  );
};

export default AiInsightResultPage;
