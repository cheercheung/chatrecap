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

  // 检查personalityInsights是否存在
  if (!personalityInsights) {
    console.error("personalityInsights is undefined in AiInsightBlock");
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">无法显示个性分析数据，数据不完整。</p>
        </div>
      </div>
    );
  }

  const { sender1, sender2 } = personalityInsights;

  // 检查sender1和sender2是否存在
  if (!sender1 || !sender2) {
    console.error("sender1 or sender2 is undefined in personalityInsights", {
      hasSender1: !!sender1,
      hasSender2: !!sender2
    });
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">无法显示发送者分析数据，数据不完整。</p>
        </div>

        {/* 仍然显示关系指标和洞察，如果它们存在 */}
        {relationshipMetrics && (
          <RelationshipMetricsHeartsBlock
            relationshipMetrics={relationshipMetrics}
          />
        )}

        {insights && (
          <InsightsFeaturesBlock
            interactionInsights={insights.interaction}
            relationshipInsights={insights.relationship}
          />
        )}
      </div>
    );
  }

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
      {relationshipMetrics ? (
        <RelationshipMetricsHeartsBlock
          relationshipMetrics={relationshipMetrics}
        />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-600">关系指标数据不可用。</p>
        </div>
      )}

      {/* 5. Insights Features */}
      {insights && insights.interaction && insights.relationship ? (
        <InsightsFeaturesBlock
          interactionInsights={insights.interaction}
          relationshipInsights={insights.relationship}
        />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-600">洞察数据不可用。</p>
        </div>
      )}
    </div>
  );
};

export default AiInsightBlock;
