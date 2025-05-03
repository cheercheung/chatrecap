"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTranslations } from 'next-intl';

interface MetricData {
  score: number;
  detail: string;
}

interface RelationshipMetricsProps {
  interestLevel: MetricData;
  responseEnthusiasm: MetricData;
  emotionalStability: MetricData;
  responseTime: MetricData;
  className?: string;
}

const RelationshipMetrics: React.FC<RelationshipMetricsProps> = ({
  interestLevel,
  responseEnthusiasm,
  emotionalStability,
  responseTime,
  className,
}) => {
  const t = useTranslations('chatrecapresult');

  // 定义指标数据
  const metrics = [
    {
      key: 'interest_level',
      data: interestLevel
    },
    {
      key: 'response_enthusiasm',
      data: responseEnthusiasm
    },
    {
      key: 'emotional_stability',
      data: emotionalStability
    },
    {
      key: 'response_time',
      data: responseTime
    }
  ];

  // 获取颜色基于分数
  const getColorByScore = (score: number) => {
    if (score >= 8) return 'hsl(var(--primary))';
    if (score >= 6) return 'hsl(var(--chart-2))';
    if (score >= 4) return 'hsl(var(--chart-3))';
    if (score >= 2) return 'hsl(var(--chart-4))';
    return 'hsl(var(--chart-5))';
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {metrics.map((metric) => (
        <Card key={metric.key} className="overflow-hidden border border-primary/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t(`relationship_metrics.${metric.key}`)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* 左侧：百分比圆环 */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={metric.data.score * 10} // 将 0-10 的分数转换为 0-100 的百分比
                    text={`${metric.data.score}/10`}
                    styles={buildStyles({
                      textSize: '1.5rem',
                      pathColor: getColorByScore(metric.data.score),
                      textColor: 'hsl(var(--foreground))',
                      trailColor: 'hsl(var(--muted))',
                    })}
                  />
                </div>
              </div>

              {/* 右侧：分析内容 */}
              <div className="flex-1 bg-background/50 rounded-lg p-3 border border-primary/5">
                <p className="text-sm text-muted-foreground">
                  {metric.data.detail}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export { RelationshipMetrics };
