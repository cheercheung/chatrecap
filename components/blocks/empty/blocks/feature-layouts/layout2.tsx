"use client";

import React, { forwardRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock, BarChart } from 'lucide-react';

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface FeatureBlockLayout2Props {
  title: string;
  description?: string;
  features: FeatureItem[];
  className?: string;
}

// 根据索引获取默认图标
const getDefaultIcon = (index: number) => {
  const icons = [
    <MessageSquare key="message" className="h-5 w-5" />,
    <Clock key="clock" className="h-5 w-5" />,
    <BarChart key="chart" className="h-5 w-5" />
  ];
  return icons[index % icons.length];
};

const FeatureBlockLayout2 = forwardRef<HTMLDivElement, FeatureBlockLayout2Props>(
  ({ title, description, features, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="space-y-6">
          <Card className="bg-background/70 rounded-lg p-6 border border-primary/5 shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Title and Description */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">{title}</h2>
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>

                {/* Right Column: Features */}
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        {getDefaultIcon(index)}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);

FeatureBlockLayout2.displayName = 'FeatureBlockLayout2';

export default FeatureBlockLayout2;
