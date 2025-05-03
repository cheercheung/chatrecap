"use client";

import React, { forwardRef } from "react";
import FeatureBlockLayout3 from "@/components/blocks/feature-layouts/layout3";

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface Layout3DoubleProps {
  interactionInsights: FeatureItem[];
  relationshipInsights: FeatureItem[];
  className?: string;
}

const Layout3Double = forwardRef<HTMLDivElement, Layout3DoubleProps>(
  ({ interactionInsights, relationshipInsights, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="space-y-8">
          <FeatureBlockLayout3 title="Interaction Insights" features={interactionInsights} />
          <FeatureBlockLayout3 title="Relationship Insights" features={relationshipInsights} />
        </div>
      </div>
    );
  }
);

Layout3Double.displayName = "Layout3Double";

export default Layout3Double;
