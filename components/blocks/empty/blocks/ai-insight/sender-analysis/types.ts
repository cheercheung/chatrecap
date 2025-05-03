export interface MetricData {
  score: number;
  detail: string;
}

export interface SenderData {
  name: string;
  interestLevel: MetricData;
  responseEnthusiasm: MetricData;
  emotionalStability: MetricData;
  responseTime: MetricData;
}

export interface SenderAnalysisProps {
  data: SenderData;
  className?: string;
}
