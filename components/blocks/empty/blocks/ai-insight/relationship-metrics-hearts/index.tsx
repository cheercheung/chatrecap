"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartMatchRating } from '@/components/ui/rating-visualizations/heart-match';
import { RelationshipMetricsHeartsProps } from './types';

/**
 * Relationship Metrics Hearts Block Component
 *
 * Displays relationship metrics using heart visualizations for intimacy,
 * communication, trust, and conflict scores.
 */
const RelationshipMetricsHeartsBlock = forwardRef<HTMLDivElement, RelationshipMetricsHeartsProps>(
  ({ relationshipMetrics, className }, ref) => {
    const t = useTranslations('chatrecapresult');

    // Define metrics to display
    const metrics = [
      { key: 'intimacy', data: relationshipMetrics.intimacy },
      { key: 'communication', data: relationshipMetrics.communication },
      { key: 'trust', data: relationshipMetrics.trust },
      { key: 'conflict', data: relationshipMetrics.conflict }
    ];

    return (
      <div ref={ref} className={className}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Title Card */}
          <Card className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-center">
                {t('relationship_metrics_hearts.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                {t('relationship_metrics_hearts.description')}
              </p>
            </CardContent>
          </Card>

          {/* Heart Ratings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.key} className="overflow-hidden">
                <CardContent className="p-6">
                  <HeartMatchRating
                    titleKey={metric.key}
                    score={metric.data.score}
                    content={metric.data.detail}
                    compact={true}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }
);

RelationshipMetricsHeartsBlock.displayName = 'RelationshipMetricsHeartsBlock';

export default RelationshipMetricsHeartsBlock;
