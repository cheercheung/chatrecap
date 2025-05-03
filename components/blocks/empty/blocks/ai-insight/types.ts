import { SenderData, MetricData } from './sender-analysis/types';

export interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

export interface RelationshipMetricsData {
  intimacy: MetricData;
  communication: MetricData;
  trust: MetricData;
  conflict: MetricData;
}

export interface AiInsightData {
  personalityInsights: {
    sender1: SenderData;
    sender2: SenderData;
  };
  relationshipMetrics: RelationshipMetricsData;
  insights: {
    interaction: FeatureItem[];
    relationship: FeatureItem[];
  };
}

export interface AiInsightBlockProps {
  data: AiInsightData;
  className?: string;
}
