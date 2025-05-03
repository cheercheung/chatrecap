export interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

export interface InsightsFeaturesProps {
  interactionInsights: FeatureItem[];
  relationshipInsights: FeatureItem[];
  className?: string;
}
