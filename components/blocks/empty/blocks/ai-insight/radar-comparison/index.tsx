"use client";

import React, { forwardRef } from 'react';
import { DualRelationshipRadar } from '@/components/ui/dual-relationship-radar';
import { RadarComparisonProps } from './types';

/**
 * Radar Comparison Block Component
 *
 * Displays a radar chart comparing communication metrics between two senders.
 * Uses the DualRelationshipRadar component to visualize the comparison.
 */
const RadarComparisonBlock = forwardRef<HTMLDivElement, RadarComparisonProps>(
  ({ sender1, sender2, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <DualRelationshipRadar
          sender1={sender1}
          sender2={sender2}
        />
      </div>
    );
  }
);

RadarComparisonBlock.displayName = 'RadarComparisonBlock';

export default RadarComparisonBlock;
