"use client";

import React from "react";
import RadarComparisonBlock from "@/components/blocks/ai-insight/radar-comparison";
import SenderAnalysisBlock from "@/components/blocks/ai-insight/sender-analysis";
import RelationshipMetricsHeartsBlock from "@/components/blocks/ai-insight/relationship-metrics-hearts";
import InsightsFeaturesBlock from "@/components/blocks/ai-insight/insights-features";
import { AiInsightBlockProps } from "./types";

/**
 * AI Insight Block Component
 *
 * A comprehensive block that displays AI-generated insights about communication patterns
 * between two people, including radar comparison, individual sender analysis,
 * relationship metrics, and detailed insights.
 */
const AiInsightBlock: React.FC<AiInsightBlockProps> = ({ data, className }) => {
  const { personalityInsights, relationshipMetrics, insights } = data;
  const { sender1, sender2 } = personalityInsights;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 1. Radar Comparison Chart */}
      <RadarComparisonBlock
        sender1={sender1}
        sender2={sender2}
      />

      {/* 2. Sender1 Analysis */}
      <SenderAnalysisBlock
        data={sender1}
      />

      {/* 3. Sender2 Analysis */}
      <SenderAnalysisBlock
        data={sender2}
      />

      {/* 4. Relationship Metrics Hearts Visualization */}
      <RelationshipMetricsHeartsBlock
        relationshipMetrics={relationshipMetrics}
      />

      {/* 5. Insights Features */}
      <InsightsFeaturesBlock
        interactionInsights={insights.interaction}
        relationshipInsights={insights.relationship}
      />
    </div>
  );
};

export default AiInsightBlock;
