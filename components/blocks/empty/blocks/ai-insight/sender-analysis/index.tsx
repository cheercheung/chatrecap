"use client";

import React, { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { RelationshipMetrics } from '@/components/ui/relationship-metrics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SenderAnalysisProps } from './types';

/**
 * SenderAnalysis Block Component
 *
 * Displays a comprehensive analysis of a sender's communication patterns
 * including interest level, response enthusiasm, emotional stability, and response time.
 */
const SenderAnalysisBlock = forwardRef<HTMLDivElement, SenderAnalysisProps>(
  ({ data, className }, ref) => {
    const t = useTranslations('chatrecapresult');
    const { name, interestLevel, responseEnthusiasm, emotionalStability, responseTime } = data;

    return (
      <div ref={ref} className={className}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Analysis Title Card */}
          <Card className="bg-background/70 rounded-lg p-4 border border-primary/10 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t.rich('relationship_analysis.title', { sender: name })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                {t('relationship_analysis.description')}
              </p>
            </CardContent>
          </Card>

          {/* Relationship Metrics */}
          <RelationshipMetrics
            interestLevel={interestLevel}
            responseEnthusiasm={responseEnthusiasm}
            emotionalStability={emotionalStability}
            responseTime={responseTime}
          />
        </motion.div>
      </div>
    );
  }
);

SenderAnalysisBlock.displayName = 'SenderAnalysisBlock';

export default SenderAnalysisBlock;
