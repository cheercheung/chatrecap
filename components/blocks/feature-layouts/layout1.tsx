"use client";

import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, BarChart } from 'lucide-react';

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface FeatureBlockLayout1Props {
  title: string;
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

const FeatureBlockLayout1 = forwardRef<HTMLDivElement, FeatureBlockLayout1Props>(
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

          {/* Features Grid */}
          <div className={`grid gap-6 ${
            features.length === 1 ? 'grid-cols-1' :
            features.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      {getDefaultIcon(index)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

FeatureBlockLayout1.displayName = 'FeatureBlockLayout1';

export default FeatureBlockLayout1;
