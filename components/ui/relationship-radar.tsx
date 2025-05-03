"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart } from '@/components/charts';
import { useTranslations } from 'next-intl';

interface MetricData {
  score: number;
  detail: string;
}

interface SenderData {
  name: string;
  interestLevel: MetricData;
  responseEnthusiasm: MetricData;
  emotionalStability: MetricData;
  responseTime: MetricData;
}

interface RelationshipRadarProps {
  sender1: SenderData;
  className?: string;
}

const RelationshipRadar: React.FC<RelationshipRadarProps> = ({
  sender1,
  className,
}) => {
  const t = useTranslations('chatrecapresult');

  // 将指标数据转换为雷达图所需的格式
  const radarData = [
    {
      subject: t('relationship_metrics.interest_level'),
      value: sender1.interestLevel.score,
      fullMark: 100,
    },
    {
      subject: t('relationship_metrics.response_enthusiasm'),
      value: sender1.responseEnthusiasm.score,
      fullMark: 100,
    },
    {
      subject: t('relationship_metrics.emotional_stability'),
      value: sender1.emotionalStability.score,
      fullMark: 100,
    },
    {
      subject: t('relationship_metrics.response_time'),
      value: sender1.responseTime.score,
      fullMark: 100,
    },
  ];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-center">
          {t.rich('relationship_metrics_radar', { name: sender1.name })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <RadarChart
            data={radarData}
            fillColor="hsl(var(--primary))"
            strokeColor="hsl(var(--primary))"
            fillOpacity={0.6}
            height={300}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { RelationshipRadar };
