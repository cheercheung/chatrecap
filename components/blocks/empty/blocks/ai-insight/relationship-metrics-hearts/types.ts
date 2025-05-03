import { MetricData } from '../sender-analysis/types';

export interface RelationshipMetricsData {
  intimacy: MetricData;
  communication: MetricData;
  trust: MetricData;
  conflict: MetricData;
}

export interface RelationshipMetricsHeartsProps {
  relationshipMetrics: RelationshipMetricsData;
  className?: string;
}
