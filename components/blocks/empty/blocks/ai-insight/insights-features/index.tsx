"use client";

import React, { forwardRef } from "react";
import FeatureBlockLayout3 from "@/components/blocks/feature-layouts/layout3";
import { useTranslations } from 'next-intl';
import { InsightsFeaturesProps } from './types';

/**
 * Insights Features Block Component
 * 
 * Displays two sections of insights: interaction insights and relationship insights,
 * using the FeatureBlockLayout3 component for consistent styling.
 */
const InsightsFeaturesBlock = forwardRef<HTMLDivElement, InsightsFeaturesProps>(
  ({ interactionInsights, relationshipInsights, className }, ref) => {
    const t = useTranslations('chatrecapresult');
    
    return (
      <div ref={ref} className={className}>
        <div className="space-y-8">
          <FeatureBlockLayout3 
            title={t('insights.interaction_title')} 
            features={interactionInsights} 
          />
          <FeatureBlockLayout3 
            title={t('insights.relationship_title')} 
            features={relationshipInsights} 
          />
        </div>
      </div>
    );
  }
);

InsightsFeaturesBlock.displayName = "InsightsFeaturesBlock";

export default InsightsFeaturesBlock;
