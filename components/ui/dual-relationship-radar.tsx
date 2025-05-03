"use client";

import React from 'react';
import { cn } from "@/lib/utils";
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

interface DualRelationshipRadarProps {
  sender1: SenderData;
  sender2: SenderData;
  className?: string;
}

const DualRelationshipRadar: React.FC<DualRelationshipRadarProps> = ({
  sender1,
  sender2,
  className,
}) => {
  const t = useTranslations('chatrecapresult');

  // 将指标数据转换为雷达图所需的格式
  const createRadarData = (sender: SenderData) => [
    {
      subject: t('relationship_metrics.interest_level'),
      value: sender.interestLevel.score,
      fullMark: 100,
    },
    {
      subject: t('relationship_metrics.response_enthusiasm'),
      value: sender.responseEnthusiasm.score,
      fullMark: 100,
    },
    {
      subject: t('relationship_metrics.emotional_stability'),
      value: sender.emotionalStability.score,
      fullMark: 100,
    },
    {
      subject: t('relationship_metrics.response_time'),
      value: sender.responseTime.score,
      fullMark: 100,
    },
  ];

  const sender1Data = createRadarData(sender1);
  const sender2Data = createRadarData(sender2);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {/* Sender 1 Radar */}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2">{t.rich('relationship_metrics_radar', { name: sender1.name })}</h3>
        <div className="h-80 w-full">
          <RadarChart
            data={sender1Data}
            fillColor="hsl(var(--primary))"
            strokeColor="hsl(var(--primary))"
            fillOpacity={0.7}
            height={300}
          />
        </div>
      </div>

      {/* Sender 2 Radar */}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2">{t.rich('relationship_metrics_radar', { name: sender2.name })}</h3>
        <div className="h-80 w-full">
          <RadarChart
            data={sender2Data}
            fillColor="hsl(var(--chart-2))"
            strokeColor="hsl(var(--chart-2))"
            fillOpacity={0.7}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export { DualRelationshipRadar };
