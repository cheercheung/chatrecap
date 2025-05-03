"use client";

import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, BarChart } from 'lucide-react';

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface FeatureBlockLayout3Props {
  title: string;
  features: FeatureItem[];
  className?: string;
}

// 根据索引获取默认图标
const getDefaultIcon = (index: number) => {
  const icons = [
    <MessageSquare key="message" className="h-6 w-6" />,
    <Clock key="clock" className="h-6 w-6" />,
    <BarChart key="chart" className="h-6 w-6" />
  ];
  return icons[index % icons.length];
};

const FeatureBlockLayout3 = forwardRef<HTMLDivElement, FeatureBlockLayout3Props>(
  ({ title, features, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="space-y-6">
          {/* Title Card */}
          <Card className="bg-background/70 rounded-lg p-4 border border-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-center">
                {title}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Features Stack */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getDefaultIcon(index)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
);

FeatureBlockLayout3.displayName = 'FeatureBlockLayout3';

export default FeatureBlockLayout3;
